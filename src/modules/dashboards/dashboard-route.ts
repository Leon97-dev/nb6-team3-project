/**
 * @description 대시보드 라우터 모듈
 * 대시보드 관련 요청을 처리하는 기능을 제공합니다.
 * @author 정현준
 * @date 2026-01-02
 * @version 1.0
 **/
import { Router } from 'express';
import { dashboardController } from './customer-controller.js';
import { requireAuth } from '../../middlewares/auth.js';
import asyncHandler from '../../errors/async-handler.js';

const router = Router();

// 대시보드 조회 통계 라우트
router.get('/', requireAuth, asyncHandler(dashboardController.getDashboard));

export default router;
