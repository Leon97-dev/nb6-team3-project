import type { Request, Response, NextFunction } from 'express';
import {
  NotFoundError,
  UnauthorizedError,
} from '../../errors/error-handler.js';
import { companyService } from './company-service.js';
import type {
  CompanyListQuery,
  CompanyUsersQuery,
  CreateCompanyDto,
  UpdateCompanyDto,
} from './company-validator.js';

export const companyController = {
  // 1) 회사 등록
  async create(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    // 1-1) 관리자 권한 확인
    if (!req.user?.isAdmin) {
      throw new UnauthorizedError(null, '관리자 권한이 필요합니다');
    }
    // 1-2) 회사 등록
    const data = req.body as CreateCompanyDto;
    // 1-3) 회사 등록 서비스 호출
    const company = await companyService.createCompany(data);
    // 1-4) 등록된 회사 정보 응답
    res.status(201).json(company);
  },

  // 2) 회사 목록 조회
  async findAll(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    // 2-1) 관리자 권한 확인
    if (!req.user?.isAdmin) {
      throw new UnauthorizedError(null, '관리자 권한이 필요합니다');
    }
    // 2-2) validate 미들웨어로 정제된 쿼리 사용
    const { page, pageSize, searchBy, keyword } = req.query as CompanyListQuery;
    // 2-3) 회사 목록 조회 서비스 호출
    const result = await companyService.getCompany(
      page,
      pageSize,
      searchBy,
      keyword
    );
    // 2-4) 회사 목록 응답
    res.status(200).json(result);
  },

  // 3) 회사별 유저 조회
  async findUsers(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    // 3-1) 관리자 권한 확인
    if (!req.user?.isAdmin) {
      throw new UnauthorizedError(null, '관리자 권한이 필요합니다');
    }
    // 3-2) validate 미들웨어로 정제된 쿼리 사용
    const { page, pageSize, searchBy, keyword } =
      req.query as CompanyUsersQuery;
    // 3-3) 회사별 유저 조회 서비스 호출
    const users = await companyService.getUsersByCompany(
      page,
      pageSize,
      searchBy,
      keyword
    );
    // 3-4) 회사별 유저 응답
    res.status(200).json(users);
  },

  // 4) 회사 수정
  async update(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    // 4-1) 관리자 권한 확인
    if (!req.user?.isAdmin) {
      throw new UnauthorizedError(null, '관리자 권한이 필요합니다');
    }
    // 4-2) 회사 수정 서비스 호출
    const companyId = Number(req.params.companyId);

    if (Number.isNaN(companyId)) {
      throw new NotFoundError('존재하지 않는 회사입니다');
    }
    // 4-3) 회사 수정 서비스 호출
    const data = req.body as UpdateCompanyDto;
    const company = await companyService.updateCompany(companyId, data);

    // 4-4) 수정된 회사 정보 응답
    res.status(200).json(company);
  },

  // 5) 회사 삭제
  async delete(
    req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    // 5-1) 관리자 권한 확인
    if (!req.user?.isAdmin) {
      throw new UnauthorizedError(null, '관리자 권한이 필요합니다');
    }
    // 5-2) 회사 삭제 서비스 호출
    const companyId = Number(req.params.companyId);

    if (Number.isNaN(companyId))
      throw new NotFoundError('존재하지 않는 회사입니다');

    // 5-3) 회사 삭제 서비스 호출
    await companyService.deleteCompany(companyId);

    // 5-4) 회사 삭제 응답
    res.status(200).send({ message: '회사 삭제 성공' });
  },
};
