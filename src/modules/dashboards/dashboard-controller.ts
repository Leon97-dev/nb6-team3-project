import { Request, Response } from 'express';
import { DashboardService } from './dashboard-service';
import { DashboardDTO } from './dashboard-DTO.js';

export const getDashboardData = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const dashboardData = await DashboardService.fetchDashboardData(userId);
        const dashboardDTO = new DashboardDTO(dashboardData);
        res.status(200).json(dashboardDTO);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard data', error });
    }
};      

export const updateDashboardSettings = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const settings = req.body;
        const updatedSettings = await DashboardService.updateDashboardSettings(userId, settings);
        res.status(200).json(updatedSettings);
    } catch (error) {
        res.status(500).json({ message: 'Error updating dashboard settings', error });
    }
};

export const resetDashboard = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        await DashboardService.resetDashboard(userId);
        res.status(200).json({ message: 'Dashboard reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting dashboard', error });
    }
};
