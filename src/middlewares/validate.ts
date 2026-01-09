/**
 * @description 요청 데이터 검증 미들웨어
 * 언제든지 수정 가능하니 문제 있으면 알려주세요!
 * 미들웨어 사용한다면, 각 도메인별로 스키마 정의 해야하고 캐스팅 주의 필요합니다.
 * @author 이호성
 * @date 2025-12-24
 * @version 1.1
 **/

import type { Request, Response, NextFunction } from 'express';
import type { Struct } from 'superstruct';
import { validate as superstructValidate } from 'superstruct';
import { ValidationError } from '../errors/error-handler.js';

// 1) 검증 대상 지정 타입
type Target = 'body' | 'query' | 'params';

// 2) 검증 미들웨어 팩토리 함수
export const validate =
  <T>(schema: Struct<T>, target: Target = 'body') =>
  (req: Request, _res: Response, next: NextFunction) => {
    const data =
      target === 'body'
        ? req.body
        : target === 'query'
          ? typeof req.query === 'string'
            ? {}
            : req.query
          : req.params;

    try {
      const [error, result] = superstructValidate(data, schema, {
        coerce: true,
      });
      if (error) {
        throw error;
      }

      if (target === 'body') {
        req.body = result;
      } else if (target === 'query') {
        const queryObj = typeof req.query === 'string' ? {} : req.query;
        Object.assign(queryObj as any, result);
      } else if (target === 'params') {
        const paramsObj = req.params || {};
        Object.assign(paramsObj as any, result);
      }

      next();
    } catch (error) {
      console.log('⚠️ Validate Middleware Error:', error);
      throw new ValidationError(null, '잘못된 요청입니다');
    }
  };

// 3) 용도별 미들웨어 함수
export const validateQuery =
  <T>(schema: Struct<T>) =>
  (req: Request, res: Response, next: NextFunction) =>
    validate<T>(schema, 'query')(req, res, next);

export const validateParams =
  <T>(schema: Struct<T>) =>
  (req: Request, res: Response, next: NextFunction) =>
    validate<T>(schema, 'params')(req, res, next);
