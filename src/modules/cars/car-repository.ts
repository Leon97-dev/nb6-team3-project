import prisma from '../../configs/prisma.js';
import type { Prisma } from '@prisma/client';

export class CarRepository {
  static upsertCarModel(
    manufacturer: string,
    model: string,
    type: Prisma.CarModelCreateInput['type']
  ) {
    return prisma.carModel.upsert({
      where: { manufacturer_model: { manufacturer, model } },
      update: {},
      create: { manufacturer, model, type },
    });
  }

  static create(data: Prisma.CarCreateInput) {
    return prisma.car.create({
      data,
      include: { carModel: true },
    });
  }

  static findById(companyId: number, carId: number) {
    return prisma.car.findFirst({
      where: { id: carId, companyId },
      include: { carModel: true },
    });
  }

  static findMany(where: Prisma.CarWhereInput, skip: number, take: number) {
    return prisma.car.findMany({
      where,
      skip,
      take,
      include: { carModel: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  static count(where: Prisma.CarWhereInput) {
    return prisma.car.count({ where });
  }

  static update(carId: number, data: Prisma.CarUpdateInput) {
    return prisma.car.update({
      where: { id: carId },
      data,
      include: { carModel: true },
    });
  }

  static delete(carId: number) {
    return prisma.car.delete({ where: { id: carId } });
  }

  static findCarModelsGrouped() {
    return prisma.carModel.findMany({
      select: {
        manufacturer: true,
        model: true,
      },
      orderBy: { manufacturer: 'asc' },
    });
  }
}
