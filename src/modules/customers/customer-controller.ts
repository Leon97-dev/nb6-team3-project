import type { Request } from 'express';
import { parse } from 'csv-parse/sync';
import { validate, type Struct } from 'superstruct';
import asyncHandler from '../../errors/async-handler.js';
import {
  UnauthorizedError,
  ValidationError,
} from '../../errors/error-handler.js';
import { CustomerService } from './customer-service.js';
import {
  createCustomerSchema,
  customerIdParamSchema,
  listCustomersQuerySchema,
  updateCustomerBodySchema,
  type CreateCustomerBody,
} from './customer-validator.js';

const parseStruct = <T, S>(schema: Struct<T, S>, value: unknown): T => {
  const [error, result] = validate(value, schema);
  if (error) {
    throw new ValidationError(null, '잘못된 요청입니다');
  }
  return result;
};

const requireUser = (req: Request) => {
  const user = req.user;
  if (!user) {
    throw new UnauthorizedError(null, '로그인이 필요합니다');
  }
  return user;
};

export class CustomerController {
  constructor(private service = new CustomerService()) {}

  create = asyncHandler(async (req, res) => {
    const user = requireUser(req);
    const body = parseStruct(createCustomerSchema, req.body);
    const data = await this.service.create(body, user.companyId);
    res.status(201).json(data);
  });

  list = asyncHandler(async (req, res) => {
    const user = requireUser(req);
    const query = parseStruct(listCustomersQuerySchema, req.query);
    const data = await this.service.list(query, user.companyId);
    res.status(200).json(data);
  });

  get = asyncHandler(async (req, res) => {
    const user = requireUser(req);
    const { customerId } = parseStruct(customerIdParamSchema, req.params);
    const data = await this.service.get(customerId, user.companyId);
    res.status(200).json(data);
  });

  update = asyncHandler(async (req, res) => {
    const user = requireUser(req);
    const { customerId } = parseStruct(customerIdParamSchema, req.params);
    const body = parseStruct(updateCustomerBodySchema, req.body);
    const data = await this.service.update(customerId, body, user.companyId);
    res.status(200).json(data);
  });

  delete = asyncHandler(async (req, res) => {
    const user = requireUser(req);
    const { customerId } = parseStruct(customerIdParamSchema, req.params);
    await this.service.delete(customerId, user.companyId);
    res.status(200).json({ message: '고객 삭제 성공' });
  });

  upload = asyncHandler(async (req, res) => {
    const user = requireUser(req);
    const file = (req as Request & { file?: Express.Multer.File }).file;
    if (!file) {
      throw new ValidationError(null, '잘못된 요청입니다');
    }

    const records = parse(file.buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Record<string, string>[];

    if (records.length === 0) {
      throw new ValidationError(null, '잘못된 요청입니다');
    }

    const rows: CreateCustomerBody[] = records.map((record) =>
      parseStruct(createCustomerSchema, record)
    );

    await this.service.upload(rows, user.companyId);
    res.status(200).json({ message: '성공적으로 등록되었습니다' });
  });
}

const customerController = new CustomerController();
export default customerController;
