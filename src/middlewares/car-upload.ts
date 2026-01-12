// src/middlewares/car-upload.ts
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

export function uploadErrorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof multer.MulterError) {
    res.status(400).json({
      message: err.message,
    });
    return;
  }

  next(err);
}
