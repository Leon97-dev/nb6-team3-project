import { Request, Response } from 'express';
import { CarService } from './car-service.js';
import { AuthRequest } from '../../middlewares/auth.js';

const carService = new CarService();

export class CarController {
  async getCars(req: AuthRequest, res: Response) {
    try {
      const result = await carService.getCarList(
        req.query,
        req.user!.companyId
      );
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  }

  async getCar(req: AuthRequest, res: Response) {
    try {
      const carId = Number(req.params.carId);
      const result = await carService.getCarDetail(carId, req.user!.companyId);
      res.json(result);
    } catch (e: any) {
      res.status(e.message.includes('존재') ? 404 : 400).json({
        message: e.message,
      });
    }
  }

  async createCar(req: AuthRequest, res: Response) {
    try {
      const car = await carService.createCar(req.body, req.user!.companyId);
      res.status(201).json(car);
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  }

  async updateCar(req: AuthRequest, res: Response) {
    try {
      const carId = Number(req.params.carId);
      const car = await carService.updateCar(
        carId,
        req.body,
        req.user!.companyId
      );
      res.json(car);
    } catch (e: any) {
      res.status(404).json({ message: e.message });
    }
  }

  async deleteCar(req: AuthRequest, res: Response) {
    try {
      const carId = Number(req.params.carId);
      await carService.deleteCar(carId, req.user!.companyId);
      res.json({ message: '차량 삭제 성공' });
    } catch (e: any) {
      res.status(404).json({ message: e.message });
    }
  }
}

async uploadCSV(req: AuthRequest, res: Response) {
  try {
    await carService.uploadCSV(
      req.file as Express.Multer.File,
      req.user!.companyId,
    );

    res.json({ message: '성공적으로 등록되었습니다' });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}
