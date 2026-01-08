/**
 * @description 이미지 업로드 컨트롤러 모듈
 * 로직의 흐름을 조율하고 지시하는 역할
 * @author 정현준
 * @date 2026-01-08
 * @version 1.0
 **/

import type { Request, Response } from 'express';
import { uploadService } from './upload-service.js';

export const uploadController = {
  // asyncHandler가 감싸고 있으므로 try-catch 제거 가능
  async upload(req: Request, res: Response): Promise<void> {
    // 1. 유효성 검사
    if (!req.file) {
      res.status(400).json({ message: '파일이 업로드되지 않았습니다.' });
      return;
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // 2. 비동기 로직 (에러 발생 시 asyncHandler가 자동으로 next(error) 호출)
    const imageUrl = uploadService.getUploadUrl(req.file, baseUrl);

    res.status(200).json({ imageUrl });
  },
};

/*
 async upload: express의 라우트 핸들러
 클라이언트로부터 들어온 특정 경로의 HTTP 요청을 직접 처리
 req: 클라이언트 요청에 대한 모든 정보를 담고 있는 객체
 ex) 헤더, 파라미터, 본문, 업로드 파일 등
 res: 서버가 클라이언트에게 보낼 응답을 관리하는 객체
 ex) 상태 코드, JSON 데이터 전송 등
 async: 이 함수가 비동기적으로 동작하는 것을 의미
 asyncHandler와 함께 사용되어, 함수 내에서 발생하는 에러를 별도의 try-catch 문
 없이도 중앙에서 효과적으로 처리할 수 있게 해줍니다.

asyncHandler가 감싸고 있는 경우: try-catch 제거 가능
async 함수 내에서 발생한 에러는 직접 try-catch로 잡아서 처리해야 함.
asyncHandler 같은 에러 처리 미들웨어를 사용하면, async 함수에서 발생한 에러를
자동으로 감지하여 Express의 다음 에러 처리 미들웨어로 넘겨줌.
이 패턴을 통해서 컨트롤러 코드가 훨씬 간결하고 비즈니스 로직에만 집중할 수 있게 됨.

if(!req.file): 본격적인 로직을 실행하기 전, 유효성 검사하는 부분
multer(파일 업로드 미들웨어): 업로드된 파일이 req.file 객체에 담겨서 전달됨.
8-10번: 파일이 정상적으로 업로드되지 않은 경우를 확인하여, 400 Bad Request 상태
코드와 함께 에러 메시지를 클라이언트에게 보내고 함수를 즉시 종료, 불필요한 로직 수행을
막는 중요한 방어 코드.

const baseUrl = ... : 업로드된 파일에 접근할 수 있는 전체 URL을 만들기 위해 현재
서버의 기본 주소를 생성하는 부분. req.protocol과 req.get을 조합하여 동적으로 주소를 만들어냄.

const imageUrl = uploadService.getUploadUrl(req.file,baseUrl);
: 컨트롤러는 요청을 받고 응답을 보내는 '교통정리' 역할에 집중하고, 실제 비즈니스 로직은
서비스 계층에 위임하는 좋은 설계 패턴을 따르고 있음.
위 코드에서는 uploadService에 있는 getUploadUrl 함수를 호출하여, 업로드된 파일 정보
(req.file)와 서버 주소(baseUrl)를 넘겨주고 파일에 접근할 수 있는 최종 URL을 생성하도록
요청한다. 이렇게 하면 로직이 분리되어 코드를 테스트하고 유지보수하기가 쉬워진다.

res.status(200).json({ imageUrl });
: 모든 로직이 성공적으로 완료되면, 200 OK 상태 코드와 함께 생성된 imageUrl을 JSON 
형식으로 클라이언트에게 응답

*/
