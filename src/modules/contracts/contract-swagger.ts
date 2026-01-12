/**
 * @swagger
 * tags:
 *   name: Contracts
 *   description: 계약 관리 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ContractGroup:
 *       type: object
 *       properties:
 *         totalItemCount:
 *           type: integer
 *           description: 총 아이템 수
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               car:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   model:
 *                     type: string
 *               customer:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *               user:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *               meetings:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date-time
 *                     alarms:
 *                       type: array
 *                       items:
 *                         type: string
 *                         format: date-time
 *               contractPrice:
 *                 type: integer
 *               resolutionDate:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
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
 *               meetings:
 *                 type: array
 *                 description: 미팅 일정 목록
 *                 items:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       description: 미팅 날짜
 *                     alarms:
 *                       type: array
 *                       description: 알람 시간 목록 (최대 3개)
 *                       maxItems: 3
 *                       items:
 *                         type: string
 *                         format: date-time
 *     responses:
 *       201:
 *         description: 계약 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 status:
 *                   type: string
 *                   enum: [carInspection, priceNegotiation, contractDraft, contractSuccessful, contractFailed]
 *                   description: 계약 상태
 *                 resolutionDate:
 *                   type: string
 *                   format: date-time
 *                   description: 해결 날짜
 *                 contractPrice:
 *                   type: integer
 *                   description: 계약 금액
 *                 meetings:
 *                   type: array
 *                   description: 미팅 일정 목록
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       alarms:
 *                         type: array
 *                         items:
 *                           type: string
 *                           format: date-time
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                 customer:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                 car:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     model:
 *                       type: string
 *       400:
 *         description: 실패
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 에러 메시지
 *                   example: "잘못된 요청입니다."
 *       401:
 *         description: 로그인이 필요합니다
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 에러 메시지
 *                   example: "로그인이 필요합니다."
 */

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
 *                   $ref: '#/components/schemas/ContractGroup'
 *                 priceNegotiation:
 *                   $ref: '#/components/schemas/ContractGroup'
 *                 contractDraft:
 *                   $ref: '#/components/schemas/ContractGroup'
 *                 contractSuccessful:
 *                   $ref: '#/components/schemas/ContractGroup'
 *                 contractFailed:
 *                   $ref: '#/components/schemas/ContractGroup'
 *       400:
 *         description: 잘못된 요청입니다
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 에러 메시지
 *                   example: "잘못된 요청입니다"
 *       401:
 *         description: 로그인이 필요합니다
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 에러 메시지
 *                   example: "로그인이 필요합니다"
 */

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
 *               meetings:
 *                 type: array
 *                 description: 미팅 일정 목록
 *                 items:
 *                   type: object
 *                   properties:
 *                     date:
 *                       type: string
 *                       format: date-time
 *                       description: 미팅 날짜
 *                     alarms:
 *                       type: array
 *                       description: 알람 시간 목록 (최대 3개)
 *                       maxItems: 3
 *                       items:
 *                         type: string
 *                         format: date-time
 *     responses:
 *       200:
 *         description: 수정 성공
 *       401:
 *         description: 로그인이 필요합니다
 *       403:
 *         description: 권한 없음 (담당자만 수정 가능)
 */

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
