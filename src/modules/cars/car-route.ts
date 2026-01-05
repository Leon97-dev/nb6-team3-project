import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../../middlewares/auth.js';
import { CarController } from './car-controller.js';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.use(requireAuth);

router.get('/', CarController.list);
router.get('/:carId', CarController.detail);
router.post('/', CarController.create);
router.post('/upload', upload.single('file'), CarController.upload);
router.patch('/:carId', CarController.update);
router.delete('/:carId', CarController.delete);

export default router;
