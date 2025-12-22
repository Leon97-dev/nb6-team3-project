// src/modules/dashboards/dashboard-route.ts
   
import { Router } from 'express';
import { getDashboard } from './dashboard-controller';
import { validateGetDashboardQuery } from './dashboard-validator';

const router = Router();

// 대시보드 데이터를 가져오는 라우트
// validateGetDashboardQuery 미들웨어를 추가하여
// ?year=2025 와 같은 쿼리 파라미터의 유효성을 검사합니다.
router.get('/', validateGetDashboardQuery, getDashboard);

export default router;              
