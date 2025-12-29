import prisma from '../../configs/prisma.js';
import type { Customer, Prisma } from '@prisma/client';
import type { ListCustomersQuery } from './customer-validator.js';

export class CustomerRepository {
  async create(data: Omit<Customer, 'id'>) {
    return prisma.customer.create({
      data: data as any,
    });
  }

  async findById(customerId: number) {
    return prisma.customer.findUnique({
      where: { id: customerId },
    });
  }

  async update(customerId: number, data: Partial<Omit<Customer, 'id'>>) {
    return prisma.customer.update({
      where: { id: customerId },
      data: data as any,
    });
  }

  async delete(customerId: number) {
    return prisma.customer.delete({
      where: { id: customerId },
    });
  }

  async list(
    query: ListCustomersQuery
  ): Promise<{ items: Customer[]; total: number }> {
    const { page, pageSize, searchBy, keyword } = query;
    const skip = (page - 1) * pageSize;

    const where: Prisma.CustomerWhereInput | undefined =
      searchBy && keyword
        ? {
            [searchBy]: {
              contains: keyword,
              mode: 'insensitive',
            },
          }
        : undefined;

    const findArgs: Prisma.CustomerFindManyArgs = {
      skip,
      take: pageSize,
      orderBy: { id: 'desc' },
      ...(where ? { where } : {}),
    };
    const countArgs: Prisma.CustomerCountArgs = {
      ...(where ? { where } : {}),
    };

    const [items, total] = await prisma.$transaction([
      prisma.customer.findMany(findArgs),
      prisma.customer.count(countArgs),
    ]);

    return { items, total };
  }
}
