import express from 'express';
import asyncHandler from '../../errors/async-handler.js';
import { contractController } from './contract-controller.js';
import { authMiddleware } from './contract-validator.js';

const contractRouter = express.Router();

//인증 추가 작업 및 인증에 따른 로그인이 필요합니다 401 에러 처리 필요
contractRouter.post('/', authMiddleware, asyncHandler(contractController.register));

contractRouter.get('/', authMiddleware, asyncHandler(contractController.findAll));

contractRouter.patch('/:id', authMiddleware, asyncHandler(contractController.patchContract));

contractRouter.delete('/:id', authMiddleware, asyncHandler(contractController.deleteContract));


contractRouter.get('/cars', authMiddleware, asyncHandler(contractController.findCarList));
contractRouter.get('/customers', authMiddleware, asyncHandler(contractController.findCustomerList));
contractRouter.get('/users', authMiddleware, asyncHandler(contractController.findUserList));


export default contractRouter;