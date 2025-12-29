/**
 * @description 유저 컨트롤러 모듈
 * 언제든지 수정 가능하니 문제 있으면 알려주세요!
 * @author 이호성
 * @date 2025-12-29
 * @version 1.0
 **/

import type { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../../errors/error-handler.js';
import { userService } from './user-service.js';

export const userController = {
  // 1) 회원가입
  async signUp(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    const result = await userService.signUp(req.body);
    res.status(201).json(result);
  },
  
  // 2) 내 정보 조회
  async getMe(req: Request, res: Response, _next: NextFunction): Promise<void> {
    const userId = req.user!.id;
    const result = await userService.getMe(userId);
    res.status(200).json(result);
  },

  // 3) 비밀번호 확인
  async checkPassword(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    const userId = req.user!.id;
    const result = await userService.checkPassword(userId, req.body.password);
    res.status(200).json(result);
  },

  // 4) 내 정보 수정
  async updateMe(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    const userId = req.user!.id;
    const result = await userService.updateMe(userId, req.body);
    res.status(200).json(result);
  },

  // 5) 회원 탈퇴
  async deleteMe(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    const userId = req.user!.id;
    await userService.deleteMe(userId);
    res.status(200).json({ message: '유저 삭제 성공' });
  },

  // 6) 유저 삭제 (관리자)
  async deleteUserByAdmin(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    const userId = Number(req.params.userId);
    if (Number.isNaN(userId)) {
      throw new ValidationError(null, '잘못된 요청입니다');
    }
    await userService.deleteUserByAdmin(userId);
    res.status(200).json({ message: '유저 삭제 성공' });
  },
};
