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