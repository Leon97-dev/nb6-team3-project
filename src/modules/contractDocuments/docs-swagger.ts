export { };

/**
 * @swagger
 * tags:
 *   name: ContractDocuments
 *   description: 계약 서류 관리 API
 */

/**
 * @swagger
 * /contractDocuments:
 *   get:
 *     summary: 계약 서류 목록 조회
 *     tags: [ContractDocuments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: searchBy
 *         schema:
 *           type: string
 *           enum: [contractName, userName]
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 조회 성공
 */

/**
 * @swagger
 * /contractDocuments/draft:
 *   get:
 *     summary: 계약 완료된 건 조회 (서류 업로드용)
 *     tags: [ContractDocuments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 조회 성공
 */

/**
 * @swagger
 * /contractDocuments/upload:
 *   post:
 *     summary: 계약 서류 업로드
 *     tags: [ContractDocuments]
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
 *       201:
 *         description: 업로드 성공
 *       400:
 *         description: 파일이 업로드되지 않았습니다
 */

/**
 * @swagger
 * /contractDocuments/{id}/download:
 *   get:
 *     summary: 계약 서류 다운로드
 *     tags: [ContractDocuments]
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
 *         description: 다운로드 성공
 *       404:
 *         description: 파일을 찾을 수 없습니다
 */