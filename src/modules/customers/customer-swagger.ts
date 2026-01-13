export { };

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: 고객 관리 API
 */

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: 고객 목록 조회
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 현재 페이지 번호
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: 페이지당 아이템 수
 *       - in: query
 *         name: searchBy
 *         schema:
 *           type: string
 *           enum: [name, email]
 *         description: 검색 기준
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 검색어
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
 *                         name:
 *                           type: string
 *                         gender:
 *                           type: string
 *                           enum: [male, female]
 *                         phoneNumber:
 *                           type: string
 *                         ageGroup:
 *                           type: string
 *                           enum: [10대, 20대, 30대, 40대, 50대, 60대, 70대, 80대]
 *                         region:
 *                           type: string
 *                           enum: [서울, 경기, 인천, 강원, 충북, 충남, 세종, 대전, 전북, 전남, 광주, 경북, 경남, 대구, 울산, 부산, 제주]
 *                         email:
 *                           type: string
 *                         memo:
 *                           type: string
 *                         contractCount:
 *                           type: integer
 *       400:
 *         description: 잘못된 요청입니다
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
 *                   example: "로그인이 필요합니다"
 */

/**
 * @swagger
 * /customers:
 *   post:
 *     summary: 고객 등록
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, phoneNumber]
 *             properties:
 *               name:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *               phoneNumber:
 *                 type: string
 *               ageGroup:
 *                 type: string
 *                 enum: [10대, 20대, 30대, 40대, 50대, 60대, 70대, 80대]
 *               region:
 *                 type: string
 *                 enum: [서울, 경기, 인천, 강원, 충북, 충남, 세종, 대전, 전북, 전남, 광주, 경북, 경남, 대구, 울산, 부산, 제주]
 *               email:
 *                 type: string
 *               memo:
 *                 type: string
 *     responses:
 *       201:
 *         description: 등록 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 gender:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 ageGroup:
 *                   type: string
 *                 region:
 *                   type: string
 *                 email:
 *                   type: string
 *                 memo:
 *                   type: string
 *                 contractCount:
 *                   type: integer
 *       400:
 *         description: 잘못된 요청입니다
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
 *                   example: "로그인이 필요합니다"
 */

/**
 * @swagger
 * /customers/upload:
 *   post:
 *     summary: 고객 대용량 업로드 (CSV)
 *     tags: [Customers]
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
 *         description: 성공적으로 등록되었습니다
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "성공적으로 등록되었습니다"
 *       400:
 *         description: 잘못된 요청입니다
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
 *                   example: "로그인이 필요합니다"
 */

/**
 * @swagger
 * /customers/{customerId}:
 *   get:
 *     summary: 고객 상세 조회
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 고객 ID
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 gender:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 ageGroup:
 *                   type: string
 *                 region:
 *                   type: string
 *                 email:
 *                   type: string
 *                 memo:
 *                   type: string
 *                 contractCount:
 *                   type: integer
 *       400:
 *         description: 잘못된 요청입니다
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
 *                   example: "로그인이 필요합니다"
 *       404:
 *         description: 존재하지 않는 고객입니다
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "존재하지 않는 고객입니다"
 */

/**
 * @swagger
 * /customers/{customerId}:
 *   patch:
 *     summary: 고객 정보 수정
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 고객 ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *               phoneNumber:
 *                 type: string
 *               ageGroup:
 *                 type: string
 *                 enum: [10대, 20대, 30대, 40대, 50대, 60대, 70대, 80대]
 *               region:
 *                 type: string
 *                 enum: [서울, 경기, 인천, 강원, 충북, 충남, 세종, 대전, 전북, 전남, 광주, 경북, 경남, 대구, 울산, 부산, 제주]
 *               email:
 *                 type: string
 *               memo:
 *                 type: string
 *     responses:
 *       200:
 *         description: 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 gender:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 ageGroup:
 *                   type: string
 *                 region:
 *                   type: string
 *                 email:
 *                   type: string
 *                 memo:
 *                   type: string
 *                 contractCount:
 *                   type: integer
 *       400:
 *         description: 잘못된 요청입니다
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
 *                   example: "로그인이 필요합니다"
 *       404:
 *         description: 존재하지 않는 고객입니다
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "존재하지 않는 고객입니다"
 */

/**
 * @swagger
 * /customers/{customerId}:
 *   delete:
 *     summary: 고객 삭제
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 고객 ID
 *     responses:
 *       200:
 *         description: 삭제 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "고객 삭제 성공"
 *       400:
 *         description: 잘못된 요청입니다
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
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
 *                   example: "로그인이 필요합니다"
 *       404:
 *         description: 존재하지 않는 고객입니다
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "존재하지 않는 고객입니다"
 */