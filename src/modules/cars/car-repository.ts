// TODO) Car-Repository:
// ========= Imports =========
import type { Car, Prisma } from '@prisma/client';
import prisma from '../../configs/prisma.js';
// ========= Imports =========

export const carsRepository = {
  // 1) 차량 생성
  create(data: Prisma.CarCreateInput) {
    return prisma.car.create({ data, include: { carModel: true } });
  },

  // 2) 차량 번호로 조회
  findByCarNumber(companyId: number, carNumber: string) {
    return prisma.car.findFirst({
      where: { companyId, carNumber },
    });
  },

  // 3) 차량 모델로 조회
  findCarModel(manufacturer: string, model: string) {
    return prisma.carModel.findFirst({
      where: { manufacturer, model },
      select: { id: true, manufacturer: true, model: true, type: true },
    });
  },

  // 3-1) 차량 모델 생성
  createCarModel(
    manufacturer: string,
    model: string,
    type: Prisma.CarModelCreateInput['type']
  ) {
    return prisma.carModel.create({
      data: { manufacturer, model, type },
    });
  },

  // 4) 차량 전체 조회
  findAll(where: Prisma.CarWhereInput, page: number, pageSize: number) {
    return prisma.car.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { id: 'desc' },
      include: { carModel: true },
    });
  },

  // 5) 차량 전체 개수 조회
  count(where: Prisma.CarWhereInput) {
    return prisma.car.count({ where });
  },

  // 6) 차량 ID로 조회
  findById(companyId: number, carId: number) {
    return prisma.car.findFirst({
      where: { id: carId, companyId },
      include: { carModel: true },
    });
  },

  // 7) 차량 업데이트
  update(carId: number, data: Prisma.CarUpdateInput) {
    return prisma.car.update({
      where: { id: carId },
      data,
      include: { carModel: true },
    });
  },

  // 8) 차량 삭제
  delete(carId: number) {
    return prisma.car.delete({
      where: { id: carId },
    });
  },

  // 9) 차량 일괄 생성
  bulkCreate(dataArray: Prisma.CarCreateInput[]) {
    return prisma.$transaction(
      dataArray.map((data) => prisma.car.create({ data }))
    );
  },

  // 9-1) 회사 내 차량번호 존재 여부 다건 조회
  findExistingCarNumbers(companyId: number, carNumbers: string[]) {
    return prisma.car.findMany({
      where: { companyId, carNumber: { in: carNumbers } },
      select: { carNumber: true },
    });
  },

  // 10) 차량 모델 전체 조회
  findCarModels() {
    return prisma.carModel.findMany({
      orderBy: [{ manufacturer: 'asc' }, { model: 'asc' }],
    });
  },
};
