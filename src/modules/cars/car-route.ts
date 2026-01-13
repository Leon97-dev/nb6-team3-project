import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../../middlewares/auth.js';
import { CarController } from './car-controller.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

//차량 목록 조회
router.get('/', requireAuth, CarController.list);
// 차량 등록
router.post('/', requireAuth, CarController.create);
//차량 데이터 대용량 업로드
router.post(
  '/upload',
  requireAuth,
  upload.single('file'),
  CarController.Upload
);
//차량 모델 목록 조회
router.get('/models', requireAuth, CarController.models);
// 차량 상세 조회
router.get('/:carId', requireAuth, CarController.detail);
// 차량 수정
router.patch('/:carId', requireAuth, CarController.update);
// 차량 삭제
router.delete('/:carId', requireAuth, CarController.delete);

export default router;
