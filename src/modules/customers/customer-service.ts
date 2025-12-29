import { prisma } from '../../configs/prisma.js';
import { CustomerRepository } from './customer-repository.js';
import type {
  CreateCustomerBody,
  UpdateCustomerBody,
  ListCustomersQuery,
} from './customer-validator.ts';

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

export type CustomerDTO = {
  id: number;
  name: string;
  gender: 'male' | 'female';
  phoneNumber: string;
  ageGroup: string | null;
  region: string | null;
  email: string | null;
  memo: string | null;
  contractCount: number;
};

export type CustomerListResponse = {
  currentPage: number;
  totalPages: number;
  totalItemCount: number;
  data: CustomerDTO[];
};

type CustomerRecord = {
  id: number;
  name: string;
  gender: 'male' | 'female';
  phoneNumber: string;
  ageGroup: string | null;
  region: string | null;
  email: string | null;
  memo: string | null;
};

export class CustomerService {
  constructor(private repo = new CustomerRepository()) {}

  // prisma schema에서 Contract 모델명/필드명이 다른 경우 여기만 수정하면 됨

  private async getContractCount(customerId: number): Promise<number> {
    return prisma.contract.count({ where: { customerId } });
  }

  private async toDTO(customer: CustomerRecord): Promise<CustomerDTO> {
    const contractCount = await this.getContractCount(customer.id);
    return {
      id: customer.id,
      name: customer.name,
      gender: customer.gender,
      phoneNumber: customer.phoneNumber,
      ageGroup: customer.ageGroup,
      region: customer.region,
      email: customer.email,
      memo: customer.memo,
      contractCount,
    };
  }

  async create(body: CreateCustomerBody): Promise<CustomerDTO> {
    const created = await this.repo.create(body as any);

    //등록 직후 contractCount는 0이지만 필드는 포함되어야 함
    return { ...(await this.toDTO(created)), contractCount: 0 };
  }

  async get(customerId: number): Promise<CustomerDTO> {
    const customer = await this.repo.findById(customerId);
    if (!customer) throw new HttpError(404, '존재하지 않는 고객입니다.');
    return this.toDTO(customer);
  }

  async update(
    customerId: number,
    body: UpdateCustomerBody
  ): Promise<CustomerDTO> {
    const exists = await this.repo.findById(customerId);
    if (!exists) throw new HttpError(404, '존재하지 않는 고객입니다.');

    const updated = await this.repo.update(customerId, body as any);
    return this.toDTO(updated);
  }

  async delete(customerId: number): Promise<void> {
    const exists = await this.repo.findById(customerId);
    if (!exists) throw new HttpError(404, '존재하지 않는 고객입니다.');

    await this.repo.delete(customerId);
  }

  async list(query: ListCustomersQuery): Promise<CustomerListResponse> {
    const { page, pageSize } = query;

    const { items, total } = (await this.repo.list(query)) as {
      items: CustomerRecord[];
      total: number;
    };

    const data = await Promise.all(items.map((c) => this.toDTO(c)));
    return {
      currentPage: page,
      totalPages: Math.ceil(total / pageSize),
      totalItemCount: total,
      data,
    };
  }
}
