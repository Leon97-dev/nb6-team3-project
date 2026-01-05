// src/cars/car-route.ts
import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth.js';
import {
  getCars,
  getCarDetail,
  createCar,
  deleteCar,
} from './car-controller.js';

const router = Router();

router.get('/', requireAuth, getCars);
router.get('/:carId', requireAuth, getCarDetail);
router.post('/', requireAuth, createCar);
router.delete('/:carId', requireAuth, deleteCar);

export default router;
