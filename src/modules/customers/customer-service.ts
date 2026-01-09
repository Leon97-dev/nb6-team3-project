// TODO) Customer-Service:
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import type { Prisma } from '@prisma/client';
import prisma from '../../configs/prisma.js';
import { NotFoundError, ValidationError } from '../../errors/error-handler.js';
import {
  AGE_GROUP_API_TO_DB,
  AGE_GROUP_DB_TO_API,
  GENDER_API_TO_DB,
  GENDER_DB_TO_API,
  REGION_API_TO_DB,
  REGION_DB_TO_API,
} from '../../utils/enum-mapper.js';

const normalizeInput = (value: unknown) =>
  typeof value === 'string' ? value.trim() : undefined;

// 연령대 입력 포맷 alias 처리: "30-40" -> "30대" 등
const AGE_GROUP_ALIASES: Record<string, keyof typeof AGE_GROUP_API_TO_DB> = {
  '10-20': '10대',
  '20-30': '20대',
  '30-40': '30대',
  '40-50': '40대',
  '50-60': '50대',
  '60-70': '60대',
  '70-80': '70대',
  '80-90': '80대',
};

const toDbGender = (value: unknown) => {
  if (!value || typeof value !== 'string') return undefined;
  const key = value.toLowerCase() as keyof typeof GENDER_API_TO_DB;
  return GENDER_API_TO_DB[key];
};

const toDbAgeGroup = (value: unknown) => {
  if (!value) return undefined;
  const key = normalizeInput(value);
  if (!key) return undefined;

  const mappedKey =
    AGE_GROUP_ALIASES[key] ?? (key as keyof typeof AGE_GROUP_API_TO_DB);

  if (mappedKey in AGE_GROUP_API_TO_DB) {
    return AGE_GROUP_API_TO_DB[mappedKey];
  }

  return undefined;
};

const toDbRegion = (value: unknown) => {
  if (!value) return undefined;
  const key = normalizeInput(value);
  return key
    ? REGION_API_TO_DB[key as keyof typeof REGION_API_TO_DB]
    : undefined;
};

const toApiGender = (value: keyof typeof GENDER_DB_TO_API | null) =>
  value ? GENDER_DB_TO_API[value] : null;
const toApiAgeGroup = (value: keyof typeof AGE_GROUP_DB_TO_API | null) =>
  value ? AGE_GROUP_DB_TO_API[value] : null;
const toApiRegion = (value: keyof typeof REGION_DB_TO_API | null) =>
  value ? REGION_DB_TO_API[value] : null;

const mapCustomerResponse = (
  customer: Prisma.CustomerGetPayload<{ include?: { _count?: true } }>,
  contractCount = 0
) => ({
  id: customer.id,
  name: customer.name,
  gender: toApiGender(customer.gender as any),
  phoneNumber: customer.phoneNumber,
  ageGroup: toApiAgeGroup(customer.ageGroup as any),
  region: toApiRegion(customer.region as any),
  email: customer.email,
  memo: customer.memo,
  contractCount,
});

class CustomersService {
  // 고객 등록
  async createCustomer(
    companyId: number,
    data: {
      name?: string;
      gender?: string;
      phoneNumber?: string;
      ageGroup?: string;
      region?: string;
      email?: string | null;
      memo?: string | null;
    }
  ) {
    const { name, gender, phoneNumber, ageGroup, region, email, memo } = data;

    if (!name || !gender || !phoneNumber) {
      throw new ValidationError(null, '잘못된 요청입니다');
    }

    const exists = await prisma.customer.findFirst({
      where: { companyId, phoneNumber },
    });

    if (exists) {
      throw new ValidationError(null, '잘못된 요청입니다');
    }

    const genderValue = toDbGender(gender);
    if (!genderValue) {
      throw new ValidationError(null, '잘못된 요청입니다');
    }

    const trimmedName = name.trim();
    const trimmedPhone = phoneNumber.trim();

    if (!trimmedName || !trimmedPhone) {
      throw new ValidationError(null, '잘못된 요청입니다');
    }

    const ageGroupValue =
      ageGroup === undefined || ageGroup === null
        ? null
        : toDbAgeGroup(ageGroup);
    if (
      ageGroup !== undefined &&
      ageGroup !== null &&
      ageGroupValue === undefined
    ) {
      throw new ValidationError(null, '잘못된 요청입니다');
    }
    const regionValue =
      region === undefined || region === null ? null : toDbRegion(region);
    if (region !== undefined && region !== null && regionValue === undefined) {
      throw new ValidationError(null, '잘못된 요청입니다');
    }

    const customer = await prisma.customer.create({
      data: {
        companyId,
        name: trimmedName,
        gender: genderValue,
        phoneNumber: trimmedPhone,
        ageGroup: ageGroupValue ?? null,
        region: regionValue ?? null,
        email: email?.trim() || null,
        memo: memo?.trim() || null,
      },
    });

    return mapCustomerResponse(customer, 0);
  }

