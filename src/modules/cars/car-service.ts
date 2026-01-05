import prisma from '../../configs/prisma.js';
import { NotFoundError } from '../../errors/error-handler.js';
import type {
  CreateCarDto,
  UpdateCarDto,
  CarListQuery,
} from '../../types/car.d.js';

export class CarService {
  static async getOrCreateCarModel(
    manufacturer: string,
    model: string,
    type: any
  ) {
    return prisma.carModel.upsert({
      where: {
        manufacturer_model: { manufacturer, model },
      },
      update: {},
      create: { manufacturer, model, type },
    });
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
        ...(dto.explanation !== undefined && {
          explanation: dto.explanation,
        }),
        ...(dto.accidentDetails !== undefined && {
          accidentDetails: dto.accidentDetails,
        }),
        companyId,
        carModelId: carModel.id,
      },
      include: { carModel: true },
    });
  }

  static async findList(companyId: number, query: CarListQuery) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;

    const where: any = { companyId };

    if (query.status) where.status = query.status;

    if (query.searchBy && query.keyword) {
      if (query.searchBy === 'carNumber') {
        where.carNumber = { contains: query.keyword };
      } else {
        where.carModel = {
          model: { contains: query.keyword },
        };
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
        status: car.status,
      })),
    };
  }

  static async findOne(companyId: number, carId: number) {
    const car = await prisma.car.findFirst({
      where: { id: carId, companyId },
      include: { carModel: true },
    });

    if (!car) throw new NotFoundError('존재하지 않는 차량입니다');

    return car;
  }

  static async update(companyId: number, carId: number, dto: UpdateCarDto) {
    const car = await this.findOne(companyId, carId);

    let carModelId = car.carModelId;

    if (dto.manufacturer && dto.model) {
      const carModel = await this.getOrCreateCarModel(
        dto.manufacturer,
        dto.model,
        car.carModel.type
      );
      carModelId = carModel.id;
    }

    return prisma.car.update({
      where: { id: carId },
      data: {
        ...dto,
        carModelId,
      },
      include: { carModel: true },
    });
  }

  static async delete(companyId: number, carId: number) {
    await this.findOne(companyId, carId);
    await prisma.car.delete({ where: { id: carId } });
  }
}
