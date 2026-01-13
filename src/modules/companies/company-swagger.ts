export { };

/**
 * @swagger
 * tags:
 *   name: Companies
 *   description: 회사 관리 API
 */

/**
 * @swagger
 * /companies:
 *   post:
 *     summary: 회사 등록 (관리자)
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [companyName, companyCode]
 *             properties:
 *               companyName:
 *                 type: string
 *               companyCode:
 *                 type: string
 *     responses:
 *       201:
 *         description: 등록 성공
 *       401:
 *         description: 권한이 없습니다
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "관리자 권한이 필요합니다"
 */

/**
 * @swagger
 * /companies:
 *   get:
 *     summary: 회사 목록 조회 (관리자)
 *     tags: [Companies]
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
 *         name: searchBy
 *         schema:
 *           type: string
 *           enum: [companyName]
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
 *                   data:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         companyName:
 *                           type: string
 *                         companyCode:
 *                           type: string
 */

/**
 * @swagger
 * /companies/users:
 *   get:
 *     summary: 회사별 유저 목록 조회 (관리자)
 *     tags: [Companies]
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
 *           enum: [companyName, name, email]
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
 * /companies/{companyId}:
 *   patch:
 *     summary: 회사 정보 수정 (관리자)
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               companyCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: 수정 성공
 *       404:
 *         description: 존재하지 않는 회사입니다
 */

/**
 * @swagger
 * /companies/{companyId}:
 *   delete:
 *     summary: 회사 삭제 (관리자)
 *     tags: [Companies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 삭제 성공
 *       404:
 *         description: 존재하지 않는 회사입니다
 */