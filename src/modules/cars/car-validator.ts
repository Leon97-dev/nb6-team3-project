import { Request, Response, NextFunction } from 'express';

// GET 차량 목록 조회
export const validateGetCars = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '로그인이 필요합니다' });
  }

  const { page, pageSize, status, searchBy, keyword } = req.query;

  if (!page || !pageSize) {
    return res.status(400).json({ message: '잘못된 요청입니다' });
  }

  if (
    status &&
    !['possession', 'contractProceeding', 'contractCompleted'].includes(
      status as string
    )
  ) {
    return res.status(400).json({ message: '잘못된 요청입니다' });
  }

  if (searchBy && !['carNumber', 'model'].includes(searchBy as string)) {
    return res.status(400).json({ message: '잘못된 요청입니다' });
  }

  next();
};
