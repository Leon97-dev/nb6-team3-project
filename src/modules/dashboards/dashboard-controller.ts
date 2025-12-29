/**
 * @description 대시보드 컨트롤러 모듈
 * 대시보드 관련 요청을 처리하는 기능을 제공합니다.
 * @author 정현준
 * @date 2025-12-29
 * @version 1.0
 **/

import { Request, Response } from 'express';
import { DashboardService } from './dashboard-service';

export const getDashboardData = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const dashboardData = await DashboardService.fetchDashboardData(userId);
        res.status(200).json(dashboardData);
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
