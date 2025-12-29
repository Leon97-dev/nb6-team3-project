/**
 * @description 대시보드 서비스 모듈
 * 대시보드 관련 비즈니스 로직을 처리하는 기능을 제공합니다.
 * @author 정현준
 * @date 2025-12-29
 * @version 1.0
 **/

import Prisma from '@prisma/client';
import { DashboardDTO } from './dashboard-DTO.js';

const prisma = new Prisma.PrismaClient();

export const getDashboard = async () : Promise<DashboardDTO[]> => {
  const [
    summary,
    contractsByVehicleType,
    revenueByVehicleType,
  ] = await Promise.all([
    prisma.$queryRaw<DashboardDTO[]>`
      SELECT
        COUNT(*) AS totalContracts,
        SUM(amount) AS totalRevenue,
        AVG(amount) AS averageContractValue
      FROM
        contracts
      WHERE
        status = 'active';
    `,
    prisma.$queryRaw<DashboardDTO[]>`
      SELECT
        vehicle_type,
        COUNT(*) AS contractCount
      FROM
        contracts
      WHERE
        status = 'active'
      GROUP BY
        vehicle_type;
    `,
    prisma.$queryRaw<DashboardDTO[]>`
      SELECT
        vehicle_type,
        SUM(amount) AS totalRevenue
      FROM
        contracts
      WHERE
        status = 'active'
      GROUP BY
        vehicle_type;
    `,
  ]);

  return [
    ...summary,
    ...contractsByVehicleType,
    ...revenueByVehicleType,
  ];
} ;