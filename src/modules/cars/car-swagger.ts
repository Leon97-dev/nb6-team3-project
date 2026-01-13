export { };

/**
 * @swagger
 * tags:
 *   name: Cars
 *   description: 차량 관리 API
 */

/**
 * @swagger
 * /cars:
 *   get:
 *     summary: 차량 목록 조회
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [possession, contractProceeding, contractCompleted]
 *       - in: query
 *         name: searchBy
 *         schema:
 *           type: string
 *           enum: [carNumber, model]
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *                 type: object
 *                 properties:
 *                   currentPage:
 *                     type: integer
 *                   totalPages:
 *                     type: integer
 *                   totalItemCount:
 *                     type: integer
 *                   data:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         carNumber:
 *                           type: string
 *                         model:
 *                           type: string
 *                         price:
 *                           type: integer
 *                         status:
 *                           type: string
 *       401:
 *         description: 로그인이 필요합니다
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "로그인이 필요합니다"
 */

/**
 * @swagger
 * /cars:
 *   post:
 *     summary: 차량 등록
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [carNumber, manufacturer, model, type, manufacturingYear, mileage, price, accidentCount]
 *             properties:
 *               carNumber:
 *                 type: string
 *               manufacturer:
 *                 type: string
 *               model:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [COMPACT, MID_SIZE, LARGE, SPORTS_CAR, SUV]
 *               manufacturingYear:
 *                 type: integer
 *               mileage:
 *                 type: integer
 *               price:
 *                 type: integer
 *               accidentCount:
 *                 type: integer
 *               explanation:
 *                 type: string
 *               accidentDetails:
 *                 type: string
 *     responses:
 *       201:
 *         description: 등록 성공
 *       400:
 *         description: 잘못된 요청입니다
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "차량 번호는 필수입니다"
 */

/**
 * @swagger
 * /cars/{id}:
 *   get:
 *     summary: 차량 상세 조회
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 조회 성공
 *       404:
 *         description: 존재하지 않는 차량입니다
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "존재하지 않는 차량입니다"
 */

/**
 * @swagger
 * /cars/{id}:
 *   patch:
 *     summary: 차량 수정
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               carNumber:
 *                 type: string
 *               price:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: 수정 성공
 *       404:
 *         description: 존재하지 않는 차량입니다
 */

/**
 * @swagger
 * /cars/{id}:
 *   delete:
 *     summary: 차량 삭제
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 삭제 성공
 *       404:
 *         description: 존재하지 않는 차량입니다
 */

/**
 * @swagger
 * /cars/upload:
 *   post:
 *     summary: 차량 대용량 업로드 (CSV)
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 업로드 처리 완료
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 successCount:
 *                   type: integer
 *                 failCount:
 *                   type: integer
 *                 failedRows:
 *                   type: array
 */

/**
 * @swagger
 * /cars/models:
 *   get:
 *     summary: 차량 모델 목록 조회
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 조회 성공
 */