export { };

/**
 * @swagger
 * tags:
 *   name: Dashboards
 *   description: 대시보드 API
 */

/**
 * @swagger
 * /dashboards:
 *   get:
 *     summary: 대시보드 데이터 조회
 *     tags: [Dashboards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 monthlySales:
 *                   type: integer
 *                 growthRate:
 *                   type: number
 *                 proceedingContractsCount:
 *                   type: integer
 *                 completedContractsCount:
 *                   type: integer
 *                 salesByCarType:
 *                   type: array
 */