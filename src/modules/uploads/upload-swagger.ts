export { };

/**
 * @swagger
 * tags:
 *   name: Uploads
 *   description: 파일 업로드 API
 */

/**
 * @swagger
 * /uploads/upload:
 *   post:
 *     summary: 파일 업로드
 *     tags: [Uploads]
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *       400:
 *         description: 파일이 업로드되지 않았습니다
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "파일이 업로드되지 않았습니다."
 */