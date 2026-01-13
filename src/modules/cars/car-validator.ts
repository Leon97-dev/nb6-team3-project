import {
  object,
  string,
  number,
  optional,
  type Infer,
  literal,
  union,
} from 'superstruct';

const StatusStruct = union([
  literal('possession'),
  literal('contractProceeding'),
  literal('contractCompleted'),
]);

export const CarCreateSchema = object({
  carNumber: string(),
  manufacturer: string(),
  model: string(),
  manufacturingYear: number(),
  mileage: number(),
  price: number(),
  accidentCount: optional(number()),
  explanation: optional(string()),
  accidentDetails: optional(string()),
});

export type CarCreateDto = Infer<typeof CarCreateSchema>;

export const CarUpdateSchema = object({
  carNumber: optional(string()),
  manufacturer: optional(string()),
  model: optional(string()),
  manufacturingYear: optional(number()),
  mileage: optional(number()),
  price: optional(number()),
  accidentCount: optional(number()),
  explanation: optional(string()),
  accidentDetails: optional(string()),
  status: optional(StatusStruct),
});
export type CarUpdateDto = Infer<typeof CarUpdateSchema>;
