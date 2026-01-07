/**
 * @description 이미지 업로드 라우터 모듈
 * POST/api/upload 주소로 요청올 시, uploadController.upload 함수를 실행시키라고 연결해주는 역할
 * @author 정현준
 * @date 2026-01-07
 * @version 1.0
 **/
import { Router } from 'express';
import { uploadController } from './upload-controller.js';
import { upload } from '../../middlewares/upload-middleware.js';
import asyncHandler from '../../errors/async-handler.js';

const router = Router();

// upload 경로로 file 필드에 파일 담아서 POST 요청
router.post(
  '/upload',
  // multer가 파일을 받아서 서버에 저장하고 req.file 객체 생성
  upload.single('file'),
  // 미들웨어 실행
  asyncHandler(uploadController.upload)
);

export default router;

/* 업로드 컨트롤러: req.file 객체 확인 후, 업로드 서비스를 
통해 파일 URL을 생성한 후, 클라이언트에게 JSON 형태로 응답
*/
