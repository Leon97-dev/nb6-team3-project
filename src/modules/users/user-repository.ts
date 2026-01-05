/**
 * @description 유저 레포지토리 모듈
 * 언제든지 수정 가능하니 문제 있으면 알려주세요!
 * @author 이호성
 * @date 2025-12-29
 * @version 1.0
 **/

import type { Prisma } from '@prisma/client';
import prisma from '../../configs/prisma.js';

export const userRepository = {
  // 1) 이메일로 유저 찾기
  findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        company: { select: { companyName: true, companyCode: true } },
      },
    });
  },

  // 2) ID로 유저 찾기
  findById(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        company: { select: { companyName: true, companyCode: true } },
      },
    });
  },

  // 3) 유저 생성
  createUser(data: Prisma.UserCreateInput) {
    return prisma.user.create({
      data,
      include: {
        company: { select: { companyCode: true } },
      },
    });
  },

  // 4) 유저 업데이트
  updateUser(userId: number, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id: userId },
      data,
      include: {
        company: { select: { companyCode: true } },
      },
    });
  },

  // 5) 유저 삭제
  deleteUser(userId: number) {
    return prisma.user.delete({
      where: { id: userId },
    });
  },

  // 6) 회사 코드 + 이름으로 회사 찾기
  findCompany(companyName: string, companyCode: string) {
    return prisma.company.findFirst({
      where: { companyName, companyCode },
    });
  },
};
