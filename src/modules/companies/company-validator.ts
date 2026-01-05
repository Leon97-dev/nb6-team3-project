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

const coercedNumber = coerce(number(), union([string(), number()]), (value) => {
  const parsed = typeof value === 'string' ? Number(value) : value;
  return Number.isNaN(parsed) ? value : parsed;
});

const intNumber = refine(coercedNumber, 'int', (value) =>
  Number.isInteger(value)
);

const positiveInt = refine(intNumber, 'positive', (value) => value > 0);

export const createCompanySchema = object({
  companyName: requiredString('companyName은 필수입니다.'),
  companyCode: requiredString('companyCode는 필수입니다.'),
});

export const updateCompanyBodySchema = createCompanySchema;

export const companyIdParamSchema = object({
  companyId: positiveInt,
});

export const listCompaniesQuerySchema = refine(
  object({
    page: defaulted(positiveInt, 1),
    pageSize: defaulted(max(positiveInt, 100), 10),
    searchBy: optional(enums(['companyName'])),
    keyword: optional(size(nonEmptyTrimmedString, 1, Infinity)),
  }),
  'searchByWithKeyword',
  (value) =>
    (value.searchBy && value.keyword) ||
    (!value.searchBy && !value.keyword) ||
    'searchBy와 keyword는 함께 사용해야 합니다.'
);

export type CreateCompanyBody = Infer<typeof createCompanySchema>;
export type UpdateCompanyBody = Infer<typeof updateCompanyBodySchema>;
export type ListCompaniesQuery = Infer<typeof listCompaniesQuerySchema>;
