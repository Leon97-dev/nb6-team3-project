/**
 * @description 업로드 서비스 모듈
 * 파일 업로드를 처리하는 기능을 제공합니다.
 * @author 정현준
 * @date 2025-12-29
 * @version 1.0
 **/

export const uploadService = {
  // 파일 업로드 관련 비즈니스 로직
  uploadFile: async (file: File): Promise<string> => {
    // 파일 업로드 처리
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error("파일 업로드 실패");
    }
    const data = await response.json();
    return data.fileInfo.path; // 업로드된 파일 경로 반환
  },
};





