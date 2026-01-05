/**
 * @description 애플리케이션 진입점 모듈
 * @author 이호성
 * @date 2025-12-17
 * @version 1.0
 * @warning 라우터 완성 후, 주석 위치에 라우터를 추가해주세요.
 **/

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { notFoundHandler, errorHandler } from './errors/error-handler.js';
import { debugLog } from './errors/debug.js';

// ============================================
// 라우터 import (여기에 추가 하세요!)
// ============================================
import healthRoutes from './modules/common/health-route.js';
import customerRoutes from './modules/customers/customer-route.js';
import authRoutes from './modules/auth/auth-route.js';
import userRoutes from './modules/users/user-route.js';
import uploadRoutes from './modules/uploads/upload-route.js';
import dashboardRoutes from './modules/dashboards/dashboard-route.js';
import companyRoutes from './modules/companies/company-route.js';

// ============================================
// 환경 변수 설정
// ============================================
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

// ============================================
// 글로벌 미들웨어 설정
// ============================================
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use('/upload', express.static('public/uploads'));

// ============================================
// 라우터 등록 (여기에 추가 하세요!)
// ============================================
app.use('/health', healthRoutes);
app.use('/customers', customerRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/uploads', uploadRoutes);
app.use('/dashboards', dashboardRoutes);
app.use('/companies', companyRoutes);

// ============================================
// 404 핸들러 등록
// ============================================
app.use(notFoundHandler);

// ============================================
// 에러 핸들러 등록
// ============================================
app.use(errorHandler);

// ============================================
// 서버 시작
// ============================================
app.listen(PORT, () => {
  console.log(`🚗 Dear Carmate API Server is running on port ${PORT}`);
  debugLog('Debug mode is enabled');
  debugLog(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
