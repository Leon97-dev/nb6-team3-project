/**
 * @description 대시보드 서비스 모듈
 * 대시보드 관련 비즈니스 로직을 처리하는 기능을 제공합니다.
 * @author 정현준
 * @date 2025-12-29
 * @version 1.0
 **/
 
import prisma from '@/config/prisma.js';
 
interface DashboardCreateDTO {
  title: string;
  content: string;
  userId: number;
}

interface DashboardUpdateDTO {
  title?: string;
  content?: string;
}

export const dashboardService = {
  async createService(data: DashboardCreateDTO) {
    return prisma.dashboard.create({ data });
  },

  async getService(id: number) {
    const dashboard = await prisma.dashboard.findUnique({ where: { id } });
    if (!dashboard) {
      throw new Error(`Dashboard with ID ${id} not found`);
    }
    return dashboard;
  },

  async updateService(id: number, data: DashboardUpdateDTO) {
    return prisma.dashboard.update({ where: { id }, data });
  },

  async deleteService(id: number) {
    return prisma.dashboard.delete({ where: { id } });
  },
};

export default dashboardService;

