import { Router } from 'express';
import { imageController } from './images/upload';
import { upload } from '../../middlewares/upload-middleware.js';

const imageRouter = Router();

imageRouter.post(
  '/upload',
  upload.single('image'), // 'image' is the field name for the uploaded file
  imageController.uploadImage
);

export { imageRouter };
