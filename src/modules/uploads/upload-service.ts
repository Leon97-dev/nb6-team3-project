export const uploadService = {
  // async 제거 -> 일반 문자열 반환
  getUploadUrl(
    file: Express.Multer.File | undefined,
    baseUrl = ''
  ): string | null {
    if (!file) {
      return null;
    }

    // 1. 프로토콜 로직 수정
    // baseUrl이 있고, http/https로 시작하지 않을 때만 http://를 붙임
    let normalizedBaseUrl = baseUrl;
    if (baseUrl && !baseUrl.startsWith('http')) {
      normalizedBaseUrl = `http://${baseUrl}`;
    }

    // 2. 끝부분 슬래시 제거
    const prefix = normalizedBaseUrl
      ? normalizedBaseUrl.replace(/\/+$/, '')
      : '';

    // 3. 인코딩(파일명에 공백 있을 경우를 대비)
    return `${prefix}/uploads/${file.filename}`;
  },
};
// const encodedFilename = encodeURIComponent(file.filename);
// 로컬 파일 시스템 이름 그대로 쓸 경우: file.filename 사용
