/**
 * @description 대시보드 서비스 모듈
 * 대시보드 관련 비즈니스 로직을 처리하는 기능을 제공합니다.
 * @author 정현준
 * @date 2026-01-02
 * @version 1.0
 **/

import { CarType, ContractStatus, type Contract } from '@prisma/client';
import prisma from '../../configs/prisma.js';
import { ValidationError } from '../../errors/error-handler.js';

type ContractWithCar = Pick<Contract, 'status' | 'contractPrice'> & {
  car: { carModel: { type: CarType } };
};

export const dashboardService = {
  async getDashboardStats(companyId: number) {
    if (!companyId) {
      throw new ValidationError('잘못된 요청입니다');
    }
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const successfulStatus = ContractStatus.CONTRACT_SUCCESSFUL;

    const monthlySalesData = await prisma.contract.aggregate({
      where: {
        companyId,
        status: successfulStatus,
        resolutionDate: { gte: monthStart },
      },
      _sum: { contractPrice: true },
    });

    const lastMonthSalesData = await prisma.contract.aggregate({
      where: {
        companyId,
        status: successfulStatus,
        resolutionDate: { gte: lastMonthStart, lte: lastMonthEnd },
      },
      _sum: { contractPrice: true },
    });

    const monthlySales = monthlySalesData._sum.contractPrice || 0;
    const lastMonthSales = lastMonthSalesData._sum.contractPrice || 0;

    const growthRate =
      lastMonthSales === 0
        ? 100
        : ((monthlySales - lastMonthSales) / lastMonthSales) * 100;

    const proceedingContractsCount = await prisma.contract.count({
      where: {
        companyId,
        status: {
          in: [
            ContractStatus.CAR_INSPECTION, // 차량 점검
            ContractStatus.PRICE_NEGOTIATION, // 가격 협상
            ContractStatus.CONTRACT_DRAFT, // 계약서 초안
          ],
        },
      },
    });

    const completedContractsCount = await prisma.contract.count({
      where: {
        companyId,
        status: successfulStatus,
      },
    });

    const contracts = (await prisma.contract.findMany({
      where: { companyId },
      select: {
        status: true,
        contractPrice: true,
        car: { select: { carModel: { select: { type: true } } } },
      },
    })) as ContractWithCar[];

    const contractTypeCounts: Record<string, number> = {};
    const salesByType: Record<string, number> = {};

    contracts.forEach((contract) => {
      const typeLabel = contract.car.carModel.type;
      contractTypeCounts[typeLabel] = (contractTypeCounts[typeLabel] || 0) + 1;

      if (contract.status === successfulStatus) {
        salesByType[typeLabel] =
          (salesByType[typeLabel] || 0) + contract.contractPrice || 0;
      }
    });

    const uniqueTypes = new Set([
      ...Object.keys(contractTypeCounts),
      ...Object.keys(salesByType),
    ]);

    const contractsByCarType = Array.from(uniqueTypes).map((type) => ({
      carType: type,
      count: contractTypeCounts[type] || 0,
    }));

    const salesByCarType = Array.from(uniqueTypes).map((type) => ({
      carType: type,
      count: salesByType[type] || 0,
    }));

    return {
      monthlySales,
      lastMonthSales,
      growthRate,
      proceedingContractsCount,
      completedContractsCount,
      contractsByCarType,
      salesByCarType,
    };
  },
};
