import {
  coerce,
  object,
  optional,
  partial,
  refine,
  size,
  string,
  number,
  union,
  pattern,
} from 'superstruct';

const PositiveInt = refine(
  coerce(number(), union([string(), number()]), (value) => Number(value)),
  'PositiveInt',
  (value) => Number.isInteger(value) && value > 0
);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^010-\d{4}-\d{4}$/;

export const SignUpSchema = object({
  name: size(string(), 1, 100),
  email: pattern(string(), emailPattern),
  employeeNumber: size(string(), 1, 100),
  phoneNumber: pattern(string(), phonePattern),
  password: size(string(), 1, 200),
  passwordConfirmation: size(string(), 1, 200),
  companyName: size(string(), 1, 100),
  companyCode: size(string(), 1, 100),
});

export const CheckPasswordSchema = object({
  password: size(string(), 1, 200),
});

export const UpdateMeSchema = partial(
  object({
    employeeNumber: size(string(), 1, 100),
    phoneNumber: pattern(string(), phonePattern),
    currentPassword: size(string(), 1, 200),
    password: size(string(), 1, 200),
    passwordConfirmation: size(string(), 1, 200),
    imageUrl: optional(string()),
  })
);

export const UserIdParamSchema = object({
  userId: PositiveInt,
});
