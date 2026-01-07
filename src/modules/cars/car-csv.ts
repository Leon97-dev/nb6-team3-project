import csv from 'csv-parser';
import { Readable } from 'stream';
import { ValidationError } from '../../errors/error-handler.js';
import type { CreateCarDto } from '../../types/car.d.js';
import { CarType } from '@prisma/client';

const CAR_TYPE_MAP: Record<string, CarType> = {
  COMPACT: CarType.COMPACT,
  MID_SIZE: CarType.MID_SIZE,
  LARGE: CarType.LARGE,
  SPORTS_CAR: CarType.SPORTS_CAR,
  SUV: CarType.SUV,
};

export async function parseCarCsv(buffer: Buffer): Promise<CreateCarDto[]> {
  const cars: CreateCarDto[] = [];
  const stream = Readable.from(buffer);

  let rowNumber = 1;

  for await (const row of stream.pipe(csv())) {
    try {
      const type = CAR_TYPE_MAP[row.type];
      if (!type) {
        throw new ValidationError(
          'type',
          `지원하지 않는 차량 타입입니다 (row ${rowNumber})`
        );
      }

      cars.push({
        carNumber: row.carNumber,
        manufacturer: row.manufacturer,
        model: row.model,
        type,
        manufacturingYear: Number(row.manufacturingYear),
        mileage: Number(row.mileage),
        price: Number(row.price),
        accidentCount: Number(row.accidentCount),
        explanation: row.explanation || undefined,
        accidentDetails: row.accidentDetails || undefined,
      });
    } catch (e) {
      throw new ValidationError(
        null,
        `CSV ${rowNumber}번째 행 처리 중 오류가 발생했습니다`
      );
    }

    rowNumber++;
  }

  return cars;
}
