/**
 * @description 이미지 업로드 서비스 모듈
 * 컨트롤러로부터 지시받은 내용 수행 및 URL을 생성하는 구체적인 로직 존재
 * @author 정현준
 * @date 2026-01-08
 * @version 1.0
 **/
// 업로드와 관련된 비즈니스 로직을 담고 있는 uploadService 객체 정의 및 내보내기
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
    // baseUrl이 localhost:3000처럼 프로토콜(http://) 없이 전달될 경우를 대비
    let normalizedBaseUrl = baseUrl;
    if (baseUrl && !baseUrl.startsWith('http')) {
      normalizedBaseUrl = `http://${baseUrl}`;
    }

    // 2. 끝부분 슬래시 제거
    const prefix = normalizedBaseUrl
      ? normalizedBaseUrl.replace(/\/+$/, '')
      : '';
    // baseUrl이 http://localhost:3000/ 처럼 끝에 슬래시(/)를 포함할 경우, 뒤에 붙을 /uploads/와 합쳐져
    // // 처럼 이중 슬래시가 생길 수 있어서 replace(/\/+$/, '')는 정규식을 사용하여 끝에 있는 하나 이상의 슬래시를 제거하여
    // http://localhost:3000/uploads/... 와 같은 올바른 URL 형태를 보장

    // 3. 인코딩(파일명에 공백 있을 경우를 대비): 이 주석은 파일명에 대한 고려를 보여준다.
    return `${prefix}/uploads/${file.filename}`;
  },
};
