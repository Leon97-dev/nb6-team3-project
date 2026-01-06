import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../utils/to-token.js';
import { ENV } from '../../configs/env.js';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: '로그인이 필요합니다' });
    }

    const token = authHeader.split(' ')[1];

    try {
        if (!token) {
            throw new Error('ACCESS_SECRET is not defined');
        }
        const decoded = verifyToken(token, ENV.ACCESS_SECRET);
        if (!decoded || typeof decoded === 'string') {
            return res.status(401).json({ message: '유효하지 않은 토큰입니다' });
        }
        (req as any).user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: '유효하지 않은 토큰입니다' });
    }
};
