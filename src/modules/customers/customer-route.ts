import { Router } from 'express';
import multer from 'multer';
import customerController from './customer-controller.js';
import { requireAuth } from '../../middlewares/auth.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(requireAuth);

router.post('/', customerController.create);
router.get('/', customerController.list);
router.get('/:customerId', customerController.get);
router.patch('/:customerId', customerController.update);
router.delete('/:customerId', customerController.delete);
router.post('/upload', upload.single('file'), customerController.upload);

export default router;
