import { Router } from 'express';
import { getCars } from './car-controller.js';
import { validateGetCars } from './car-validator.js';

const router = Router();

//GET /cars
router.get('/cars', validateGetCars, getCars);

export default router;
