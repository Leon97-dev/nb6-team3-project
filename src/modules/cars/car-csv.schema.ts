// 대용량 업로드을 위한 CSV 스키마 정의
import { z } from 'zod';

export const CarCsvSchema = z.object({
  carNumber: z.string().min(1),
  manufacturer: z.string().min(1),
  model: z.string().min(1),
  type: z.enum(['SEDAN', 'SUV', 'TRUCK']),
  manufacturingYear: z.coerce.number().int(),
  mileage: z.coerce.number(),
  price: z.coerce.number(),
  accidentCount: z.coerce.number(),
  explanation: z.string().optional(),
  accidentDetails: z.string().optional(),
});

export type CarCsvDto = z.infer<typeof CarCsvSchema>;
