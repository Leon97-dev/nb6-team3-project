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

/*
코드의 각 부분이 하는 역할

export const uploadService = { ... }

업로드와 관련된 비즈니스 로직을 담고 있는 uploadService 객체를 정의하고 내보낸다.
// async 제거 -> 일반 문자열 반환

이 함수는 데이터베이스 조회나 외부 API 호출과 같은 비동기 작업이 필요 없음.
단순히 전달받은 인자(문자열, 객체)를 조합하여 새로운 문자열(URL)을 만드는 동기적인 작업이기 때문에,
async 키워드를 사용하지 않는다. 그래서 코드가 더 간결해지는 효과가 있음.
getUploadUrl(...): string | null

이 함수의 시그니처, multer가 생성한 file 객체와 baseUrl을 인자로 받아서, 
최종 URL 문자열(string) 또는 파일이 없는 경우 null을 반환
if (!file) { return null; }

가장 먼저 파일 객체가 제대로 전달되었는지 확인하고 만약 파일이 없다면 null을 반환하여, 
이 함수를 호출한 쪽(컨트롤러)에서 에러 처리나 다른 분기 처리를 할 수 있도록 한다.
URL 정규화 (Normalization) 로직

// 1. 프로토콜 로직 수정: baseUrl이 localhost:3000처럼 프로토콜(http://) 없이 전달될 경우를 대비하여, 
// http로 시작하지 않으면 http://를 붙여주는 방어적인 코드
// 2. 끝부분 슬래시 제거: baseUrl이 http://localhost:3000/ 처럼 끝에 슬래시(/)를 포함할 경우, 뒤에 붙을 /uploads/와 합쳐져
//  // 처럼 이중 슬래시가 생길 수 있어서 replace(/\/+$/, '')는 정규식을 사용하여 끝에 있는 하나 이상의 슬래시를 제거하여
//  http://localhost:3000/uploads/... 와 같은 올바른 URL 형태를 보장
최종 URL 조립 및 반환

// 3. 인코딩(파일명에 공백 있을 경우를 대비): 이 주석은 파일명에 대한 고려를 보여준다.
return \${prefix}/uploads/${file.filename}`;: 정규화된 서버 주소(prefix), 정적 경로인/uploads/, 그리고multer가 서버에 저장한 파일 이름(file.filename`)을 조합하여 최종적으로 클라이언트가 접근할 수 있는 전체 파일 URL을 생성하여 반환한다.
주석 처리된 코드

// const encodedFilename = encodeURIComponent(file.filename);
이 코드는 파일명에 한글이나 공백 등 URL에 사용할 수 없는 문자가 포함될 경우를 대비해 파일명을 URL 인코딩하는 것을 고려했음을 보여주지만 현재는 file.filename을 그대로 사용하고 있고 
multer가 파일을 저장할 때 이미 URL에 사용해도 안전한 문자(알파벳, 숫자 등)로만 이루어진 고유한 파일명을 생성해주기 때문에 별도의 인코딩이 필요 없다고 판단

*/
