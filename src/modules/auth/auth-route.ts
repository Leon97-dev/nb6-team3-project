/**
 * @description 인증 라우터 모듈
 * 언제든지 수정 가능하니 문제 있으면 알려주세요!
 * @author 이호성
 * @date 2025-12-29
 * @version 1.0
 **/

import { Router } from 'express';
import { authController } from './auth-controller.js';
import { validate } from '../../middlewares/validate.js';
import { LoginSchema, RefreshSchema } from './auth-validator.js';
import asyncHandler from '../../errors/async-handler.js';

const router = Router();

router.post(
  '/login',
  validate(LoginSchema),
  asyncHandler(authController.login)
);

router.post(
  '/refresh',
  validate(RefreshSchema),
  asyncHandler(authController.refresh)
);

export default router;
