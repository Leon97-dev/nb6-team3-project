import prisma from '../../configs/prisma.js';
import { CustomerRepository } from './customer-repository.js';
import type { Customer, Prisma, AgeGroup, Gender, Region } from '@prisma/client';
import {
  ConflictError,
  NotFoundError,
} from '../../errors/error-handler.js';
import type {
  CreateCustomerBody,
  UpdateCustomerBody,
  ListCustomersQuery,
  GenderValue,
  AgeGroupValue,
  RegionValue,
} from './customer-validator.js';

export type CustomerDTO = {
  id: number;
  name: string;
  gender: GenderValue;
  phoneNumber: string;
  ageGroup: AgeGroupValue | null;
  region: RegionValue | null;
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

type CustomerRecord = Customer;

const genderToDb: Record<GenderValue, Gender> = {
  male: 'MALE',
  female: 'FEMALE',
};

const genderFromDb: Record<Gender, GenderValue> = {
  MALE: 'male',
  FEMALE: 'female',
};

const ageGroupToDb: Record<AgeGroupValue, AgeGroup> = {
  '10대': 'TEEN_10',
  '20대': 'TWENTIES_20',
  '30대': 'THIRTIES_30',
  '40대': 'FORTIES_40',
  '50대': 'FIFTIES_50',
  '60대': 'SIXTIES_60',
  '70대': 'SEVENTIES_70',
  '80대': 'EIGHTIES_80',
};

const ageGroupFromDb: Record<AgeGroup, AgeGroupValue> = {
  TEEN_10: '10대',
  TWENTIES_20: '20대',
  THIRTIES_30: '30대',
  FORTIES_40: '40대',
  FIFTIES_50: '50대',
  SIXTIES_60: '60대',
  SEVENTIES_70: '70대',
  EIGHTIES_80: '80대',
};

const regionToDb: Record<RegionValue, Region> = {
  서울: 'SEOUL',
  경기: 'GYEONGGI',
  인천: 'INCHEON',
  강원: 'GANGWON',
  충북: 'CHUNGBUK',
  충남: 'CHUNGNAM',
  세종: 'SEJONG',
  대전: 'DAEJEON',
  전북: 'JEONBUK',
  전남: 'JEONNAM',
  광주: 'GWANGJU',
  경북: 'GYEONGBUK',
  경남: 'GYEONGNAM',
  대구: 'DAEGU',
  부산: 'BUSAN',
  울산: 'ULSAN',
  제주: 'JEJU',
};

const regionFromDb: Record<Region, RegionValue> = {
  SEOUL: '서울',
  GYEONGGI: '경기',
  INCHEON: '인천',
  GANGWON: '강원',
  CHUNGBUK: '충북',
  CHUNGNAM: '충남',
  SEJONG: '세종',
  DAEJEON: '대전',
  JEONBUK: '전북',
  JEONNAM: '전남',
  GWANGJU: '광주',
  GYEONGBUK: '경북',
  GYEONGNAM: '경남',
  DAEGU: '대구',
  BUSAN: '부산',
  ULSAN: '울산',
  JEJU: '제주',
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
      gender: genderFromDb[customer.gender],
      phoneNumber: customer.phoneNumber,
      ageGroup: customer.ageGroup ? ageGroupFromDb[customer.ageGroup] : null,
      region: customer.region ? regionFromDb[customer.region] : null,
      email: customer.email,
      memo: customer.memo,
      contractCount,
    };
  }

  private async ensureUnique(
    companyId: number,
    phoneNumber: string,
    email: string | null,
    excludeCustomerId?: number
  ) {
    const phoneOwner = await this.repo.findByPhoneNumber(
      companyId,
      phoneNumber,
      excludeCustomerId
    );
    if (phoneOwner) {
      throw new ConflictError('이미 존재하는 데이터입니다');
    }

    if (email) {
      const emailOwner = await this.repo.findByEmail(
        companyId,
        email,
        excludeCustomerId
      );
      if (emailOwner) {
        throw new ConflictError('이미 존재하는 데이터입니다');
      }
    }
  }

  private toCreateInput(
    body: CreateCustomerBody,
    companyId: number
  ): Prisma.CustomerCreateInput {
    return {
      name: body.name,
      gender: genderToDb[body.gender],
      phoneNumber: body.phoneNumber,
      ageGroup: ageGroupToDb[body.ageGroup],
      region: regionToDb[body.region],
      email: body.email,
      memo: body.memo,
      company: { connect: { id: companyId } },
    };
  }

  private toUpdateInput(body: UpdateCustomerBody): Prisma.CustomerUpdateInput {
    return {
      name: body.name,
      gender: genderToDb[body.gender],
      phoneNumber: body.phoneNumber,
      ageGroup: ageGroupToDb[body.ageGroup],
      region: regionToDb[body.region],
      email: body.email,
      memo: body.memo,
    };
  }

  async create(body: CreateCustomerBody, companyId: number): Promise<CustomerDTO> {
    await this.ensureUnique(companyId, body.phoneNumber, body.email);
    const created = await this.repo.create(this.toCreateInput(body, companyId));

    //등록 직후 contractCount는 0이지만 필드는 포함되어야 함
    return { ...(await this.toDTO(created)), contractCount: 0 };
  }

  async get(customerId: number, companyId: number): Promise<CustomerDTO> {
    const customer = await this.repo.findById(customerId, companyId);
    if (!customer) throw new NotFoundError('존재하지 않는 고객입니다');
    return this.toDTO(customer);
  }

  async update(
    customerId: number,
    body: UpdateCustomerBody,
    companyId: number
  ): Promise<CustomerDTO> {
    const exists = await this.repo.findById(customerId, companyId);
    if (!exists) throw new NotFoundError('존재하지 않는 고객입니다');

    if (body.phoneNumber !== exists.phoneNumber || body.email !== exists.email) {
      await this.ensureUnique(companyId, body.phoneNumber, body.email, customerId);
    }

    const updated = await this.repo.update(customerId, this.toUpdateInput(body));
    return this.toDTO(updated);
  }

  async delete(customerId: number, companyId: number): Promise<void> {
    const exists = await this.repo.findById(customerId, companyId);
    if (!exists) throw new NotFoundError('존재하지 않는 고객입니다');

    await this.repo.delete(customerId);
  }

  async list(
    query: ListCustomersQuery,
    companyId: number
  ): Promise<CustomerListResponse> {
    const { page, pageSize } = query;

    const { items, total } = await this.repo.list(query, companyId);

    const data = await Promise.all(items.map((c) => this.toDTO(c)));
    return {
      currentPage: page,
      totalPages: Math.ceil(total / pageSize),
      totalItemCount: total,
      data,
    };
  }

  async upload(rows: CreateCustomerBody[], companyId: number): Promise<void> {
    if (rows.length === 0) {
      return;
    }

    for (const row of rows) {
      await this.ensureUnique(companyId, row.phoneNumber, row.email);
    }

    const data: Prisma.CustomerCreateManyInput[] = rows.map((row) => ({
      name: row.name,
      gender: genderToDb[row.gender],
      phoneNumber: row.phoneNumber,
      ageGroup: ageGroupToDb[row.ageGroup],
      region: regionToDb[row.region],
      email: row.email,
      memo: row.memo,
      companyId,
    }));

    await this.repo.createMany(data);
  }
}
