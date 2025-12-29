import express from 'express';
import asyncHandler from '../../errors/async-handler.js';
import { userServiceController } from './contract-controller.js';

const constractRouter = express.Router();

//인증 추가 작업 및 인증에 따른 로그인이 필요합니다 401 에러 처리 필요
constractRouter.post('/', asyncHandler(userServiceController.register));

constractRouter.get('/', asyncHandler(userServiceController.findAll));

constractRouter.patch('/:id', asyncHandler(userServiceController.patchContract));


export default constractRouter;