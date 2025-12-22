import { Request, Response } from 'express';
import { DashboardService } from './dashboard-service';
import { DashboardDTO } from './dashboard-DTO.js';

export const getDashboard = async (
    req: Request,
    res: Response
 ) => {
    const dashboard: DashboardDTO =
      await dashboardService.getDashboard();
    
      return res.json(dashboard);
};