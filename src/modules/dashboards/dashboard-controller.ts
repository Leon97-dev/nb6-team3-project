/**
 * @description 대시보드 컨트롤러 모듈
 * 대시보드 관련 요청을 처리하는 기능을 제공합니다.
 * @author 정현준
 * @date 2026-01-02
 * @version 1.0
 **/

import { Request, Response } from 'express';
import { dashboardService } from '../dashboards/dashboard-service.js';

export const dashboardController = {
  // 대시보드 통계조회
  async getDashboard(req: Request, res: Response) {
    // companyId 추출
    const companyId = req.user!.companyId;
    // result 변수에 통계 데이터 할당
    const result = await dashboardService.getDashboardStats(companyId);
    // 응답 반환
    res.status(200).json(result);
  },
};
