/**
 * @description req.body 검증 미들웨어
 * 언제든지 수정 가능하니 문제 있으면 알려주세요!
 * @author 이호성
 * @date 2025-12-23
 * @version 1.0
 **/

import type { Request, Response, NextFunction } from 'express';
import type { Struct } from 'superstruct';
import { validate as superstructValidate } from 'superstruct';
import { ValidationError } from '../errors/error-handler.js';

export const validate =
  <T>(schema: Struct<T>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const [error, result] = superstructValidate(req.body, schema);

    if (error) {
      throw new ValidationError(null, error.message);
    }

    req.body = result;

    next();
  };
