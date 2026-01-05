/**
 * @description 유저 서비스 모듈
 * 언제든지 수정 가능하니 문제 있으면 알려주세요!
 * @author 이호성
 * @date 2025-12-29
 * @version 1.0
 **/

import bcrypt from 'bcrypt';
import type { Prisma, User } from '@prisma/client';
import prisma from '../../configs/prisma.js';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '../../errors/error-handler.js';

type UserWithCompany = User & {
  company?: { companyCode: string | null };
};

const formatUserResponse = (user: UserWithCompany) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  employeeNumber: user.employeeNumber,
  phoneNumber: user.phoneNumber,
  imageUrl: user.imageUrl,
  isAdmin: user.isAdmin,
  company: {
    companyCode: user.company?.companyCode || null,
  },
});

export const userService = {
  // 1) 회원가입
  async signUp(data: {
    name?: string;
    email?: string;
    employeeNumber?: string;
    phoneNumber?: string;
    password?: string;
    passwordConfirmation?: string;
    companyName?: string;
    companyCode?: string;
  }) {
    const {
      name,
      email,
      employeeNumber,
      phoneNumber,
      password,
      passwordConfirmation,
      companyName,
      companyCode,
    } = data;

    if (
      !name ||
      !email ||
      !employeeNumber ||
      !phoneNumber ||
      !companyName ||
      !companyCode
    ) {
      throw new ValidationError(null, '잘못된 요청입니다');
    }
    const emailValue = email;
    const companyNameValue = companyName;
    const companyCodeValue = companyCode;

    if (!password || !passwordConfirmation) {
      throw new ValidationError(null, '비밀번호는 필수 항목입니다');
    }

    if (password !== passwordConfirmation) {
      throw new ValidationError(
        null,
        '비밀번호와 비밀번호 확인이 일치하지 않습니다'
      );
    }

    const exists = await prisma.user.findUnique({
      where: { email: emailValue },
    });
    if (exists) {
      throw new ConflictError('이미 존재하는 이메일입니다');
    }

    const company = await prisma.company.findFirst({
      where: { companyName: companyNameValue, companyCode: companyCodeValue },
      select: { id: true },
    });

    if (!company) {
      throw new ValidationError(null, '잘못된 요청입니다');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        employeeNumber,
        phoneNumber,
        password: passwordHash,
        companyId: company.id,
      },
      include: {
        company: { select: { companyCode: true } },
      },
    });

    return formatUserResponse(user);
  },

  // 2) 내 정보 조회
  async getMe(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        company: { select: { companyCode: true } },
      },
    });

    if (!user) {
      throw new NotFoundError('존재하지 않는 유저입니다');
    }

    return formatUserResponse(user);
  },

  // 3) 비밀번호 확인
  async checkPassword(userId: number, password: string) {
    if (!password) {
      throw new ValidationError(null, '비밀번호가 필요합니다');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      throw new NotFoundError('존재하지 않는 유저입니다');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new ValidationError(null, '비밀번호가 일치하지 않습니다');
    }

    return { encryptedCurrentPassword: user.password };
  },

  // 4) 내 정보 수정
  async updateMe(
    userId: number,
    data: {
      employeeNumber?: string;
      phoneNumber?: string;
      currentPassword?: string;
      password?: string;
      passwordConfirmation?: string;
      imageUrl?: string;
    }
  ) {
    const {
      employeeNumber,
      phoneNumber,
      currentPassword,
      password,
      passwordConfirmation,
      imageUrl,
    } = data;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) throw new NotFoundError('존재하지 않는 유저입니다');

    const updateData: Prisma.UserUpdateInput = {};

    if (employeeNumber !== undefined) {
      updateData.employeeNumber = employeeNumber;
    }

    if (phoneNumber !== undefined) {
      updateData.phoneNumber = phoneNumber;
    }

    if (imageUrl !== undefined) {
      updateData.imageUrl = imageUrl;
    }

    const requiresPasswordCheck =
      employeeNumber !== undefined ||
      phoneNumber !== undefined ||
      imageUrl !== undefined ||
      password !== undefined ||
      passwordConfirmation !== undefined;

    if (requiresPasswordCheck) {
      if (!currentPassword) {
        throw new ValidationError(null, '현재 비밀번호가 맞지 않습니다');
      }
      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) {
        throw new ValidationError(null, '현재 비밀번호가 맞지 않습니다');
      }
    }

    if (password || passwordConfirmation) {
      if (
        !password ||
        !passwordConfirmation ||
        password !== passwordConfirmation
      ) {
        throw new ValidationError(
          null,
          '비밀번호와 비밀번호 확인이 일치하지 않습니다'
        );
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      include: {
        company: { select: { companyCode: true } },
      },
    });

    return formatUserResponse(updated);
  },

  // 5) 회원 탈퇴
  async deleteMe(userId: number) {
    await prisma.user.delete({
      where: { id: userId },
    });
    return true;
  },

  // 6) 유저 삭제 (관리자)
  async deleteUserByAdmin(userId: number) {
    if (Number.isNaN(userId)) {
      throw new ValidationError(null, '잘못된 요청입니다');
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, isAdmin: true },
    });

    if (!user) {
      throw new NotFoundError('존재하지 않는 유저입니다');
    }

    await prisma.user.delete({ where: { id: userId } });
    return true;
  },
};
