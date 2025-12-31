import prisma from '../../configs/prisma.js';
import type { Customer, Prisma } from '@prisma/client';
import type { ListCustomersQuery } from './customer-validator.js';

export class CustomerRepository {
  async create(data: Prisma.CustomerCreateInput) {
    return prisma.customer.create({ data });
  }

  async createMany(data: Prisma.CustomerCreateManyInput[]) {
    return prisma.customer.createMany({ data });
  }

  async findById(customerId: number, companyId: number) {
    return prisma.customer.findFirst({
      where: { id: customerId, companyId },
    });
  }

  async findByPhoneNumber(
    companyId: number,
    phoneNumber: string,
    excludeCustomerId?: number
  ) {
    return prisma.customer.findFirst({
      where: {
        companyId,
        phoneNumber,
        ...(excludeCustomerId ? { id: { not: excludeCustomerId } } : {}),
      },
    });
  }

  async findByEmail(
    companyId: number,
    email: string,
    excludeCustomerId?: number
  ) {
    return prisma.customer.findFirst({
      where: {
        companyId,
        email,
        ...(excludeCustomerId ? { id: { not: excludeCustomerId } } : {}),
      },
    });
  }

  async update(customerId: number, data: Prisma.CustomerUpdateInput) {
    return prisma.customer.update({
      where: { id: customerId },
      data,
    });
  }

  async delete(customerId: number) {
    return prisma.customer.delete({
      where: { id: customerId },
    });
  }

  async list(
    query: ListCustomersQuery,
    companyId: number
  ): Promise<{ items: Customer[]; total: number }> {
    const { page, pageSize, searchBy, keyword } = query;
    const skip = (page - 1) * pageSize;

    const where: Prisma.CustomerWhereInput = {
      companyId,
      ...(searchBy && keyword
        ? {
            [searchBy]: {
              contains: keyword,
              mode: 'insensitive',
            },
          }
        : {}),
    };

    const findArgs: Prisma.CustomerFindManyArgs = {
      skip,
      take: pageSize,
      orderBy: { id: 'desc' },
      where,
    };
    const countArgs: Prisma.CustomerCountArgs = {
      where,
    };

    const [items, total] = await prisma.$transaction([
      prisma.customer.findMany(findArgs),
      prisma.customer.count(countArgs),
    ]);

    return { items, total };
  }
}
