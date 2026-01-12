import type { NextFunction, Request, Response } from 'express';
import {
  CarService,
  CarServiceBulk,
  mapCarStatusToApi,
} from './car-service.js';
import type { GetCarsQuery, CarListQuery } from '../../types/car.d.js';

export class CarController {
  // 차량 목록 조회
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const q = req.query as GetCarsQuery;

      const query: CarListQuery = {};

      if (q.page !== undefined) query.page = Number(q.page);
      if (q.pageSize !== undefined) query.pageSize = Number(q.pageSize);
      if (q.status !== undefined) query.status = q.status;
      if (q.searchBy !== undefined) query.searchBy = q.searchBy;
      if (q.keyword !== undefined) query.keyword = q.keyword;

      const result = await CarService.list(req.user!.companyId, query);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  // 차량 상세 조회
  static async detail(req: Request, res: Response, next: NextFunction) {
    try {
      const carId = Number(req.params.carId);
      const car = await CarService.detail(req.user!.companyId, carId);

      res.status(200).json({
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
        status: mapCarStatusToApi(car.status),
      });
    } catch (e) {
      next(e);
    }
  }

  // 차량 모델 목록 조회
  static async models(req: Request, res: Response, next: NextFunction) {
    try {
      const models = await CarService.listCarModels(req.user!.companyId);
      res.status(200).json(models);
    } catch (e) {
      next(e);
    }
  }

  // 차량 등록
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const car = await CarService.create(req.user!.companyId, req.body);
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
        status: mapCarStatusToApi(car.status),
      });
    } catch (e) {
      next(e);
    }
  }

  // 차량 수정
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const carId = Number(req.params.carId);
      const car = await CarService.update(req.user!.companyId, carId, req.body);

      res.status(200).json(car);
    } catch (e) {
      next(e);
    }
  }

  // 차량 삭제
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const carId = Number(req.params.carId);
      await CarService.delete(req.user!.companyId, carId);

      res.status(200).json({ message: '차량 삭제 성공' });
    } catch (e) {
      next(e);
    }
  }

  // 차량 데이터 대용량 업로드
  static async Upload(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file?.buffer) {
        throw new Error('파일이 업로드되지 않았습니다.');
      }

      await CarServiceBulk.bulkUoloadFromCsv(
        req.user!.companyId,
        req.file.buffer
      );
      return res.status(200).json({ message: '성공적으로 등록되었습니다.' });
    } catch (e) {
      next(e);
    }
  }
}

console.log('message');
