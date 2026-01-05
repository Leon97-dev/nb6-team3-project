// src/cars/car-service.ts
import { NotFoundError } from '../../errors/error-handler.js';
import { carRepository } from './car-repository.js';

export const carService = {
  getCars,
  getCarDetail,
  createCar,
  deleteCar,
};

async function getCars(companyId: number) {
  return carRepository.findCars(companyId);
}

async function getCarDetail(carId: number, companyId: number) {
  const car = await carRepository.findCarById(carId, companyId);
  if (!car) {
    throw new NotFoundError('존재하지 않는 차량입니다');
  }
  return car;
}

async function createCar(input: Parameters<typeof carRepository.createCar>[0]) {
  return carRepository.createCar(input);
}

async function deleteCar(carId: number, companyId: number) {
  await getCarDetail(carId, companyId);
  await carRepository.deleteCar(carId, companyId);
}
