import {
  ValidationError,
  NotFoundError,
  ForbiddenError,
} from '../../errors/error-handler.js';
import type { CreateCarDto, UpdateCarDto } from '../../types/car.d.js';
import { CarRepository } from './car-repository.js';

export class CarValidator {
  static validateCreate(dto: CreateCarDto) {
    if (!dto.carNumber) {
      throw new ValidationError('carNumber', '차량 번호는 필수입니다');
    }

    if (!dto.manufacturer || !dto.model) {
      throw new ValidationError(null, '제조사와 차종은 필수입니다');
    }

    if (dto.manufacturingYear < 1900) {
      throw new ValidationError(
        'manufacturingYear',
        '제조년도는 1900년 이후여야 합니다'
      );
    }
  }

  static validateUpdate(dto: UpdateCarDto) {
    if (dto.manufacturingYear !== undefined && dto.manufacturingYear < 1900) {
      throw new ValidationError(
        'manufacturingYear',
        '제조년도는 1900년 이후여야 합니다'
      );
    }
  }

  static async validateOwnership(companyId: number, carId: number) {
    const car = await CarRepository.findById(companyId, carId);

    if (!car) {
      throw new NotFoundError('존재하지 않는 차량입니다');
    }

    if (car.companyId !== companyId) {
      throw new ForbiddenError('권한이 없습니다');
    }

    return car;
  }
}
