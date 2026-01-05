import type { Prisma } from '@prisma/client';
import prisma from '../../configs/prisma.js';

export const companyRepository = {
  // 1) 회사 등록
  create(data: Prisma.CompanyCreateInput) {
    return prisma.company.create({ data });
  },

  // 2) 회사 코드로 회사 조회
  findByCompanyCode(companyCode: string) {
    return prisma.company.findFirst({
      where: { companyCode },
    });
  },

  // 3) 회사 ID로 회사 조회
  findById(companyId: number) {
    return prisma.company.findUnique({
      where: { id: companyId },
    });
  },

  // 4) 회사 정보 수정
  update(companyId: number, data: Prisma.CompanyUpdateInput) {
    return prisma.company.update({
      where: { id: companyId },
      data,
    });
  },

  // 5) 회사 삭제
  delete(companyId: number) {
    return prisma.company.delete({
      where: { id: companyId },
    });
  },

  // 6) 회사 수 및 회사 목록 조회
  countCompanies(where: Prisma.CompanyWhereInput) {
    return prisma.company.count({ where });
  },

  // 7) 회사 목록 조회
  findCompanies(
    where: Prisma.CompanyWhereInput,
    page: number,
    pageSize: number
  ) {
    return prisma.company.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { id: 'desc' },
      include: {
        users: true,
      },
    });
  },

  // 8) 회사별 유저 수 및 유저 목록 조회
  countCompanyUsers(where: Prisma.UserWhereInput) {
    return prisma.user.count({ where });
  },

  // 9) 회사별 유저 목록 조회
  findCompanyUsers(
    where: Prisma.UserWhereInput,
    page: number,
    pageSize: number
  ) {
    return prisma.user.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { id: 'desc' },
      include: {
        company: true,
      },
    });
  },
};
