import Prisma from '@prisma/client';
import { DashboardDTO } from './dashboard-DTO.js';

const prisma = new Prisma.PrismaClient();

export class DashBoardService {
  async getDashboardData(): Promise<DashboardDTO> {
    return {
      contracts: await prisma.contract.groupBy({
        by: ['status'],
        _count: true,
      }),
    };
  }
}