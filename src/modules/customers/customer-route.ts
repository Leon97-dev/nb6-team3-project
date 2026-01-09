import { Router } from 'express';
import customersController from './customer-controller.js';
import { requireAuth } from '../../middlewares/auth.js';
import { upload } from '../../middlewares/upload-middleware.js';
import asyncHandler from '../../errors/async-handler.js';

const router = Router();

// 고객 등록
router.post('/', requireAuth, asyncHandler(customersController.create));

// 고객 목록 조회
router.get('/', requireAuth, asyncHandler(customersController.findAll));

// 고객 대용량 업로드
router.post(
  '/upload',
  requireAuth,
  upload.single('file'),
  asyncHandler(customersController.upload)
);

// 고객 상세 조회
router.get(
  '/:customerId',
  requireAuth,
  asyncHandler(customersController.findOne)
);

// 고객 수정
router.patch(
  '/:customerId',
  requireAuth,
  asyncHandler(customersController.update)
);

// 고객 삭제
router.delete(
  '/:customerId',
  requireAuth,
  asyncHandler(customersController.delete)
);

export default router;
