/**
 * @description 인증 밸리데이터 모듈
 * 언제든지 수정 가능하니 문제 있으면 알려주세요!
 * @author 이호성
 * @date 2025-12-29
 * @version 1.0
 **/

import { object, string, type Infer } from 'superstruct';

export const LoginSchema = object({
  email: string(),
  password: string(),
});

export type LoginDto = Infer<typeof LoginSchema>;

export const RefreshSchema = object({
  refreshToken: string(),
});

export type RefreshDto = Infer<typeof RefreshSchema>;
