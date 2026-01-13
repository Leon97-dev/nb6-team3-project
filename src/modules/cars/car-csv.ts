import csv from 'csv-parser';
import { Readable } from 'stream';
import { z } from 'zod';
import { ValidationError } from '../../errors/error-handler.js';
import type { CreateCarDto } from '../../types/car.d.js';
import { CarType } from '@prisma/client';

//CSV → enum 매핑

const CAR_TYPE_MAP: Record<string, CarType> = {
  COMPACT: CarType.COMPACT,
  MID_SIZE: CarType.MID_SIZE,
  LARGE: CarType.LARGE,
  SPORTS_CAR: CarType.SPORTS_CAR,
  SUV: CarType.SUV,
};

//CSV Row Zod Schema

const CarCsvRowSchema = z.object({
  carNumber: z.string().min(1),
  manufacturer: z.string().min(1),
  model: z.string().min(1),
  type: z.string(),
  manufacturingYear: z.coerce.number().int(),
  mileage: z.coerce.number().int(),
  price: z.coerce.number().int(),
  accidentCount: z.coerce.number().int(),
  explanation: z.string().optional(),
  accidentDetails: z.string().optional(),
});

type CarCsvRow = z.infer<typeof CarCsvRowSchema>;

//CSV Parser

export async function parseCarCsv(buffer: Buffer): Promise<CreateCarDto[]> {
  const cars: CreateCarDto[] = [];
  const stream = Readable.from(buffer);

  let rowNumber = 1;

  for await (const rawRow of stream.pipe(csv())) {
    try {
      const row: CarCsvRow = CarCsvRowSchema.parse(rawRow);

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
        manufacturingYear: row.manufacturingYear,
        mileage: row.mileage,
        price: row.price,
        accidentCount: row.accidentCount,
        explanation: row.explanation ?? null,
        accidentDetails: row.accidentDetails ?? null,
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
