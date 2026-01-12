import csv from 'csv-parser';
import { Readable } from 'stream';
import { z } from 'zod';
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

const CarCsvRowSchema = z.object({
  carNumber: z.string().min(1),
  manufacturer: z.string().min(1),
  model: z.string().min(1),
  type: z.string().min(1),
  manufacturingYear: z.coerce.number().int(),
  mileage: z.coerce.number().int(),
  price: z.coerce.number().int(),
  accidentCount: z.coerce.number().int(),
  explanation: z.string().optional(),
  accidentDetails: z.string().optional(),
});

export async function parseCarCsv(buffer: Buffer): Promise<CreateCarDto[]> {
  const cars: CreateCarDto[] = [];
  const stream = Readable.from(buffer);

  for await (const rawRow of stream.pipe(csv())) {
    const row = CarCsvRowSchema.parse(rawRow);

    const type = CAR_TYPE_MAP[row.type];
    if (!type) {
      throw new ValidationError(null, '잘못된 요청입니다.');
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
  }

  if (cars.length === 0) {
    throw new ValidationError(null, '잘못된 요청입니다');
  }

  return cars;
}
