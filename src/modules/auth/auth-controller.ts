/**
 * @description 인증 컨트롤러 모듈
 * 언제든지 수정 가능하니 문제 있으면 알려주세요!
 * @author 이호성
 * @date 2025-12-29
 * @version 1.0
 **/

import type { NextFunction, Request, Response } from 'express';
import { authService } from './auth-service.js';
import type { LoginDto, RefreshDto } from './auth-validator.js';

export const authController = {
  // 1) 로그인
  async login(req: Request, res: Response, _next: NextFunction): Promise<void> {
    const { email, password } = req.body as LoginDto;

    const result = await authService.login(email, password);

    res.status(200).json(result);
  },
  
  // 2) 토큰 갱신
  async refresh(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    const { refreshToken } = req.body as RefreshDto;

    const tokens = await authService.refresh(refreshToken);

    res.status(200).json(tokens);
  },
};
