import { Request, Response } from 'express';
import { DashboardService } from './dashboard-service';
import { DashboardDTO } from './dashboard-DTO.js';

let dashboardService = new DashboardService();

export class DashboardController {
    async getDashboardData(req: Request, res: Response): Promise<void> {
        try {
            const dashboardData: DashboardDTO = await dashboardService.fetchDashboardData();
            res.status(200).json(dashboardData);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching dashboard data', error });
        }
    }
}  