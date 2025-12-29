/**
 * @description 업로드 컨트롤러 모듈
 * 파일 업로드를 처리하는 기능을 제공합니다.
 * @author 정현준
 * @date 2025-12-29
 * @version 1.0
 **/

import type { Request, Response } from 'express';

export const uploadController = {
  // 파일 업로드 처리 메서드
  uploadFile: (req: Request, res: Response) => {
    // 업로드된 파일 정보는 req.file 또는 req.files에 저장됩니다.
    if (!req.file) {
      return res.status(400).json({ message: '파일이 업로드되지 않았습니다.' });
    }

    // 업로드된 파일 정보 반환
    res.status(200).json({
      message: '파일 업로드 성공',
      fileInfo: req.file,
    });
  },
};