/**
 * @description 대시보드 컨트롤러 모듈
 * 대시보드 관련 요청을 처리하는 기능을 제공합니다.
 * @author 정현준
 * @date 2025-12-29
 * @version 1.0
 **/

import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { dashboardService } from '../dashboards/dashboard-service.js';

export const dashboardController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const { title, content } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const dashboard = await dashboardService.createService({
      title,
      content,
      userId,
    });

    res.status(201).json(dashboard);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const dashboard = await dashboardService.getService(id);
    res.json(dashboard);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const { title, content } = req.body;

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const dashboard = await dashboardService.updateService(id, {
      title,
      content,
    });

    res.json(dashboard);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    await dashboardService.deleteService(id);
    res.sendStatus(204);
  }),
};

export default dashboardController;



