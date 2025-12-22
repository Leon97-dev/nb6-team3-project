import { Request, Response, NextFunction } from 'express';

export const validateDashboardRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { title, widgets } = req.body;
  
  if (typeof title !== 'string' || title.trim() === '') {   
    return res.status(400).json({ error: 'Invalid or missing title' });
    }   
  
  if (!Array.isArray(widgets)) {
    return res.status(400).json({ error: 'Widgets must be an array' });
    }
    next();
};

