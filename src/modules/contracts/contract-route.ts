import express from 'express';
import asyncHandler from '../../errors/async-handler.js';
import { contractController } from './contract-controller.js';

const contractRouter = express.Router();

//인증 추가 작업 및 인증에 따른 로그인이 필요합니다 401 에러 처리 필요
contractRouter.post('/', asyncHandler(contractController.register));

contractRouter.get('/', asyncHandler(contractController.findAll));

contractRouter.patch('/:id', asyncHandler(contractController.patchContract));

contractRouter.delete('/:id', asyncHandler(contractController.deleteContract));


contractRouter.get('/cars', asyncHandler(contractController.findCarList));
contractRouter.get('/customers', asyncHandler(contractController.findCustomerList));
contractRouter.get('/users', asyncHandler(contractController.findUserList));


export default contractRouter;