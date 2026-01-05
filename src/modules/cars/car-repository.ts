// src/cars/car-repository.ts
import prisma from '../../configs/prisma.js';

export const carRepository = {
  findCars,
  findCarById,
  createCar,
  deleteCar,
};

async function findCars(companyId: number) {
  return prisma.car.findMany({
    where: { companyId },
    include: {
      carModel: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function findCarById(carId: number, companyId: number) {
  return prisma.car.findFirst({
    where: {
      id: carId,
      companyId,
    },
    include: {
      carModel: true,
    },
  });
}

async function createCar(data: {
  companyId: number;
  carNumber: string;
  manufacturingYear: number;
  mileage: number;
  price: number;
  accidentCount: number;
  explanation?: string;
  accidentDetails?: string;
  manufacturer: string;
  model: string;
}) {
  return prisma.car.create({
    data: {
      carNumber: data.carNumber,
      manufacturingYear: data.manufacturingYear,
      mileage: data.mileage,
      price: data.price,
      accidentCount: data.accidentCount,
      explanation: data.explanation,
      accidentDetails: data.accidentDetails,
      companyId: data.companyId,
      carModel: {
        connectOrCreate: {
          where: {
            manufacturer_model: {
              manufacturer: data.manufacturer,
              model: data.model,
            },
          },
          create: {
            manufacturer: data.manufacturer,
            model: data.model,
            type: 'MID_SIZE',
          },
        },
      },
    },
    include: {
      carModel: true,
    },
  });
}

async function deleteCar(carId: number, companyId: number) {
  return prisma.car.delete({
    where: {
      id_companyId: {
        id: carId,
        companyId,
      },
    },
  });
}
