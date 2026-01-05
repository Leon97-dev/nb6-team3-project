/**
 * @description 인증 레포지토리 모듈
 * 언제든지 수정 가능하니 문제 있으면 알려주세요!
 * @author 이호성
 * @date 2025-12-29
 * @version 1.0
 **/

import type { User } from '@prisma/client';
import prisma from '../../configs/prisma.js';

export type UserWithCompany = User & {
  company: { companyName: string };
};

export type UserIdOnly = { id: number };

export const authRepository = {
  // 1) 이메일로 사용자 + 회사명 조회
  findUserByEmail(email: string): Promise<UserWithCompany | null> {
    return prisma.user.findUnique({
      where: { email },
      include: {
        company: {
          select: { companyName: true },
        },
      },
    });
  },

  // 2) 사용자 ID로 사용자 + 회사명 조회
  findUserById(userId: number): Promise<UserWithCompany | null> {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        company: {
          select: { companyName: true },
        },
      },
    });
  },

  // 3) 사용자 ID로 존재 여부만 조회
  findUserId(userId: number): Promise<UserIdOnly | null> {
    return prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
  },
};
