/**
 * @description 대시보드 라우터 모듈
 * 대시보드 관련 요청을 처리하는 기능을 제공합니다.
 * @author 정현준
 * @date 2026-01-02
 * @version 1.0
 **/
import { Router } from 'express';
import dashboardCtrl from './dashboard-controller.js';

const router = Router();

// GET / - 모든 대시보드 조회
router.get('/', dashboardCtrl.getById);

// POST / - 새 대시보ord 생성
router.post('/', dashboardCtrl.create);

// GET /:id - 특정 대시보드 조회
router.get('/:id', dashboardCtrl.getById);

// PUT /:id - 대시보드 업데이트
router.put('/:id', dashboardCtrl.update);

// DELETE /:id - 대시보드 삭제
router.delete('/:id', dashboardCtrl.delete);

export default router;  