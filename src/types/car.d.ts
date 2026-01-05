// types/car.d.ts

import { Car, CarModel, CarStatus, CarType } from '@prisma/client';

// 차량 목록 조회를 위한 쿼리 파라미터 타입
export interface GetCarsQuery {
  page?: string;
  pageSize?: string;
  status?: CarStatus;
  searchBy?: 'carNumber' | 'model';
  keyword?: string;
}

// 차량 생성을 위한 데이터 타입 (DTO: Data Transfer Object)
export interface CreateCarDto {
  carNumber: string;
  manufacturer: string;
  model: string;
  type: CarType;
  manufacturingYear: number;
  mileage: number;
  price: number;
  accidentCount: number;
  explanation?: string;
  accidentDetails?: string;
}

// 차량 수정을 위한 데이터 타입
export interface UpdateCarDto extends Partial<Omit<CreateCarDto, 'type'>> {}

// API 응답으로 전달될 차량 정보 타입
export interface CarResponse extends Omit<Car, 'companyId' | 'carModelId'> {
  manufacturer: string;
  model: string;
  type: CarType;
}

// 차량 모델 목록 응답 타입
export interface CarModelResponse {
  manufacturer: string;
  model: string[];
}
// 차량 목록 조회 시 사용되는 쿼리 타입
export interface CarListQuery {
  page?: number;
  pageSize?: number;
  status?: CarStatus;
  searchBy?: 'carNumber' | 'model';
  keyword?: string;
}
