import { Router } from 'express';
import { uploadController } from './upload-controller.js';
import { upload } from '../../middlewares/upload-middleware.js';
import asyncHandler from '../../errors/async-handler.js';

const router = Router();

// 라우트 설정
router.post(
  '/upload',
  upload.single('file'),
  asyncHandler(uploadController.upload)
);

export default router;
