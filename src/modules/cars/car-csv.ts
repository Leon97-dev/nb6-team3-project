import fs from 'fs';
import csv from 'csv-parser';
import type { CreateCarDto } from '../../types/car.d.js';

export function parseCarCsv(filePath: string): Promise<CreateCarDto[]> {
  const cars: CreateCarDto[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        cars.push({
          carNumber: row.carNumber,
          manufacturer: row.manufacturer,
          model: row.model,
          type: row.type,
          manufacturingYear: Number(row.manufacturingYear),
          mileage: Number(row.mileage),
          price: Number(row.price),
          accidentCount: Number(row.accidentCount),
          explanation: row.explanation || undefined,
          accidentDetails: row.accidentDetails || undefined,
        });
      })
      .on('end', () => resolve(cars))
      .on('error', reject);
  });
}
