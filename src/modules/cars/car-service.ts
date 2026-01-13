import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { CarType, type Car, type CarModel, type Prisma } from '@prisma/client';
import { NotFoundError, ValidationError } from '../../errors/error-handler.js';
import {
  CAR_STATUS_API_TO_DB,
  CAR_STATUS_DB_TO_API,
  CAR_TYPE_LABEL_MAP,
} from '../../utils/enum-mapper.js';
import { CarCsvSchema, type CarCsvRow } from './car-csv.js';
import { carsRepository } from './car-repository.js';

// 1) 타입 및 유틸 함수 정의
export type ApiCarStatus = keyof typeof CAR_STATUS_API_TO_DB;
export type CarResponse = ReturnType<typeof formatCarResponse>;
type CarWithModel = Car & { carModel: CarModel };

export type CarCreatePayload = {
  carNumber?: string;
  manufacturer?: string;
  model?: string;
  manufacturingYear?: number | string;
  mileage?: number | string;
  price?: number | string;
  accidentCount?: number | string;
  explanation?: string | null;
  accidentDetails?: string | null;
};

export type CarUpdatePayload = CarCreatePayload & {
  status?: ApiCarStatus;
};

const toDbCarStatus = (status: ApiCarStatus | undefined | null) =>
  status ? CAR_STATUS_API_TO_DB[status] || null : null;

const toApiCarStatus = (status: Car['status']) =>
  CAR_STATUS_DB_TO_API[status] || 'possession';

const formatCarResponse = (car: CarWithModel) => ({
  id: car.id,
  carNumber: car.carNumber,
  manufacturer: car.carModel.manufacturer,
  model: car.carModel.model,
  manufacturingYear: car.manufacturingYear,
  mileage: car.mileage,
  price: car.price,
  accidentCount: car.accidentCount,
  explanation: car.explanation,
  accidentDetails: car.accidentDetails,
  status: toApiCarStatus(car.status),
  type: CAR_TYPE_LABEL_MAP[car.carModel.type] || car.carModel.type,
});

const ensureCarModel = async (
  manufacturer: string,
  model: string
): Promise<CarModel> => {
  const existing = await carsRepository.findCarModel(manufacturer, model);
  if (existing) return existing;

  return carsRepository.createCarModel(manufacturer, model, CarType.SUV);
};

