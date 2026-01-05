/**
 * @description 헬스 체크 라우트 모듈
 * @author 이호성
 * @date 2025-12-17
 * @version 1.0
 * @warning 코드는 건들 필요 없습니다.
 **/

import { Router } from 'express';
import { healthController } from './health-controller.js';
import asyncHandler from '../../errors/async-handler.js';

const router = Router();

// 서버 상태 확인
router.get('/', asyncHandler(healthController.checkHealth));

// 데이터베이스 연결 확인
router.get('/db', asyncHandler(healthController.checkDatabase));

export default router;
