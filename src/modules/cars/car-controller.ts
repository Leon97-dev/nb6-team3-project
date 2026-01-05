import type { Request, Response } from 'express';
import { CarService } from './car-service.js';
import { parseCarCsv } from '../cars/car-csv.js';

export class CarController {
  static async list(req: Request, res: Response) {
    const result = await CarService.findList(req.user!.companyId, req.query);
    res.json(result);
  }

  static async detail(req: Request, res: Response) {
    const carId = Number(req.params.carId);
    const car = await CarService.findOne(req.user!.companyId, carId);

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

  static async create(req: Request, res: Response) {
    const car = await CarService.create(req.user!.companyId, req.body);
    res.status(201).json(car);
  }

  static async upload(req: Request, res: Response) {
    const file = req.file!;
    const cars = await parseCarCsv(file.path);

    for (const car of cars) {
      await CarService.create(req.user!.companyId, car);
    }

    res.json({ message: '성공적으로 등록되었습니다' });
  }

  static async update(req: Request, res: Response) {
    const carId = Number(req.params.carId);
    const car = await CarService.update(req.user!.companyId, carId, req.body);
    res.json(car);
  }

  static async delete(req: Request, res: Response) {
    const carId = Number(req.params.carId);
    await CarService.delete(req.user!.companyId, carId);
    res.json({ message: '차량 삭제 성공' });
  }
}
