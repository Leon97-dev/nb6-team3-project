/**
 * @description 비동기 함수 컨트롤러 핸들러
 * try-catch 문 말고 핸들러를 이용해 통일합시다.
 * @author 이호성
 * @date 2025-12-17
 * @version 1.0
 * @warning 코드 수정 금지!
 **/

import type { NextFunction, Request, Response } from 'express';

type AsyncController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown> | unknown;

const asyncHandler =
  (fn: AsyncController) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export default asyncHandler;
