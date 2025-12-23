import { Request, Response } from 'express';
import { CarService } from './car-service.js';

// GET 차량 목록 조회
const carService = new CarService();

export const getCars = async (req: Request, res: Response) => {
  try {
    const result = await carService.getCars({
      page: Number(req.query.page),
      pageSize: Number(req.query.pageSize),
      status: req.query.status as string,
      searchBy: req.query.searchBy as string,
      keyword: req.query.keyword as string,
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({ message: '잘못된 요청입니다' });
  }
};
