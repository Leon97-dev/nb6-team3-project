import fs from 'fs';
import type { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../../errors/error-handler.js';
import {
  CarServiceBulk,
  carsService,
  type ApiCarStatus,
  type CarCreatePayload,
  type CarUpdatePayload,
} from './car-service.js';

export const carsController = {
  // 1) 차량 생성
  async create(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    const companyId = req.user!.companyId;
    const data = req.body as CarCreatePayload;
    const car = await carsService.createCar(companyId, data);

    res.status(201).json(car);
  },

  // 2) 차량 목록 조회
  async findAll(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    const companyId = req.user!.companyId;
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const status =
      req.query.status === 'possession' ||
      req.query.status === 'contractProceeding' ||
      req.query.status === 'contractCompleted'
        ? (req.query.status as ApiCarStatus)
        : undefined;
    const searchBy =
      req.query.searchBy === 'carNumber' || req.query.searchBy === 'model'
        ? (req.query.searchBy as 'carNumber' | 'model')
        : undefined;
    const keyword =
      typeof req.query.keyword === 'string' ? req.query.keyword : undefined;

    const result = await carsService.getCars(
      companyId,
      page,
      pageSize,
      status,
      searchBy,
      keyword
    );

    res.status(200).json(result);
  },

  // 3) 차량 상세 조회
  async findOne(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    const companyId = req.user!.companyId;
    const carId = Number(req.params.carId);

    if (Number.isNaN(carId))
      throw new ValidationError(null, '잘못된 요청입니다');

    const car = await carsService.getCarById(companyId, carId);

    res.status(200).json(car);
  },

  // 4) 차량 수정
  async update(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    const companyId = req.user!.companyId;
    const carId = Number(req.params.carId);

    if (Number.isNaN(carId))
      throw new ValidationError(null, '잘못된 요청입니다');

    const data = req.body as CarUpdatePayload;

    const car = await carsService.updateCar(companyId, carId, data);

    res.status(200).json(car);
  },

  // 5) 차량 삭제
  async delete(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    const companyId = req.user!.companyId;
    const carId = Number(req.params.carId);

    if (Number.isNaN(carId))
      throw new ValidationError(null, '잘못된 요청입니다');

    await carsService.deleteCar(companyId, carId);

    res.status(200).json({ message: '차량 삭제 성공' });
  },

  // 6) 차량 엑셀 파일 업로드
  async upload(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    if (!req.file) throw new ValidationError(null, '잘못된 요청입니다');

    const companyId = req.user!.companyId;
    const filePath = req.file.path;
    const fileBuffer = req.file.buffer ?? fs.readFileSync(filePath);

    await CarServiceBulk.bulkUploadCsv(companyId, fileBuffer);

    res.status(200).json({ message: '성공적으로 등록되었습니다' });
  },

  async getModels(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    const models = await carsService.getCarModels();

    res.status(200).json({ data: models });
  },
};
