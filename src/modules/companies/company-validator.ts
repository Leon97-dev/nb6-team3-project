import {
  coerce,
  defaulted,
  enums,
  object,
  optional,
  partial,
  refine,
  string,
  size,
  number,
  union,
} from 'superstruct';
import type { ParsedQs } from 'qs';

// 1) 공백 입력 방지 및 trim 적용
const TrimmedString = coerce(string(), string(), (value) => value.trim());

// 2) 회사 생성 스키마 정의
export const createCompanySchema = object({
  companyName: size(TrimmedString, 1, 50),
  companyCode: size(TrimmedString, 1, 20),
});

// 3) 회사 수정 스키마 정의 (부분 업데이트)
export const updateCompanySchema = partial(createCompanySchema);

// 4) 공통: 양수 정수 검사
const PositiveInt = refine(
  coerce(number(), union([string(), number()]), (value) => Number(value)),
  'PositiveInt',
  (value) => Number.isInteger(value) && value > 0
);

// 5) 회사 생성/수정 DTO 타입
export type CreateCompanyDto = (typeof createCompanySchema)['TYPE'];
export type UpdateCompanyDto = (typeof updateCompanySchema)['TYPE'];

export type CompanyListQuery = ParsedQs & {
  page: number;
  pageSize: number;
  searchBy?: 'companyName';
  keyword?: string;
};

// 6) 회사 목록 조회 쿼리 스키마
export const companyListQuerySchema = object({
  page: defaulted(PositiveInt, 1),
  pageSize: defaulted(PositiveInt, 10),
  searchBy: optional(enums(['companyName'])),
  keyword: optional(string()),
});

// 7) 회사별 유저 조회 쿼리 타입
export type CompanyUsersQuery = ParsedQs & {
  page: number;
  pageSize: number;
  searchBy?: 'companyName' | 'name' | 'email';
  keyword?: string;
};

// 8) 회사별 유저 조회 쿼리 스키마
export const companyUsersQuerySchema = object({
  page: defaulted(PositiveInt, 1),
  pageSize: defaulted(PositiveInt, 10),
  searchBy: optional(enums(['companyName', 'name', 'email'])),
  keyword: optional(string()),
});

// 9) 회사 params 스키마
export const companyIdParamSchema = object({
  companyId: PositiveInt,
});
