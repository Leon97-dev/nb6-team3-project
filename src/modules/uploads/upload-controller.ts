import type { Request, Response } from 'express';
import { uploadService } from './upload-service.js';

export const uploadController = {
  async upload(req: Request, res: Response): Promise<void> {
    if (!req.file) {
      res.status(400).json({ message: '파일이 업로드되지 않았습니다.' });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const imageUrl = await uploadService.getUploadUrl(req.file, baseUrl);

    res.status(200).json({ imageUrl });
  },
};
