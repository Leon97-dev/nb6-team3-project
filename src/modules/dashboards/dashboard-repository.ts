/**
 * @description 대시보드 리포지토리 모듈
 * 대시보드 관련 데이터베이스 쿼리를 처리하는 기능을 제공합니다.
 * @author 정현준
 * @date 2026-01-02
 * @version 1.0
 **/

import Prisma from '@prisma/client';

const prisma = new Prisma.PrismaClient();

type getSummary = {
  total_contracts: bigint;
  total_revenue: number | null;
  average_revenue_per_contract: number | null;
};

export const getSummary = async () => {

  return prisma.$queryRaw`
    SELECT 
      COUNT(*) AS total_contracts,
      SUM(amount) AS total_revenue,
      AVG(amount) AS average_revenue_per_contract
    FROM contracts;
  `;
}               

type VehicleTypeStats = {
  vehicleType: string;
  contract_count: bigint;
  total_revenue: number | null;
};

export const VehicleTypeStats = async () => {
  return prisma.$queryRaw`
    SELECT 
      vehicleType,
      COUNT(*) AS contract_count,
      SUM(amount) AS total_revenue
    FROM contracts
    GROUP BY vehicleType;
  `;
}
