import { Router } from 'express';
import { CarController } from './car-controller.js';
import { authHeader } from '../../middlewares/auth.js';
import { uploadCSV } from '../../middlewares/carupload.js';
import { authMiddleware } from '../../middlewares/auth.js';

const router = Router();
const controller = new CarController();

router.get('/cars', authHeader, controller.getCars);
router.get('/cars/:carId', authHeader, controller.getCar);
router.post('/cars', authHeader, controller.createCar);
router.patch('/cars/:carId', authHeader, controller.updateCar);
router.delete('/cars/:carId', authHeader, controller.deleteCar);

router.post(
  '/cars/upload',
  authMiddleware,
  uploadCSV.single('file'),
  controller.uploadCSV
);

export default router;
