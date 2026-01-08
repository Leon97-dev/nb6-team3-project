// @ts-nocheck
// src/cars/car-validator.ts
import { ValidationError } from '../../errors/error-handler.js';

interface CreateCarInput {
  carNumber: string;
  manufacturer: string;
  model: string;
  manufacturingYear: number;
  mileage: number;
  price: number;
  accidentCount: number;
  explanation?: string;
  accidentDetails?: string;
}

export function validateCreateCar(body: unknown): CreateCarInput {
  if (!body || typeof body !== 'object') {
    throw new ValidationError(null, '요청 데이터가 올바르지 않습니다');
  }

  const data = body as Record<string, unknown>;

  if (
    typeof data.carNumber !== 'string' ||
    typeof data.manufacturer !== 'string' ||
    typeof data.model !== 'string' ||
    typeof data.manufacturingYear !== 'number' ||
    typeof data.mileage !== 'number' ||
    typeof data.price !== 'number' ||
    typeof data.accidentCount !== 'number'
  ) {
    throw new ValidationError(null, '필수 필드가 누락되었습니다');
  }

  return {
    carNumber: data.carNumber,
    manufacturer: data.manufacturer,
    model: data.model,
    manufacturingYear: data.manufacturingYear,
    mileage: data.mileage,
    price: data.price,
    accidentCount: data.accidentCount,
    explanation:
      typeof data.explanation === 'string' ? data.explanation : undefined,
    accidentDetails:
      typeof data.accidentDetails === 'string'
        ? data.accidentDetails
        : undefined,
  };
}
