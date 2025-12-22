import Prisma from '@prisma/client';

const prisma = new Prisma.PrismaClient();

export const getSummary = async () => {
  return prisma.$queryRaw`
    SELECT 
      COUNT(*) AS total_contracts,
      SUM(amount) AS total_revenue,
      AVG(amount) AS average_revenue_per_contract
    FROM contracts;
  `;
}               

export const getContractsByVehicleType = async () => {
  return prisma.$queryRaw`
    SELECT 
      vehicleType,
      COUNT(*) AS contract_count,
      SUM(amount) AS total_revenue
    FROM contracts
    GROUP BY vehicleType;
  `;
}

export const getRevenueByVehicleType = async () => {
  return prisma.$queryRaw`
    SELECT 
      vehicleType,
      SUM(amount) AS total_revenue
    FROM contracts
    GROUP BY vehicleType;
  `;
}