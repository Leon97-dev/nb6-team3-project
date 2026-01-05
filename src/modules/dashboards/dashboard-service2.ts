import { CarType, ContractStatus, type Contract } from '@prisma/client';
import prisma from '../../configs/prisma.js';
import { ValidationError } from '../../errors/error-handler.js';

type ContractWithCar = Pick<Contract, 'status' | 'contractPrice'> & {
  car: { carModel: { type: CarType } };
};

export const dashboardService = {
  async getDashboardStats(companyId: number) {
    if (!companyId) throw new ValidationError('잘못된 요청입니다');

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
    const successfulStatus = ContractStatus.CONTRACT_SUCCESSFUL;

    // 1. 모든 독립적인 쿼리를 병렬로 실행수
    const [
      monthlySalesData,
      lastMonthSalesData,
      proceedingContractsCount,
      completedContractsCount,
      statsByType,
    ] = await Promise.all([
      // 이번 달 매출
      prisma.contract.aggregate({
        where: {
          companyId,
          status: successfulStatus,
          resolutionDate: { gte: monthStart },
        },
        _sum: { contractPrice: true },
      }),
      // 지난달 매출
      prisma.contract.aggregate({
        where: {
          companyId,
          status: successfulStatus,
          resolutionDate: { gte: lastMonthStart, lte: lastMonthEnd },
        },
        _sum: { contractPrice: true },
      }),
      // 진행 중인 계약
      prisma.contract.count({
        where: {
          companyId,
          status: {
            in: [
              ContractStatus.CAR_INSPECTION,
              ContractStatus.PRICE_NEGOTIATION,
              ContractStatus.CONTRACT_DRAFT,
            ],
          },
        },
      }),
      // 완료된 총 계약
      prisma.contract.count({
        where: { companyId, status: successfulStatus },
      }),
      // 차종별 집계 (DB에서 직접 계산)
      prisma.contract.groupBy({
        by: ['carId'], // 실제 관계 구조에 따라 car.carModel.type으로 접근하려면 Join/Include 확인 필요
        where: { companyId },
        _count: { _all: true },
        _sum: { contractPrice: true },
        // 주의: Prisma groupBy는 중첩 관계(Relation) 그룹화를 직접 지원하지 않을 수 있어
        // 구조에 따라 raw query나 별도 처리가 필요할 수 있습니다.
      }),
    ]);

    const monthlySales = monthlySalesData._sum.contractPrice || 0;
    const lastMonthSales = lastMonthSalesData._sum.contractPrice || 0;

    // 성장률 계산 개선
    let growthRate = 0;
    if (lastMonthSales > 0) {
      growthRate = ((monthlySales - lastMonthSales) / lastMonthSales) * 100;
    } else if (monthlySales > 0) {
      growthRate = 100;
    }

    return {
      monthlySales,
      lastMonthSales,
      growthRate,
      proceedingContractsCount,
      completedContractsCount,
      // ... 집계 데이터 가공 로직
    };
  },
};
