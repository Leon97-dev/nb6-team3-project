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
 *                 lastMonthSales:
 *                   type: integer
 *                 growthRate:
 *                   type: number
 *                 proceedingContractsCount:
 *                   type: integer
 *                 completedContractsCount:
 *                   type: integer
 *                 contractsByCarType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       carType:
 *                         type: string
 *                       count:
 *                         type: integer
 *                 salesByCarType:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       carType:
 *                         type: string
 *                       count:
 *                         type: integer
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