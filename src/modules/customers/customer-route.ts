import { Router } from 'express';
import multer from 'multer';
import customerController from './customer-controller.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', customerController.create);
router.get('/', customerController.list);
router.get('/:customerId', customerController.get);
router.patch('/:customerId', customerController.update);
router.delete('/:customerId', customerController.delete);
router.post('/upload', upload.single('file'), customerController.upload);

export default router;
