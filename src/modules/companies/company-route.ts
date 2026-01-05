import { Router } from 'express';
import { companyController } from './company-controller.js';
import { requireAuth, requireAdmin } from '../../middlewares/auth.js';
import {
  validate,
  validateParams,
  validateQuery,
} from '../../middlewares/validate.js';
import {
  createCompanySchema,
  updateCompanySchema,
  companyListQuerySchema,
  companyUsersQuerySchema,
  companyIdParamSchema,
} from './company-validator.js';
import asyncHandler from '../../errors/async-handler.js';

const router = Router();

// 회사 등록 (관리자 전용)
router.post(
  '/',
  requireAuth,
  requireAdmin,
  validate(createCompanySchema),
  asyncHandler(companyController.create)
);

// 회사 목록 조회 (관리자 전용)
router.get(
  '/',
  requireAuth,
  requireAdmin,
  validateQuery(companyListQuerySchema),
  asyncHandler(companyController.findAll)
);

// 회사별 유저 목록 조회 (관리자 전용)
router.get(
  '/users',
  requireAuth,
  requireAdmin,
  validateQuery(companyUsersQuerySchema),
  asyncHandler(companyController.findUsers)
);

// 회사 수정 (관리자 전용)
router.patch(
  '/:companyId',
  requireAuth,
  requireAdmin,
  validateParams(companyIdParamSchema),
  validate(updateCompanySchema),
  asyncHandler(companyController.update)
);

// 회사 삭제 (관리자 전용)
router.delete(
  '/:companyId',
  requireAuth,
  requireAdmin,
  validateParams(companyIdParamSchema),
  asyncHandler(companyController.delete)
);

export default router;
