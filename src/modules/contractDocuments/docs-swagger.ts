/**
 * @swagger
 * tags:
 *   name: ContractDocuments
 *   description: 계약 문서 관리 API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ContractDocument:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: 문서 ID
 *         fileName:
 *           type: string
 *           description: 파일명
 *         fileUrl:
 *           type: string
 *           description: 파일 경로
 *         fileSize:
 *           type: integer
 *           description: 파일 크기 (bytes)
 *         contentType:
 *           type: string
 *           description: 파일 MIME 타입
 */

/**
 * @swagger
 * /contractDocuments:
 *   get:
 *     summary: 계약 문서 목록 조회
 *     tags: [ContractDocuments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 페이지 번호
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 페이지 크기
 *       - in: query
 *         name: searchBy
 *         schema:
 *           type: string
 *           enum: [contractName, userName]
 *         description: 검색 기준 (계약명, 담당자명)
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
 *               type: object
 *               properties:
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalItemCount:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       contractName:
 *                         type: string
 *                       resolutionDate:
 *                         type: string
 *                         format: date-time
 *                       documentCount:
 *                         type: integer
 *                       userName:
 *                         type: string
 *                       carNumber:
 *                         type: string
 *                       documents:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/ContractDocument'
 *       401:
 *         description: 로그인이 필요합니다
 */

/**
 * @swagger
 * /contractDocuments/draft:
 *   get:
 *     summary: 계약서 초안 목록 조회 (계약 성공 상태인 계약들)
 *     tags: [ContractDocuments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   data:
 *                     type: string
 *                     description: 계약명
 *       401:
 *         description: 로그인이 필요합니다
 */

/**
 * @swagger
 * /contractDocuments/upload:
 *   post:
 *     summary: 계약 문서 파일 업로드
 *     tags: [ContractDocuments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: 업로드할 파일
 *     responses:
 *       200:
 *         description: 업로드 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContractDocument'
 *       400:
 *         description: 파일이 업로드되지 않았거나 잘못된 요청
 *       401:
 *         description: 로그인이 필요합니다
 */

/**
 * @swagger
 * /contractDocuments/{id}/download:
 *   get:
 *     summary: 계약 문서 다운로드
 *     tags: [ContractDocuments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 문서 ID
 *     responses:
 *       200:
 *         description: 다운로드 성공
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: 유효하지 않은 ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: 에러 메시지
 *                   example: "유효하지 않은 ID"
 *       401:
 *         description: 로그인이 필요합니다
 *       404:
 *         description: 파일을 찾을 수 없음
 */
