/**
 * @description 대시보드 라우터 모듈
 * 대시보드 관련 요청을 처리하는 기능을 제공합니다.
 * @author 정현준
 * @date 2025-12-29
 * @version 1.0
 **/        

import { Router } from 'express';
import { dashboardController } from './dashboard-controller';
import { validateDashboardRequest } from './dashboard-validator';

const router = Router();

// 대시보드 생성 라우트
router.post(
  '/dashboards',
  validateDashboardRequest,
  dashboardController.createDashboard
);

// 대시보드 조회 라우트
 router.get(
  '/dashboards/:userId',
   dashboardController.getDashboardData
  );

// 대시보드 설정 업데이트 라우트
  router.put(
  '/dashboards/:userId',
   dashboardController.updateDashboardSettings
);

// 대시보드 초기화 라우트
   router.delete(
  '/dashboards/:userId',
   dashboardController.resetDashboard
);














export default router;  