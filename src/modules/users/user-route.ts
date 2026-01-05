/**
 * @description 유저 라우터 모듈
 * 언제든지 수정 가능하니 문제 있으면 알려주세요!
 * @author 이호성
 * @date 2025-12-29
 * @version 1.0
 **/

import { Router } from 'express';
import { userController } from './user-controller.js';
import { requireAuth, requireAdmin } from '../../middlewares/auth.js';
import asyncHandler from '../../errors/async-handler.js';
import { validate, validateParams } from '../../middlewares/validate.js';
import {
  SignUpSchema,
  CheckPasswordSchema,
  UpdateMeSchema,
  UserIdParamSchema,
} from './user-validator.js';

const router = Router();

router.post('/', validate(SignUpSchema), asyncHandler(userController.signUp));

router.get('/me', requireAuth, asyncHandler(userController.getMe));

router.post(
  '/check',
  requireAuth,
  validate(CheckPasswordSchema),
  asyncHandler(userController.checkPassword)
);

router.patch(
  '/me',
  requireAuth,
  validate(UpdateMeSchema),
  asyncHandler(userController.updateMe)
);

router.delete('/me', requireAuth, asyncHandler(userController.deleteMe));

router.delete(
  '/:userId',
  requireAuth,
  requireAdmin,
  validateParams(UserIdParamSchema),
  asyncHandler(userController.deleteUserByAdmin)
);

export default router;
