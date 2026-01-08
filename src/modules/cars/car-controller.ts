// @ts-nocheck
// src/cars/car-controller.ts
import type { Request, Response } from 'express';
import { carService } from './car-service.js';
import { validateCreateCar } from './car-validator.js';

export async function getCars(req: Request, res: Response) {
  const cars = await carService.getCars(req.user!.companyId);

  res.json({
    data: cars.map((car) => ({
      id: car.id,
      carNumber: car.carNumber,
      manufacturer: car.carModel.manufacturer,
      model: car.carModel.model,
      type: car.carModel.type,
      manufacturingYear: car.manufacturingYear,
      mileage: car.mileage,
      price: car.price,
      accidentCount: car.accidentCount,
      explanation: car.explanation,
      accidentDetails: car.accidentDetails,
      status: car.status,
    })),
  });
}

export async function getCarDetail(req: Request, res: Response) {
  const carId = Number(req.params.carId);
  const car = await carService.getCarDetail(carId, req.user!.companyId);

  res.json({
    id: car.id,
    carNumber: car.carNumber,
    manufacturer: car.carModel.manufacturer,
    model: car.carModel.model,
    type: car.carModel.type,
    manufacturingYear: car.manufacturingYear,
    mileage: car.mileage,
    price: car.price,
    accidentCount: car.accidentCount,
    explanation: car.explanation,
    accidentDetails: car.accidentDetails,
    status: car.status,
  });
}

export async function createCar(req: Request, res: Response) {
  const input = validateCreateCar(req.body);

  const car = await carService.createCar({
    ...input,
    companyId: req.user!.companyId,
  });

  res.status(201).json({
    id: car.id,
    carNumber: car.carNumber,
    manufacturer: car.carModel.manufacturer,
    model: car.carModel.model,
    type: car.carModel.type,
    manufacturingYear: car.manufacturingYear,
    mileage: car.mileage,
    price: car.price,
    accidentCount: car.accidentCount,
    explanation: car.explanation,
    accidentDetails: car.accidentDetails,
    status: car.status,
  });
}

export async function deleteCar(req: Request, res: Response) {
  const carId = Number(req.params.carId);

  await carService.deleteCar(carId, req.user!.companyId);

  res.json({ message: '차량 삭제 성공' });
}
