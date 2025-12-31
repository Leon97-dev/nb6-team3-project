import prisma from '@prisma/client';
import { CarStatus } from '@prisma/client';

export class CarRepository {
  async findCars(params: {
    companyId: number;
    skip: number;
    take: number;
    status?: CarStatus;
    searchBy?: 'carNumber' | 'model';
    keyword?: string;
  }) {
    const { companyId, skip, take, status, searchBy, keyword } = params;

    return prisma.car.findMany({
      where: {
        companyId,
        status,
        ...(keyword && searchBy === 'carNumber'
          ? { carNumber: { contains: keyword } }
          : {}),
        ...(keyword && searchBy === 'model'
          ? { carModel: { model: { contains: keyword } } }
          : {}),
      },
      include: {
        carModel: true,
      },
      skip,
      take,
    });
  }

  async countCars(companyId: number) {
    return prisma.car.count({ where: { companyId } });
  }

  async findCarById(companyId: number, carId: number) {
    return prisma.car.findFirst({
      where: { id: carId, companyId },
      include: { carModel: true },
    });
  }

  async createCar(data: any) {
    return prisma.car.create({ data });
  }

  async updateCar(carId: number, data: any) {
    return prisma.car.update({
      where: { id: carId },
      data,
    });
  }

  async deleteCar(carId: number) {
    return prisma.car.delete({ where: { id: carId } });
  }

  async findOrCreateCarModel(manufacturer: string, model: string, type: any) {
    return prisma.carModel.upsert({
      where: { manufacturer_model: { manufacturer, model } },
      update: {},
      create: { manufacturer, model, type },
    });
  }
}
