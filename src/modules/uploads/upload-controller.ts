import type { Request, Response } from 'express';
import { uploadService } from './upload-service.js';

export const uploadController = {
  // asyncHandler가 감싸고 있으므로 try-catch 제거 가능
  async upload(req: Request, res: Response): Promise<void> {
    // 1. 유효성 검사
    if (!req.file) {
      res.status(400).json({ message: '파일이 업로드되지 않았습니다.' });
      return;
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // 2. 비동기 로직 (에러 발생 시 asyncHandler가 자동으로 next(error) 호출)
    const imageUrl = uploadService.getUploadUrl(req.file, baseUrl);

    res.status(200).json({ imageUrl });
  },
};
