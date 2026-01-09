import type { Prisma } from '@prisma/client';
import prisma from '../../configs/prisma.js';

class CustomersRepository {
  createCustomer(data: Prisma.CustomerCreateInput) {
    return prisma.customer.create({ data });
  }
  
  findCustomerByPhone(companyId: number, phoneNumber: string) {
    return prisma.customer.findFirst({
      where: { companyId, phoneNumber },
    });
  }

  getCustomerList(
    where: Prisma.CustomerWhereInput,
    skip: number,
    take: number
  ) {
    return prisma.customer.findMany({
      where,
      skip,
      take,
      orderBy: { id: 'desc' },
      include: { contracts: true },
    });
  }

  countCustomers(where: Prisma.CustomerWhereInput) {
    return prisma.customer.count({ where });
  }

  findCustomerById(companyId: number, customerId: number) {
    return prisma.customer.findFirst({
      where: { id: customerId, companyId },
      include: { contracts: true },
    });
  }

  updateCustomer(customerId: number, data: Prisma.CustomerUpdateInput) {
    return prisma.customer.update({
      where: { id: customerId },
      data,
    });
  }

  deleteCustomer(customerId: number) {
    return prisma.customer.delete({
      where: { id: customerId },
    });
  }

  countContracts(customerId: number) {
    return prisma.contract.count({
      where: { customerId },
    });
  }

  bulkCreateCustomers(dataArray: Prisma.CustomerCreateManyInput[]) {
    return prisma.$transaction(
      dataArray.map((data) =>
        prisma.customer.create({
          data,
        })
      )
    );
  }
}

export const customersRepository = new CustomersRepository();
