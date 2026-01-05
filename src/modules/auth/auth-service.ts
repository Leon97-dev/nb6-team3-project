/**
 * @description 인증 서비스 모듈
 * 언제든지 수정 가능하니 문제 있으면 알려주세요!
 * @author 이호성
 * @date 2025-12-29
 * @version 1.0
 **/

import bcrypt from 'bcrypt';
import { ValidationError, NotFoundError } from '../../errors/error-handler.js';
import { authRepository, type UserWithCompany } from './auth-repository.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from '../../utils/to-token.js';
import { ENV } from '../../configs/env.js';
import type { TokenPayload } from '../../types/jwt.js';

const toResponseUser = (user: UserWithCompany) => {
  const companyName = user.company.companyName;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    employeeNumber: user.employeeNumber,
    phoneNumber: user.phoneNumber,
    imageUrl: user.imageUrl,
    isAdmin: user.isAdmin,
    company: {
      companyName,
    },
  };
};

export const authService = {
  // 1) 로그인
  async login(email: string, password: string) {
    // 1-1) 이메일로 사용자 조회 및 검증
    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      throw new NotFoundError('존재하지 않거나 비밀번호가 일치하지 않습니다');
    }

    // 1-2) 비밀번호 검증
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new NotFoundError('존재하지 않거나 비밀번호가 일치하지 않습니다');
    }

    const accessToken = generateAccessToken({ id: user.id });
    const refreshToken = generateRefreshToken({ id: user.id });

    return {
      user: toResponseUser(user),
      accessToken,
      refreshToken,
    };
  },

  // 2) 토큰 갱신
  async refresh(refreshToken: string) {
    let decoded: TokenPayload | string;

    try {
      decoded = verifyToken(refreshToken, ENV.REFRESH_SECRET) as
        | TokenPayload
        | string;
    } catch (_error) {
      throw new ValidationError(null, '잘못된 요청입니다');
    }

    if (typeof decoded === 'string' || typeof decoded.id !== 'number') {
      throw new ValidationError(null, '잘못된 요청입니다');
    }

    const user = await authRepository.findUserId(decoded.id);

    if (!user) {
      throw new ValidationError(null, '잘못된 요청입니다');
    }

    const newAccessToken = generateAccessToken({ id: user.id });
    const newRefreshToken = generateRefreshToken({ id: user.id });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  },
};
