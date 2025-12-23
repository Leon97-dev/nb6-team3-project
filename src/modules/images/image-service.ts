import { Express } from 'express';

interface ImageServiceConfig {
  uploadPath: string;
  allowedFormats: string[];
  maxFileSize: number; // in bytes
}

class ImageService {
  private config: ImageServiceConfig;

  constructor(config: ImageServiceConfig) {
    this.config = config;
  }

  validateImage(file: Express.Multer.File): boolean {
    const isValidFormat = this.config.allowedFormats.includes(file.mimetype);
    const isValidSize = file.size <= this.config.maxFileSize;
    return isValidFormat && isValidSize;
  }

  getUploadPath(): string {
    return this.config.uploadPath;
  } 
}