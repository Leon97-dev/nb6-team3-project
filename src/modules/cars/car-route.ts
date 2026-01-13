import { Router } from 'express';
import { carsController } from './car-controller.js';
import { requireAuth } from '../../middlewares/auth.js';
import { upload } from '../../middlewares/upload-middleware.js';
import asyncHandler from '../../errors/async-handler.js';
import { validate } from '../../middlewares/validate.js';
import { CarCreateSchema, CarUpdateSchema } from './car-validator.js';

const router = Router();

// 차량 등록
router.post(
  '/',
  requireAuth,
  validate(CarCreateSchema),
  asyncHandler(carsController.create)
);

// 차량 모델 목록 조회
router.get('/models', requireAuth, asyncHandler(carsController.getModels));

// 차량 대용량 업로드
router.post(
  '/upload',
  requireAuth,
  upload.single('file'),
  asyncHandler(carsController.upload)
);

// 차량 목록 조회
router.get('/', requireAuth, asyncHandler(carsController.findAll));

// 차량 상세 조회
router.get('/:carId', requireAuth, asyncHandler(carsController.findOne));

// 차량 수정
router.patch(
  '/:carId',
  requireAuth,
  validate(CarUpdateSchema),
  asyncHandler(carsController.update)
);

// 차량 삭제
router.delete('/:carId', requireAuth, asyncHandler(carsController.delete));

export default router;
