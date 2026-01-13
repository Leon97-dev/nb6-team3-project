export { };

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: 사용자(직원) 관리 API
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: 회원가입
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, employeeNumber, phoneNumber, password, passwordConfirmation, companyName, companyCode]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               employeeNumber:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               password:
 *                 type: string
 *               passwordConfirmation:
 *                 type: string
 *               companyName:
 *                 type: string
 *               companyCode:
 *                 type: string
 *     responses:
 *       201:
 *         description: 회원가입 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 employeeNumber:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *                 isAdmin:
 *                   type: boolean
 *                 company:
 *                   type: object
 *                   properties:
 *                     companyName:
 *                       type: string
 *       400:
 *         description: 잘못된 요청 (비밀번호 불일치, 회사 정보 없음 등)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "비밀번호와 비밀번호 확인이 일치하지 않습니다"
 *       409:
 *         description: 이미 존재하는 이메일
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "이미 존재하는 이메일입니다"
 */

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: 내 정보 조회
 *     tags: [Users]
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
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 employeeNumber:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *                 isAdmin:
 *                   type: boolean
 *                 company:
 *                   type: object
 *                   properties:
 *                     companyName:
 *                       type: string
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
 *         description: 존재하지 않는 유저
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "존재하지 않는 유저입니다"
 */

/**
 * @swagger
 * /users/check:
 *   post:
 *     summary: 비밀번호 확인
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 확인 성공
 *       400:
 *         description: 비밀번호 불일치
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "비밀번호가 일치하지 않습니다"
 *       404:
 *         description: 존재하지 않는 유저
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "존재하지 않는 유저입니다"
 */

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: 내 정보 수정
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employeeNumber:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               currentPassword:
 *                 type: string
 *               password:
 *                 type: string
 *               passwordConfirmation:
 *                 type: string
 *               imageUrl:
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
 *                 email:
 *                   type: string
 *                 employeeNumber:
 *                   type: string
 *                 phoneNumber:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *                 isAdmin:
 *                   type: boolean
 *                 company:
 *                   type: object
 *                   properties:
 *                     companyName:
 *                       type: string
 *       400:
 *         description: 잘못된 요청 (비밀번호 불일치 등)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "현재 비밀번호가 맞지 않습니다"
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
 *         description: 존재하지 않는 유저
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "존재하지 않는 유저입니다"
 */

/**
 * @swagger
 * /users/me:
 *   delete:
 *     summary: 회원 탈퇴
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "유저 삭제 성공"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "잘못된 요청입니다"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "존재하지 않는 유저입니다"
 */

/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     summary: 유저 삭제 (관리자)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "유저 삭제 성공"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "잘못된 요청입니다"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "관리자 권한이 필요합니다"
 *       404:
 *         description: Not Fount
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "존재하지 않는 유저입니다"
 */