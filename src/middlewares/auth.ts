/**
 * @description 인증 미들웨어 모듈
 * 언제든지 수정 가능하니 문제 있으면 알려주세요!
 * 팀원분들 라우트 작성할 때 필요 할 것 같아 빨리 푸쉬 합니다.
 * @author 이호성
 * @date 2025-12-23
 * @version 1.0
 **/

import jwt, { type Secret } from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import type { TokenPayload } from '../types/jwt.js';
import { UnauthorizedError } from '../errors/error-handler.js';
import prisma from '../configs/prisma.js';
import { ENV } from '../configs/env.js';

const JWT_SECRET = ENV.ACCESS_SECRET as Secret;

if (!JWT_SECRET) {
  throw new Error('ACCESS_SECRET이 설정되어 있지 않습니다.');
}

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError(null, '로그인이 필요합니다');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new UnauthorizedError(null, '로그인이 필요합니다');
  }

  let decoded: TokenPayload;
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    if (
      typeof verified === 'string' ||
      !verified ||
      typeof (verified as any).id !== 'number'
    ) {
      throw new UnauthorizedError(null, '로그인이 필요합니다');
    }
    decoded = verified as TokenPayload;
  } catch {
    throw new UnauthorizedError(null, '로그인이 필요합니다');
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      name: true,
      email: true,
      employeeNumber: true,
      phoneNumber: true,
      imageUrl: true,
      isAdmin: true,
      companyId: true,
    },
  });

  if (!user) {
    throw new UnauthorizedError(null, '로그인이 필요합니다');
  }

  req.user = user;

  next();
}

export function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  if (!req.user?.isAdmin) {
    throw new UnauthorizedError(null, '관리자 권한이 필요합니다');
  }

  next();
}
