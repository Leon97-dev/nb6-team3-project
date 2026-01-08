/**
 * @description 대시보드 서비스 모듈 정리본
 * 대시보드 관련 비즈니스 로직을 처리하는 기능을 제공합니다.
 * @author 정현준
 * @date 2026-01-08
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

    // 1. 이번 달 매출과 전체 계약 건수
    const monthlySalesData = await prisma.contract.aggregate({
      where: {
        companyId,
        status: successfulStatus,
        resolutionDate: { gte: monthStart },
      },
      _sum: { contractPrice: true },
    });

    // 2. 지난 달 매출 및 계약 건수
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

    // 성장률 계산 개선
    const growthRate =
      lastMonthSales === 0
        ? 100
        : ((monthlySales - lastMonthSales) / lastMonthSales) * 100;

    // 3. 진행 중인 계약
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

    // 4. 완료된 총 계약
    const completedContractsCount = await prisma.contract.count({
      where: {
        companyId,
        status: successfulStatus,
      },
    });

    // 5. 차종별 집계 데이터 조회
    const contracts = (await prisma.contract.findMany({
      where: { companyId },
      select: {
        ContractStatus: true,
        ContractPrice: true,
        car: {
          select: {
            carModel: {
              select: { type: true },
            },
          },
        },
      },
    })) as ContractWithCar[];

    // 5-1) 차종별 계약 건수 및 매출액 집계 (Aggregation)
    const contractTypeCounts: Record<string, number> = {};
    const salesByType: Record<string, number> = {};

    contracts.forEach((Contract) => {
      // 차종(Label) 추출 (데이터가 없을 경우 'Unknown' 처리)
      const typeLabel = Contract.car?.carModel?.type ?? 'Unknown';

      // 1. 차종별 계약 건수 누적
      contractTypeCounts[typeLabel] = (contractTypeCounts[typeLabel] || 0) + 1;

      // 2. 차종별 매출액 누적 (성공한 계약만)
      if (Contract.status === successfulStatus) {
        salesByType[typeLabel] =
          (salesByType[typeLabel] || 0) + (Contract.contractPrice || 0);
      }
    });

    // 6. 차트/프론트엔드용 데이터 포맷팅 (Data Formatting)
    // 모든 키(Key) 수집 (건수는 있지만 매출은 0인 경우 등을 모두 포함하기 위함)
    const uniqueTypes = new Set([
      ...Object.keys(contractTypeCounts),
      ...Object.keys(salesByType),
    ]);

    // 배열 형태로 변환: 계약 건수
    const contractsByCarType = Array.from(uniqueTypes).map((type) => ({
      carType: type,
      count: contractTypeCounts[type] || 0,
    }));

    // 배열 형태로 변환: 매출액
    const salesByCarType = Array.from(uniqueTypes).map((type) => ({
      carType: type,
      price: salesByType[type] || 0,
    }));
    // map: 배열의 각 요소 순회, 각 요소를 새로운 형태의 객체로 변환하여 새로운 배열을 생성
    // 7. 최종 대시보드 데이터 반환
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
