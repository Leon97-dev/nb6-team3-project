export { };

/**
 * @swagger
 * tags:
 *   name: Common
 *   description: 공통 및 헬스체크 API
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: 서버 상태 확인
 *     tags: [Common]
 *     responses:
 *       200:
 *         description: 서버 정상
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "ok"
 */

/**
 * @swagger
 * /health/db:
 *   get:
 *     summary: DB 연결 상태 확인
 *     tags: [Common]
 *     responses:
 *       200:
 *         description: DB 연결 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 */