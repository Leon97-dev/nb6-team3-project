/**
 * @description 이미지 업로드 컨트롤러 모듈
 * 로직의 흐름을 조율하고 지시하는 역할
 * @author 정현준
 * @date 2026-01-08
 * @version 1.0
 **/

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
