import { z } from 'zod';

export const CarCsvSchema = z.object({
  manufacturer: z.string().min(1),
  model: z.string().min(1),
  carNumber: z.string().min(1),
  manufacturingYear: z.coerce.number(),
  mileage: z.coerce.number(),
  price: z.coerce.number(),
  accidentCount: z.coerce.number().optional(),
  explanation: z.string().optional(),
  accidentDetails: z.string().optional(),
});

export type CarCsvRow = z.infer<typeof CarCsvSchema>;