  // 고객 목록 조회
  async getCustomers(
    companyId: number,
    page = 1,
    pageSize = 10,
    searchBy?: 'name' | 'email',
    keyword?: string
  ) {
    page = Number(page) || 1;
    pageSize = Number(pageSize) || 10;

    const where: Prisma.CustomerWhereInput = { companyId };

    if (searchBy && keyword) {
      if (searchBy === 'name') {
        where.name = { contains: keyword };
      }
      if (searchBy === 'email') {
        where.email = { contains: keyword };
      }
    }

    const totalItemCount = await prisma.customer.count({ where });

    const data = await prisma.customer.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { id: 'desc' },
      include: {
        _count: { select: { contracts: true } },
      },
    });

    return {
      currentPage: page,
      totalPages: Math.ceil(totalItemCount / pageSize),
      totalItemCount,
      data: data.map((customer) =>
        mapCustomerResponse(customer, customer._count.contracts)
      ),
    };
  }

  // 고객 상세 조회
  async getCustomerById(companyId: number, customerId: number) {
    const customer = await prisma.customer.findFirst({
      where: { id: customerId, companyId },
      include: { _count: { select: { contracts: true } } },
    });

    if (!customer) {
      throw new NotFoundError('존재하지 않는 고객입니다');
    }

    return mapCustomerResponse(customer, customer._count.contracts);
  }

  // 고객 수정
  async updateCustomer(
    companyId: number,
    customerId: number,
    data: {
      name?: string;
      gender?: string;
      phoneNumber?: string;
      ageGroup?: string;
      region?: string;
      email?: string | null;
      memo?: string | null;
    }
  ) {
    const customer = await prisma.customer.findFirst({
      where: { id: customerId, companyId },
    });

    if (!customer) {
      throw new NotFoundError('존재하지 않는 고객입니다');
    }

    const payload: Prisma.CustomerUpdateInput = {};

    if (data.name !== undefined) {
      const trimmed = data.name.trim();
      if (!trimmed) {
        throw new ValidationError(null, '잘못된 요청입니다');
      }
      payload.name = trimmed;
    }
    if (data.gender !== undefined) {
      const genderValue = toDbGender(data.gender);
      if (!genderValue) {
        throw new ValidationError(null, '잘못된 요청입니다');
      }
      payload.gender = genderValue;
    }
    if (data.phoneNumber !== undefined) {
      const trimmed = data.phoneNumber.trim();
      if (!trimmed) {
        throw new ValidationError(null, '잘못된 요청입니다');
      }
      payload.phoneNumber = trimmed;
    }
    if (data.ageGroup !== undefined) {
      const ageGroupValue = toDbAgeGroup(data.ageGroup);
      if (ageGroupValue === undefined && data.ageGroup !== null) {
        throw new ValidationError(null, '잘못된 요청입니다');
      }
      payload.ageGroup = ageGroupValue ?? null;
    }
    if (data.region !== undefined) {
      const regionValue = toDbRegion(data.region);
      if (regionValue === undefined && data.region !== null) {
        throw new ValidationError(null, '잘못된 요청입니다');
      }
      payload.region = regionValue ?? null;
    }
    if (data.email !== undefined) payload.email = data.email?.trim() || null;
    if (data.memo !== undefined) payload.memo = data.memo?.trim() || null;

    const updated = await prisma.$transaction(async (tx) => {
      // companyId까지 조건에 걸어 의도치 않은 타 회사 데이터 수정 방지
      const result = await tx.customer.updateMany({
        where: { id: customerId, companyId },
        data: payload,
      });

      if (result.count === 0) {
        throw new NotFoundError('존재하지 않는 고객입니다');
      }

      return tx.customer.findFirstOrThrow({
        where: { id: customerId, companyId },
        include: { _count: { select: { contracts: true } } },
      });
    });

    return mapCustomerResponse(updated, updated._count.contracts);
  }

  // 고객 삭제
  async deleteCustomer(companyId: number, customerId: number) {
    const customer = await prisma.customer.findFirst({
      where: { id: customerId, companyId },
    });

    if (!customer) {
      throw new NotFoundError('존재하지 않는 고객입니다');
    }

    const result = await prisma.customer.deleteMany({
      where: { id: customerId, companyId },
    });

    if (result.count === 0) {
      throw new NotFoundError('존재하지 않는 고객입니다');
    }

    return true;
  }

  // 고객 CSV 대용량 업로드
  async bulkUpload(companyId: number, filePath: string) {
    const file = fs.readFileSync(filePath);
    const rows = parse(file, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Array<Record<string, string>>;

    if (!rows.length) {
      throw new ValidationError(null, '잘못된 요청입니다');
    }

    const operations = rows.map((row) => {
      const gender = toDbGender(row.gender);
      if (!gender) {
        throw new ValidationError(null, '잘못된 요청입니다');
      }

      const name = normalizeInput(row.name);
      const phoneNumber = normalizeInput(row.phoneNumber);
      if (!name || !phoneNumber) {
        throw new ValidationError(null, '잘못된 요청입니다');
      }

      const ageGroupValue =
        row.ageGroup === undefined ||
        row.ageGroup === null ||
        row.ageGroup === ''
          ? null
          : toDbAgeGroup(row.ageGroup);
      if (row.ageGroup && ageGroupValue === undefined) {
        throw new ValidationError(null, '잘못된 요청입니다');
      }
      const regionValue =
        row.region === undefined || row.region === null || row.region === ''
          ? null
          : toDbRegion(row.region);
      if (row.region && regionValue === undefined) {
        throw new ValidationError(null, '잘못된 요청입니다');
      }

      return prisma.customer.create({
        data: {
          companyId,
          name,
          gender,
          phoneNumber,
          ageGroup: ageGroupValue ?? null,
          region: regionValue ?? null,
          email: normalizeInput(row.email) || null,
          memo: normalizeInput(row.memo) || null,
        },
      });
    });

    await prisma.$transaction(operations);

    return true;
  }
}

export const customersService = new CustomersService();
