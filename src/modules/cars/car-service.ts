import prisma from '../../configs/prisma.js';
import { NotFoundError, ValidationError } from '../../errors/error-handler.js';
import type {
  CreateCarDto,
  UpdateCarDto,
  CarListQuery,
  CarStatusQuery,
} from '../../types/car.d.js';
import { CarStatus, CarType } from '@prisma/client';
import type { Prisma } from '@prisma/client';
import { parseCarCsv } from './car-csv.js';
import {
  CAR_STATUS_DB_TO_API,
  CAR_TYPE_LABEL_MAP,
} from '../../utils/enum-mapper.js';

const BATCH_SIZE = 200;

export type ApiCarStatus =
  | 'possession'
  | 'contractProceeding'
  | 'contractCompleted';

export function mapCarStatusToApi(status: CarStatus): ApiCarStatus {
  switch (status) {
    case CarStatus.POSSESSION:
      return 'possession';
    case CarStatus.CONTRACT_PROCEEDING:
      return 'contractProceeding';
    case CarStatus.CONTRACT_COMPLETED:
      return 'contractCompleted';
  }
}
export interface CarModelListItem {
  manufacturer: string;
  model: string[];
}

export class CarService {
  static async getOrCreateCarModel(
    manufacturer: string,
    model: string,
    type: CarType
  ) {
    return prisma.carModel.upsert({
      where: { manufacturer_model: { manufacturer, model } },
      update: {},
      create: {
        manufacturer,
        model,
        type: type as CarType,
      },
    });
  }

  private static mapStatus(status?: CarStatusQuery): CarStatus | undefined {
    switch (status) {
      case 'possession':
        return CarStatus.POSSESSION;
      case 'contractProceeding':
        return CarStatus.CONTRACT_PROCEEDING;
      case 'contractCompleted':
        return CarStatus.CONTRACT_COMPLETED;
      default:
        return undefined;
    }
  }

  static async create(companyId: number, dto: CreateCarDto) {
    const carModel = await this.getOrCreateCarModel(
      dto.manufacturer,
      dto.model,
      dto.type
    );

    return prisma.car.create({
      data: {
        carNumber: dto.carNumber,
        manufacturingYear: dto.manufacturingYear,
        mileage: dto.mileage,
        price: dto.price,
        accidentCount: dto.accidentCount,
        explanation: dto.explanation ?? null,
        accidentDetails: dto.accidentDetails ?? null,
        companyId,
        carModelId: carModel.id,
      },
      include: { carModel: true },
    });
  }

  static async list(companyId: number, query: CarListQuery) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;

    const where: Prisma.CarWhereInput = { companyId };

    const status = this.mapStatus(query.status);
    if (status) where.status = status;

    if (query.searchBy && query.keyword) {
      if (query.searchBy === 'carNumber') {
        where.carNumber = { contains: query.keyword };
      } else {
        where.carModel = { model: { contains: query.keyword } };
      }
    }

    const [items, total] = await Promise.all([
      prisma.car.findMany({
        where,
        include: { carModel: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.car.count({ where }),
    ]);

    return {
      currentPage: page,
      totalPages: Math.ceil(total / pageSize),
      totalItemCount: total,
      data: items.map((car) => ({
        id: car.id,
        carNumber: car.carNumber,
        manufacturer: car.carModel.manufacturer,
        model: car.carModel.model,
        type: car.carModel.type,
        manufacturingYear: car.manufacturingYear,
        mileage: car.mileage,
        price: car.price,
        accidentCount: car.accidentCount,
        explanation: car.explanation,
        accidentDetails: car.accidentDetails,
        status: mapCarStatusToApi(car.status),
      })),
    };
  }

  static async detail(companyId: number, carId: number) {
    const car = await prisma.car.findFirst({
      where: { id: carId, companyId },
      include: { carModel: true },
    });

    if (!car) throw new NotFoundError('존재하지 않는 차량입니다');
    return car;
  }

  static async update(companyId: number, carId: number, dto: UpdateCarDto) {
    const car = await this.detail(companyId, carId);

    let carModelId = car.carModelId;

    if (dto.manufacturer && dto.model) {
      const carModel = await this.getOrCreateCarModel(
        dto.manufacturer,
        dto.model,
        car.carModel.type
      );
      carModelId = carModel.id;
    }

    const updatedCar = await prisma.car.update({
      where: { id: carId },
      data: { ...dto, carModelId },
      include: { carModel: true },
    });

    return {
      id: updatedCar.id,
      carNumber: updatedCar.carNumber,
      manufacturer: updatedCar.carModel.manufacturer,
      model: updatedCar.carModel.model,
      type:
        CAR_TYPE_LABEL_MAP[updatedCar.carModel.type] ??
        updatedCar.carModel.type,
      manufacturingYear: updatedCar.manufacturingYear,
      mileage: updatedCar.mileage,
      price: updatedCar.price,
      accidentCount: updatedCar.accidentCount,
      explanation: updatedCar.explanation,
      accidentDetails: updatedCar.accidentDetails,
      status: CAR_STATUS_DB_TO_API[updatedCar.status] ?? updatedCar.status,
    };
  }

  static async delete(companyId: number, carId: number) {
    await this.detail(companyId, carId);
    await prisma.car.delete({ where: { id: carId } });
  }

  // 차량 모델 목록 조회
  static async listCarModels(
    companyId: number
  ): Promise<{ data: CarModelListItem[] }> {
    const models = await prisma.carModel.findMany({
      where: { cars: { some: { companyId } } },
      select: { manufacturer: true, model: true },
      orderBy: { manufacturer: 'asc' },
    });

    const grouped = models.reduce<Record<string, string[]>>((acc, cur) => {
      const manufacturer = cur.manufacturer;

      if (!acc[manufacturer]) {
        acc[manufacturer] = [];
      }

      acc[manufacturer].push(cur.model);
      return acc;
    }, {});

    return {
      data: Object.entries(grouped).map(([manufacturer, model]) => ({
        manufacturer,
        model,
      })),
    };
  }
}

// 차량 데이터 대용량 업로드
export class CarServiceBulk {
  static async bulkUoloadFromCsv(
    companyId: number,
    buffer: Buffer
  ): Promise<void> {
    const cars: CreateCarDto[] = await parseCarCsv(buffer);

    if (cars.length === 0) {
      throw new ValidationError(null, '잘못된 요청입니다.');
    }

    for (let i = 0; i < cars.length; i += BATCH_SIZE) {
      const batch: CreateCarDto[] = cars.slice(i, i + BATCH_SIZE);

      await prisma.$transaction(async (tx) => {
        for (const dto of batch) {
          const carModel = await tx.carModel.upsert({
            where: {
              manufacturer_model: {
                manufacturer: dto.manufacturer,
                model: dto.model,
              },
            },
            update: {},
            create: {
              manufacturer: dto.manufacturer,
              model: dto.model,
              type: dto.type,
            },
          });

          await tx.car.create({
            data: {
              carNumber: dto.carNumber,
              manufacturingYear: dto.manufacturingYear,
              mileage: dto.mileage,
              price: dto.price,
              accidentCount: dto.accidentCount,
              explanation: dto.explanation ?? null,
              accidentDetails: dto.accidentDetails ?? null,
              companyId,
              carModelId: carModel.id,
            },
          });
        }
      });
    }
  }
}
