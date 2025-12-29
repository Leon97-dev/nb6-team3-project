/**
 * @description 업로드 DTO 모듈
 * 파일 업로드를 처리하는 기능을 제공합니다.
 * @author 정현준
 * @date 2025-12-29
 * @version 1.0
 **/

export interface UploadFileDTO {
  originalname: string; // 원본 파일 이름
  filename: string;     // 저장된 파일 이름 (서버 내)
  mimetype: string;     // 파일 MIME 타입
  size: number;         // 파일 크기 (바이트 단위)
  path: string;         // 파일 경로
}

export interface UploadFileResponse {
  message: string;
  fileInfo: UploadFileDTO;
}   

