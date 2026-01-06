import express from 'express';
import multer from 'multer';
import asyncHandler from '../../errors/async-handler.js';
import { contractDocsController } from './docs-controller.js';

const upload = multer({ dest: 'uploads/' });

const contractDocsRouter = express.Router();

contractDocsRouter.get('/', asyncHandler(contractDocsController.GetList));
contractDocsRouter.get('/draft', asyncHandler(contractDocsController.GetDraft));
contractDocsRouter.post('/upload', upload.single('file'), asyncHandler(contractDocsController.UpLoad));
contractDocsRouter.get('/:id/download', asyncHandler(contractDocsController.DownLoad));

export default contractDocsRouter;