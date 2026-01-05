import {
  type Infer,
  coerce,
  defaulted,
  enums,
  max,
  number,
  object,
  optional,
  refine,
  size,
  string,
  union,
} from 'superstruct';

const requiredString = (message: string) =>
  refine(string(), 'required', (value) => (value.length > 0 ? true : message));

const trimmedString = coerce(string(), string(), (value) => value.trim());

const nonEmptyTrimmedString = refine(
  trimmedString,
  'nonEmpty',
  (value) => value.length > 0
);

const emailString = refine(string(), 'email', (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? true
    : 'email 형식이 올바르지 않습니다.'
);

const coercedNumber = coerce(
  number(),
  union([string(), number()]),
  (value) => {
    const parsed = typeof value === 'string' ? Number(value) : value;
    return Number.isNaN(parsed) ? value : parsed;
  }
);

const intNumber = refine(coercedNumber, 'int', (value) =>
  Number.isInteger(value)
);

const positiveInt = refine(intNumber, 'positive', (value) => value > 0);

export const GenderSchema = enums(['male', 'female']);

export const AgeGroupSchema = enums([
  '10대',
  '20대',
  '30대',
  '40대',
  '50대',
  '60대',
  '70대',
  '80대',
]);

export const RegionSchema = enums([
  '서울',
  '경기',
  '인천',
  '강원',
  '충북',
  '충남',
  '세종',
  '대전',
  '전북',
  '전남',
  '광주',
  '경북',
  '경남',
  '대구',
  '부산',
  '울산',
  '제주',
]);

export const createCustomerSchema = object({
  name: requiredString('name은 필수입니다.'),
  gender: GenderSchema,
  phoneNumber: requiredString('phoneNumber는 필수입니다.'),
  ageGroup: AgeGroupSchema,
  region: RegionSchema,
  email: emailString,
  memo: string(),
});

export const updateCustomerBodySchema = createCustomerSchema;

export const customerIdParamSchema = object({
  customerId: positiveInt,
});

export const listCustomersQuerySchema = refine(
  object({
    page: defaulted(positiveInt, 1),
    pageSize: defaulted(max(positiveInt, 100), 10),
    searchBy: optional(enums(['name', 'email'])),
    keyword: optional(size(nonEmptyTrimmedString, 1, Infinity)),
  }),
  'searchByWithKeyword',
  (value) =>
    (value.searchBy && value.keyword) ||
    (!value.searchBy && !value.keyword) ||
    'searchBy와 keyword는 함께 사용해야 합니다.'
);

export type CreateCustomerBody = Infer<typeof createCustomerSchema>;
export type UpdateCustomerBody = Infer<typeof updateCustomerBodySchema>;
export type ListCustomersQuery = Infer<typeof listCustomersQuerySchema>;
export type GenderValue = Infer<typeof GenderSchema>;
export type AgeGroupValue = Infer<typeof AgeGroupSchema>;
export type RegionValue = Infer<typeof RegionSchema>;
