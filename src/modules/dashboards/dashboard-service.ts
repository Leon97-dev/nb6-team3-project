/**
 * @description 대시보드 서비스 모듈
 * 대시보드 관련 비즈니스 로직을 처리하는 기능을 제공합니다.
 * @author 정현준
 * @date 2026-01-09
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
    ] = await Promise.all([
      // 1-1. 이번 달 매출
      prisma.contract.aggregate({
        where: {
          companyId,
          status: successfulStatus,
          resolutionDate: { gte: monthStart },
        },
        _sum: { contractPrice: true },
      }),
      // aggregate(): 특정 필드의 합계,평균,개수 등을 계산하는 집계 함수를 호출
      // where:{...} -> 집계할 데이터의 조건을 지정하는 부분
      // status: 계약 상태, 계약 완료일이 이번 달 시작일보다 크거나 같은 계약 데이터만 필터링. 즉, 이번 달
      // 완료된 계약 대상으로 함.
      // _sum: Where 조건으로 필터링된 모든 레코드에 대해 수행할 집계 연산 정의

      // 1-2. 지난 달 매출
      prisma.contract.aggregate({
        where: {
          companyId,
          status: successfulStatus,
          resolutionDate: { gte: lastMonthStart, lte: lastMonthEnd },
        },
        _sum: { contractPrice: true },
      }),
      // aggregate(): 특정 필드의 합계,평균,개수 등을 계산하는 집계 함수를 호출
      // where:{...} -> 집계할 데이터의 조건을 지정하는 부분
      // status: 계약 상태, 계약 완료일이 지난달 시작일보다 크거나 같고 지난 달
      // 종료일보다 작거나 같은 계약 데이터만 필터링. 즉, 지난 한 달 동안 완료된 계약 대상으로 함.
      // _sum: Where 조건으로 필터링된 모든 레코드에 대해 수행할 집계 연산 정의

      // 1-3. 진행 중인 계약
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

      // 1-4. 완료된 총 계약
      prisma.contract.count({
        where: { companyId, status: successfulStatus },
      }),

      // 1-5. 차종별 집계 (DB에서 직접 계산)
      prisma.contract.groupBy({
        by: ['carId'], // 실제 관계 구조에 따라 car.carModel.type으로 접근하려면 Join/Include 확인 필요
        where: { companyId },
        _count: { _all: true },
        _sum: { contractPrice: true },
      }),
    ]);

    // 주의: Prisma groupBy는 중첩 관계(Relation) 그룹화를 직접 지원하지 않을 수 있어
    // 구조에 따라 raw query나 별도 처리가 필요할 수 있습니다.

    const monthlySales = monthlySalesData._sum.contractPrice || 0;
    const lastMonthSales = lastMonthSalesData._sum.contractPrice || 0;

    // 2. 성장률 계산
    let growthRate = 0;

    if (lastMonthSales > 0) {
      // 2-1. 기본 성장률 계산
      const rate = ((monthlySales - lastMonthSales) / lastMonthSales) * 100;

      // 2-2. 소수점 둘째 자리 반올림
      growthRate = Number(rate.toFixed(2));
    } else if (monthlySales > 0) {
      // 2-3. 지난 달 매출 0원 -> 이번 달 매출 발생 시
      // 상황에 따라 100% 표기 적절한지 기획 확인 필요
      growthRate = 100;
    } else if (lastMonthSales === 0 && monthlySales === 0) {
      // 2-4. 둘 다 0원인 경우
      growthRate = 0;
    } else {
      // 2-5. 예외 (지난 달이 음수였거나 특이 케이스)
      // 대시보드 성격에 따라 0으로 처리하거나 별도 로직 적용
      growthRate = 0;
    }

    // 3. 집계 데이터 가공 로직
    return {
      monthlySales,
      lastMonthSales,
      growthRate,
      proceedingContractsCount,
      completedContractsCount,
    };
  },
};
