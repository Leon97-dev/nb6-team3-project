import { z } from 'zod';

export const GenderSchema = z.enum(['male', 'female']);

export const AgeGroupSchema = z.enum([
  '10대',
  '20대',
  '30대',
  '40대',
  '50대',
  '60대',
  '70대',
  '80대',
]);

export const RegionSchema = z.enum([
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

export const createCustomerSchema = z.object({
  name: z.string().min(1, 'name은 필수입니다.'),
  gender: GenderSchema,
  phoneNumber: z.string().min(1, 'phoneNumber는 필수입니다.'),
  ageGroup: AgeGroupSchema.optional(),
  region: RegionSchema.optional(),
  email: z.string().email('email 형식이 올바르지 않습니다.').optional(),
  memo: z.string().optional(),
});

export const updateCustomerBodySchema = createCustomerSchema;

export const customerIdParamSchema = z.object({
  customerId: z.coerce.number().int().positive(),
});

export const listCustomersQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().positive().max(100).default(10),
    searchBy: z.enum(['name', 'email']).optional(),
    keyword: z.string().trim().min(1).optional(),
  })
  .refine((v) => (v.searchBy && v.keyword) || (!v.searchBy && !v.keyword), {
    message: 'searchBy와 keyword는 함께 사용해야 합니다.',
  });

export type CreateCustomerBody = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerBody = z.infer<typeof updateCustomerBodySchema>;
export type ListCustomersQuery = z.infer<typeof listCustomersQuerySchema>;
