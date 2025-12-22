import Prisma from '@prisma/client';
import { DashboardDTO } from './dashboard-DTO.js';

const prisma = new Prisma.PrismaClient();

export const getDashboard = async () : Promise<DashboardDTO[]> => {
  const [
    summary,
    contractsByVehicleType,
    revenueByVehicleType,
  ] = await Promise.all([
    getSummary(),
    getContractsByVehicleType(),
    getRevenueByVehicleType(),
  ]);

  return {
    summary,
    contractsByVehicleType,
    revenueByVehicleType,
  };
};

