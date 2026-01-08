/**
 * @description 대시보드 컨트롤러 모듈
 * 대시보드 관련 요청을 처리하는 기능을 제공합니다.
 * @author 정현준
 * @date 2026-01-08
 * @version 1.0
 **/

import { Request, Response } from 'express';
import { dashboardService } from '../dashboards/dashboard-service.js';
import { success } from 'zod';

export const dashboardController = {
  /**
   * 대시보드 통계조회
   * GET /api/dashboard
   */
  async getDashboard(req: Request, res: Response) {
    try {
      // 1. 인증 미들웨어에서 주입된 user 정보 확인
      const companyId = req.user?.companyId;
      // companyId: 옵셔널 체이닝(?) 사
      if (!companyId) {
        // 서비스 내부 검증과 별개로 컨트롤러 단에서도 방어 로직 추가 가능
        return res
          .status(401)
          .json({ message: '인증 정보가 유효하지 않습니다.' });
      }

      // 2. result 변수에 통계 데이터 할당(서비스 호출)
      const result = await dashboardService.getDashboardStats(companyId);

      // 3. 성공 응답 반환
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      // 4. 에러 발생 시 공통 에러 핸들러로 전달
    }
  },
};