export const carsService = {
  // 2) 차량 생성
  async createCar(
    companyId: number,
    data: CarCreatePayload
  ): Promise<CarResponse> {
    const {
      carNumber,
      manufacturer,
      model,
      manufacturingYear,
      mileage,
      price,
      accidentCount,
      explanation,
      accidentDetails,
    } = data;
    if (
      !carNumber ||
      !manufacturer ||
      !model ||
      !manufacturingYear ||
      mileage === undefined ||
      price === undefined
    ) {
      throw new ValidationError(null, '잘못된 요청입니다');
    }

    const normalizedManufacturer = manufacturer.trim();
    const normalizedModel = model.trim();
    const normalizedCarNumber = carNumber.trim();
    const exists = await carsRepository.findByCarNumber(
      companyId,
      normalizedCarNumber
    );

    if (exists) {
      throw new ValidationError(null, '잘못된 요청입니다');
    }

    const carModel = await ensureCarModel(
      normalizedManufacturer,
      normalizedModel
    );

    const manufacturingYearNumber = Number(manufacturingYear);
    const mileageNumber = Number(mileage);
    const priceNumber = Number(price);
    const accidentCountNumber = Number(accidentCount ?? 0);

    if (
      [manufacturingYearNumber, mileageNumber, priceNumber].some((value) =>
        Number.isNaN(value)
      )
    ) {
      throw new ValidationError(null, '잘못된 요청입니다');
    }

    const car = await carsRepository.create({
      company: { connect: { id: companyId } },
      carModel: { connect: { id: carModel.id } },
      carNumber: normalizedCarNumber,
      manufacturingYear: manufacturingYearNumber,
      mileage: mileageNumber,
      price: priceNumber,
      accidentCount: Number.isNaN(accidentCountNumber)
        ? 0
        : accidentCountNumber,
      explanation: explanation ?? null,
      accidentDetails: accidentDetails ?? null,
    });

    return formatCarResponse(car);
  },

  // 3) 차량 목록 조회
  async getCars(
    companyId: number,
    page: number | string = 1,
    pageSize: number | string = 10,
    status?: ApiCarStatus,
    searchBy?: 'carNumber' | 'model',
    keyword?: string
  ) {
    page = Number(page) || 1;
    pageSize = Number(pageSize) || 10;

    const where: Prisma.CarWhereInput = { companyId };

    if (status) {
      const dbStatus = toDbCarStatus(status);
      if (!dbStatus) {
        throw new ValidationError(null, '잘못된 요청입니다');
      }
      where.status = dbStatus;
    }

    if (searchBy && keyword) {
      if (searchBy === 'carNumber') {
        where.carNumber = { contains: keyword };
      }
      if (searchBy === 'model') {
        where.carModel = { model: { contains: keyword } };
      }
    }

    const totalItemCount = await carsRepository.count(where);
    const data = await carsRepository.findAll(where, page, pageSize);

    return {
      currentPage: page,
      totalPages: Math.ceil(totalItemCount / pageSize),
      totalItemCount,
      data: data.map((car) => formatCarResponse(car as CarWithModel)),
    };
  },

  // 4) 차량 상세 조회
  async getCarById(companyId: number, carId: number) {
    const car = await carsRepository.findById(companyId, carId);

    if (!car) {
      throw new NotFoundError('존재하지 않는 차량입니다');
    }

    return formatCarResponse(car as CarWithModel);
  },

  // 5) 차량 수정
  async updateCar(companyId: number, carId: number, data: CarUpdatePayload) {
    const car = await carsRepository.findById(companyId, carId);

    if (!car) {
      throw new NotFoundError('존재하지 않는 차량입니다');
    }

    const updatedManufacturer =
      data.manufacturer !== undefined
        ? data.manufacturer
        : car.carModel.manufacturer;
    const updatedModel =
      data.model !== undefined ? data.model : car.carModel.model;
    let nextCarModelId = car.carModel.id;

    if (data.manufacturer !== undefined || data.model !== undefined) {
      const nextCarModel = await ensureCarModel(
        updatedManufacturer,
        updatedModel
      );
      nextCarModelId = nextCarModel.id;
    }

    let nextStatus = car.status;
    if (data.status !== undefined) {
      const dbStatus = toDbCarStatus(data.status);
      if (!dbStatus) {
        throw new ValidationError(null, '잘못된 요청입니다');
      }
      nextStatus = dbStatus;
    }

    const manufacturingYearValue =
      data.manufacturingYear !== undefined
        ? Number(data.manufacturingYear)
        : car.manufacturingYear;
    const mileageValue =
      data.mileage !== undefined ? Number(data.mileage) : car.mileage;
    const priceValue =
      data.price !== undefined ? Number(data.price) : car.price;
    const accidentCountValue =
      data.accidentCount !== undefined
        ? Number(data.accidentCount)
        : car.accidentCount;

    if (
      [manufacturingYearValue, mileageValue, priceValue].some((value) =>
        Number.isNaN(value)
      )
    ) {
      throw new ValidationError(null, '잘못된 요청입니다');
    }

    const nextCarNumber =
      data.carNumber !== undefined ? data.carNumber.trim() : car.carNumber;

    if (nextCarNumber !== car.carNumber) {
      const dup = await carsRepository.findByCarNumber(
        companyId,
        nextCarNumber
      );
      if (dup && dup.id !== car.id) {
        throw new ValidationError(null, '잘못된 요청입니다');
      }
    }

    const updated = await carsRepository.update(carId, {
      carNumber: nextCarNumber,
      carModel: { connect: { id: nextCarModelId } },
      manufacturingYear: manufacturingYearValue,
      mileage: mileageValue,
      price: priceValue,
      accidentCount: Number.isNaN(accidentCountValue)
        ? car.accidentCount
        : accidentCountValue,
      explanation:
        data.explanation !== undefined ? data.explanation : car.explanation,
      accidentDetails:
        data.accidentDetails !== undefined
          ? data.accidentDetails
          : car.accidentDetails,
      status: nextStatus,
    });

    return formatCarResponse(updated as CarWithModel);
  },

  // 6) 차량 삭제
  async deleteCar(companyId: number, carId: number) {
    const car = await carsRepository.findById(companyId, carId);

    if (!car) {
      throw new NotFoundError('존재하지 않는 차량입니다');
    }

    await carsRepository.delete(carId);

    return true;
  },

  // 7) 차량 일괄 생성
  async bulkUpload(companyId: number, filePath: string) {
    const file = fs.readFileSync(filePath);
    const rows = parse(file, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Array<Record<string, string>>;

    if (!rows.length) {
      throw new ValidationError(null, '잘못된 요청입니다');
    }

    const operations: Prisma.CarCreateInput[] = [];
    const seenCarNumbers = new Set<string>();
    const normalizedCarNumbers: string[] = [];
    const carModelCache = new Map<string, CarModel>();
    for (const row of rows) {
      const manufacturer = row.manufacturer?.trim();
      const model = row.model?.trim();
      const carNumber = row.carNumber?.trim();

      if (!manufacturer || !model || !carNumber) {
        throw new ValidationError(null, '잘못된 요청입니다');
      }

      if (seenCarNumbers.has(carNumber)) {
        throw new ValidationError(null, '잘못된 요청입니다');
      }
      seenCarNumbers.add(carNumber);
      normalizedCarNumbers.push(carNumber);

      const manufacturingYear = Number(row.manufacturingYear);
      const mileage = Number(row.mileage);
      const price = Number(row.price);
      const accidentCount = Number(row.accidentCount ?? 0);

      if (
        Number.isNaN(manufacturingYear) ||
        Number.isNaN(mileage) ||
        Number.isNaN(price)
      ) {
        throw new ValidationError(null, '잘못된 요청입니다');
      }

      const carModelKey = `${manufacturer}|${model}`;
      let carModel = carModelCache.get(carModelKey);
      if (!carModel) {
        carModel = await ensureCarModel(manufacturer, model);
        carModelCache.set(carModelKey, carModel);
      }

      operations.push({
        company: { connect: { id: companyId } },
        carModel: { connect: { id: carModel.id } },
        carNumber,
        manufacturingYear,
        mileage,
        price,
        accidentCount,
        explanation: row.explanation?.trim() || null,
        accidentDetails: row.accidentDetails?.trim() || null,
      });
    }

    if (normalizedCarNumbers.length) {
      const existing = await carsRepository.findExistingCarNumbers(
        companyId,
        normalizedCarNumbers
      );
      if (existing.length) {
        throw new ValidationError(null, '잘못된 요청입니다');
      }
    }

    await carsRepository.bulkCreate(operations);

    return true;
  },

  // 8) 차량 모델 목록 조회
  async getCarModels() {
    const items = await carsRepository.findCarModels();
    const grouped: Record<string, string[]> = {};

    for (const item of items) {
      const list = grouped[item.manufacturer] || [];
      list.push(item.model);
      grouped[item.manufacturer] = list;
    }

    return Object.keys(grouped).map((m) => ({
      manufacturer: m,
      model: grouped[m],
    }));
  },
};

const BULK_BATCH_SIZE = 200;

export class CarServiceBulk {
  static async bulkUploadCsv(companyId: number, buffer: Buffer) {
    const rows = parse(buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Array<Record<string, string>>;

    if (!rows.length) {
      throw new ValidationError(null, '잘못된 요청입니다');
    }

    let batch: CarCsvRow[] = [];
    let success = 0;

    for (const row of rows) {
      const parsed = CarCsvSchema.safeParse(row);
      if (!parsed.success) {
        throw new ValidationError(null, '잘못된 요청입니다');
      }

      batch.push(parsed.data);
      if (batch.length >= BULK_BATCH_SIZE) {
        success += await this.insertBatch(companyId, batch);
        batch = [];
      }
    }

    if (batch.length) {
      success += await this.insertBatch(companyId, batch);
    }

    return success;
  }

  static async bulkUoloadFromCsv(companyId: number, buffer: Buffer) {
    return this.bulkUploadCsv(companyId, buffer);
  }

  private static async insertBatch(companyId: number, batch: CarCsvRow[]) {
    const operations: Prisma.CarCreateInput[] = [];
    const seenCarNumbers = new Set<string>();
    const normalizedCarNumbers: string[] = [];
    const carModelCache = new Map<string, CarModel>();

    for (const row of batch) {
      const manufacturer = row.manufacturer?.trim();
      const model = row.model?.trim();
      const carNumber = row.carNumber?.trim();

      if (!manufacturer || !model || !carNumber) {
        throw new ValidationError(null, '잘못된 요청입니다');
      }

      if (seenCarNumbers.has(carNumber)) {
        throw new ValidationError(null, '잘못된 요청입니다');
      }
      seenCarNumbers.add(carNumber);
      normalizedCarNumbers.push(carNumber);

      const manufacturingYear = Number(row.manufacturingYear);
      const mileage = Number(row.mileage);
      const price = Number(row.price);
      const accidentCount = Number(row.accidentCount ?? 0);

      if (
        Number.isNaN(manufacturingYear) ||
        Number.isNaN(mileage) ||
        Number.isNaN(price)
      ) {
        throw new ValidationError(null, '잘못된 요청입니다');
      }

      const carModelKey = `${manufacturer}|${model}`;
      let carModel = carModelCache.get(carModelKey);
      if (!carModel) {
        carModel = await ensureCarModel(manufacturer, model);
        carModelCache.set(carModelKey, carModel);
      }

      operations.push({
        company: { connect: { id: companyId } },
        carModel: { connect: { id: carModel.id } },
        carNumber,
        manufacturingYear,
        mileage,
        price,
        accidentCount,
        explanation: row.explanation?.trim() || null,
        accidentDetails: row.accidentDetails?.trim() || null,
      });
    }

    if (normalizedCarNumbers.length) {
      const existing = await carsRepository.findExistingCarNumbers(
        companyId,
        normalizedCarNumbers
      );
      if (existing.length) {
        throw new ValidationError(null, '잘못된 요청입니다');
      }
    }

    await carsRepository.bulkCreate(operations);
    return operations.length;
  }
}
