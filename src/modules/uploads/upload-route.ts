/**
 * @description 업로드 라우터 모듈
 * 파일 업로드를 처리하는 기능을 제공합니다.
 * @author 정현준
 * @date 2025-12-29
 * @version 1.0
 **/

import { Router } from 'express';
import multer from 'multer';
import { uploadController } from './upload-controller';

// Multer 설정 (메모리 저장소 사용 예시)
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

// 파일 업로드 라우트
router.post('/upload', upload.single('file'), uploadController.uploadFile);

export default router;      