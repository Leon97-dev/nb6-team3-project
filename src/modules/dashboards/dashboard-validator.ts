/**
 * @description 대시보드 벨리데이터 모듈
 * 대시보드 생성을 위한 요청을 검증하는 기능을 제공합니다.
 * @author 정현준
 * @date 2025-12-29
 * @version 1.0
 **/

import { Request, Response, NextFunction } from 'express';

export const validateDashboardRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, widgets } = req.body;
  
  if (typeof title !== 'string' || title.trim() === '') {   
    return res.status(400).json({ error: 'Invalid or missing title' });
    }   
  
  if (!Array.isArray(widgets)) {
    return res.status(400).json({ error: 'Widgets must be an array' });
    }
    next();
};

