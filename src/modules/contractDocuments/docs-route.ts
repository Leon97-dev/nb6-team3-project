import express from 'express';
import multer from 'multer';
import asyncHandler from '../../errors/async-handler.js';
import { contractDocsController } from './docs-controller.js';
import { authMiddleware } from './docs-validator.js';

const upload = multer({ dest: 'uploads/' });

const contractDocsRouter = express.Router();

contractDocsRouter.get('/', authMiddleware, asyncHandler(contractDocsController.GetList));
contractDocsRouter.get('/draft', authMiddleware, asyncHandler(contractDocsController.GetDraft));
contractDocsRouter.post('/upload', upload.single('file'), authMiddleware, asyncHandler(contractDocsController.UpLoad));
contractDocsRouter.get('/:id/download', authMiddleware, asyncHandler(contractDocsController.DownLoad));

export default contractDocsRouter;