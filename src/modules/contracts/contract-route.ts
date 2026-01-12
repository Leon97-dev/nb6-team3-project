import express from 'express';
import asyncHandler from '../../errors/async-handler.js';
import { contractController } from './contract-controller.js';
import { authMiddleware } from './contract-validator.js';

const contractRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Contracts
 *   description: 계약 관리 API
 */

/**
 * @swagger
 * /contracts:
 *   post:
 *     summary: 계약 등록
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - carId
 *               - customerId
 *             properties:
 *               carId:
 *                 type: integer
 *                 description: 차량 ID
 *               customerId:
 *                 type: integer
 *                 description: 고객 ID
 *     responses:
 *       201:
 *         description: 계약 생성 성공
 *       401:
 *         description: 로그인이 필요합니다
 */
contractRouter.post('/', authMiddleware, asyncHandler(contractController.register));

/**
 * @swagger
 * /contracts:
 *   get:
 *     summary: 계약 목록 조회
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: searchBy
 *         schema:
 *           type: string
 *           enum: [customerName, userName]
 *         description: 검색 기준 (고객명, 담당자명)
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 검색어
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 carInspection:
 *                   type: object
 *                 priceNegotiation:
 *                   type: object
 *                 contractDraft:
 *                   type: object
 *                 contractSuccessful:
 *                   type: object
 *                 contractFailed:
 *                   type: object
 *       401:
 *         description: 인증 실패
 */
contractRouter.get('/', authMiddleware, asyncHandler(contractController.findAll));

/**
 * @swagger
 * /contracts/{id}:
 *   patch:
 *     summary: 계약 수정
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 계약 ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [carInspection, priceNegotiation, contractDraft, contractSuccessful, contractFailed]
 *                 description: 계약 상태
 *               resolutionDate:
 *                 type: string
 *                 format: date-time
 *                 description: 해결 날짜
 *     responses:
 *       200:
 *         description: 수정 성공
 *       401:
 *         description: 로그인이 필요합니다
 *       403:
 *         description: 권한 없음 (담당자만 수정 가능)
 */
contractRouter.patch('/:id', authMiddleware, asyncHandler(contractController.patchContract));

/**
 * @swagger
 * /contracts/{id}:
 *   delete:
 *     summary: 계약 삭제
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 계약 ID
 *     responses:
 *       200:
 *         description: 삭제 성공
 *       401:
 *         description: 로그인이 필요합니다
 *       403:
 *         description: 권한 없음 (담당자만 삭제 가능)
 */
contractRouter.delete('/:id', authMiddleware, asyncHandler(contractController.deleteContract));

/**
 * @swagger
 * /contracts/cars:
 *   get:
 *     summary: 계약 가능 차량 목록 조회
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 조회 성공
 *       401:
 *         description: 로그인이 필요합니다
 */
contractRouter.get('/cars', authMiddleware, asyncHandler(contractController.findCarList));

/**
 * @swagger
 * /contracts/customers:
 *   get:
 *     summary: 계약 가능 고객 목록 조회
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 조회 성공
 *       401:
 *         description: 로그인이 필요합니다
 */
contractRouter.get('/customers', authMiddleware, asyncHandler(contractController.findCustomerList));

/**
 * @swagger
 * /contracts/users:
 *   get:
 *     summary: 계약 담당자(직원) 목록 조회
 *     tags: [Contracts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 조회 성공
 *       401:
 *         description: 로그인이 필요합니다
 */
contractRouter.get('/users', authMiddleware, asyncHandler(contractController.findUserList));


export default contractRouter;