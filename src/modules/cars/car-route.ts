import { Router } from 'express';
import { CarController } from './car-controller.js';
import { authMiddleware } from '../../middlewares/auth.js';

const router = Router();
const controller = new CarController();

router.get('/cars', authMiddleware, controller.getCars);
router.get('/cars/:carId', authMiddleware, controller.getCar);
router.post('/cars', authMiddleware, controller.createCar);
router.patch('/cars/:carId', authMiddleware, controller.updateCar);
router.delete('/cars/:carId', authMiddleware, controller.deleteCar);

// 대용량 업로드 (/cars/upload) → multer 연동 예정

export default router;
