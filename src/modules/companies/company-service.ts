import { NotFoundError, ValidationError } from '../../errors/error-handler.js';
import { companyRepository } from './company-repository.js';

export const companyService = {
  // 1) 회사 등록
  async createCompany(data: { companyName: string; companyCode: string }) {
    const companyName = data.companyName?.trim();
    const companyCode = data.companyCode?.trim();

    if (!companyName || !companyCode) {
      throw new ValidationError(null, '잘못된 요청입니다');
    }

    const exists = await companyRepository.findByCompanyCode(companyCode);

    if (exists) {
      throw new ValidationError(null, '잘못된 요청입니다');
    }

    const company = await companyRepository.create({
      companyName,
      companyCode,
    });

    const userCount = await companyRepository.countCompanyUsers({
      companyId: company.id,
    });

    return {
      id: company.id,
      companyName: company.companyName,
      companyCode: company.companyCode,
      userCount,
    };
  },

  // 회사 목록 조회
  async getCompany(
    page = 1,
    pageSize = 10,
    searchBy?: 'companyName',
    keyword?: string
  ) {
    page = Number(page) || 1;
    pageSize = Number(pageSize) || 10;

    const where: Parameters<typeof companyRepository.countCompanies>[0] = {};
    if (searchBy === 'companyName' && keyword) {
      where.companyName = { contains: keyword };
    }

    const totalItemCount = await companyRepository.countCompanies(where);
    const data = await companyRepository.findCompanies(where, page, pageSize);

    return {
      currentPage: page,
      totalPages: Math.ceil(totalItemCount / pageSize),
      totalItemCount,
      data: data.map((c) => ({
        id: c.id,
        companyName: c.companyName,
        companyCode: c.companyCode,
        userCount: c.users.length,
      })),
    };
  },

  // 회사별 유저 조회
  async getUsersByCompany(
    page = 1,
    pageSize = 10,
    searchBy?: 'companyName' | 'name' | 'email',
    keyword?: string
  ) {
    page = Number(page) || 1;
    pageSize = Number(pageSize) || 10;

    const where: Parameters<typeof companyRepository.countCompanyUsers>[0] = {};
    if (searchBy && keyword) {
      const contains = { contains: keyword };
      if (searchBy === 'companyName') {
        where.company = { companyName: contains };
      }
      if (searchBy === 'name') {
        where.name = contains;
      }
      if (searchBy === 'email') {
        where.email = contains;
      }
    }

    const totalItemCount = await companyRepository.countCompanyUsers(where);
    const data = await companyRepository.findCompanyUsers(
      where,
      page,
      pageSize
    );

    return {
      currentPage: page,
      totalPages: Math.ceil(totalItemCount / pageSize),
      totalItemCount,
      data: data.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        employeeNumber: u.employeeNumber,
        phoneNumber: u.phoneNumber,
        company: { companyName: u.company.companyName },
      })),
    };
  },

  // 회사 수정
  async updateCompany(
    companyId: number,
    data: { companyName?: string | undefined; companyCode?: string | undefined }
  ) {
    const company = await companyRepository.findById(companyId);
    if (!company) {
      throw new NotFoundError('존재하지 않는 회사입니다');
    }

    const updateData: Parameters<typeof companyRepository.update>[1] = {};
    if (data.companyName !== undefined) {
      const name = data.companyName.trim();
      if (!name) {
        throw new ValidationError(null, '잘못된 요청입니다');
      }
      updateData.companyName = name;
    }
    if (data.companyCode !== undefined) {
      const code = data.companyCode.trim();
      if (!code) {
        throw new ValidationError(null, '잘못된 요청입니다');
      }
      const exists = await companyRepository.findByCompanyCode(code);
      if (exists && exists.id !== companyId) {
        throw new ValidationError(null, '잘못된 요청입니다');
      }
      updateData.companyCode = code;
    }

    const updated = await companyRepository.update(companyId, updateData);
    const userCount = await companyRepository.countCompanyUsers({
      companyId: updated.id,
    });

    return {
      id: updated.id,
      companyName: updated.companyName,
      companyCode: updated.companyCode,
      userCount,
    };
  },

  // 회사 삭제
  async deleteCompany(companyId: number) {
    const company = await companyRepository.findById(companyId);
    if (!company) {
      throw new NotFoundError('존재하지 않는 회사입니다');
    }

    try {
      await companyRepository.delete(companyId);
    } catch (err: any) {
      if (err?.code === 'P2003') {
        throw new ValidationError(
          null,
          '관련 데이터가 있어 삭제할 수 없습니다'
        );
      }
      throw err;
    }
    return true;
  },
};
