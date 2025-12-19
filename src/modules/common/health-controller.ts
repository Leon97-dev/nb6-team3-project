/**
 * @description 헬스 체크 컨트롤러 모듈
 * 서버 및 데이터베이스 연결 상태를 확인하는 기능을 제공합니다.
 * @author 이호성
 * @date 2025-12-17
 * @version 1.0
 * @warning 코드는 건들 필요 없습니다.
 **/

import type { Request, Response } from 'express';
import prisma from '../../configs/prisma.js';

export const healthController = {
  // 1) 서버 상태 확인
  async checkHealth(_req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: '서버 연결 성공',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  },

  // 2) DB 연결 확인
  async checkDatabase(_req: Request, res: Response): Promise<void> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.status(200).json({
        success: true,
        message: 'DB 연결 성공',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다';
      res.status(500).json({
        success: false,
        message: 'DB 연결 실패',
        error: message,
      });
    }
  },
};
