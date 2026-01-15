
# **NB 06기 PART3 3팀**

---

중급 프로젝트 - Dear Carmate

관련 문서: [Notion](https://www.notion.so/PART-3-2ce598c5573d80ec8610c0e87676bc99) [발표 자료PDF](https://www.notion.so/DEAR_CARMATE-2e6f76d8c01480b6ac70e33f90b0890d)

---

## 팀 구성

👥 프로젝트 구성원과 R&R
| 팀원 | 업무 | 후속 작업 | 브랜치 |
|:-------:|:-------:|:-------:|:-------:|
| 정현준 | 파일 업로드, 대시보드 | 발표 시나리오 | dashboard-현준2, feat/uploads, upload-현준 |
| 이호성 | 인증, 유저(admin 분리) | 배포 및 PDF | feature-auth, feature-user |
| 유인학 | 계약, 계약서 | Swagger | feature-유인학-contracts |
| 박대용 | 고객, 회사 | 시연 연상 | feature-박대용 |
| 오예슬 | 차량 | 문서화 | 오예슬 |

---

## 프로젝트 목적 및 활용 도구

**목표**

- API 명세서 및 요구 사항에 맞는 백엔드 프로그램 구현, 프론트 연동
- Git 과 GitHub 프로그램 사용 방법 익히기
- Typescript 및 psql 익히기

**기술 스택**

| 분류           | 사용 도구                      |
| :------------- | :----------------------------- |
| 백엔드         | Node.js (Express), REST Client |
| 데이터 베이스  | PostgreSQL                     |
| 공통 협업 도구 | Discord, GitHub, Notion        |
| 일정 관리      | Notion                         |

---

## 팀원별 담당 및 구현 기능

### 공통 작업

1. R&R 분배
2. 공용 파일 생성: schema, struct, mock
3. 발표 자료 준비

### 정현준

- 파일 업로드 및 대시보드 API 개발
- 전반적인 발표 시나리오 준비

### 이호성

- 인증 및 유저(admin 분리!) API 개발
- 배포 및 PPT 제작

### 유인학

- 계약 및 계약서 API 개발
- API 문서화 (swagger)

### 박대용

- 고객 및 회사 API 개발
- 시연 영상 준비

### 오예슬

- 차량 API 개발
- README 문서화 및 Notion 계획서 작성

---

## 프로젝트 구조

```
NB6-TEAM3-PROJECT/
├── prisma/
│   ├── schema.prisma
│   └── seed.js
│
├── public/
│   ├── uploads/                 # 파일 업로드 저장 폴더
│   └── project-dearcarmate-fe-main/   # 프론트엔드 코드
│
├── src/ 
│   ├── modules/ # 도메인 기준 모듈 분리
│   │   ├── auth/
│   │   │   ├── auth-controller.ts
│   │   │   ├── auth-repository.ts
│   │   │   ├── auth-route.ts
│   │   │   ├── auth-service.ts
│   │   │   └── auth-validator.ts
│   │   │
│   │   ├── cars/
│   │   │   ├── car-controller.ts
│   │   │   └── ...
│   │   │
│   │   ├── companies/
│   │   │   ├── company-controller.ts
│   │   │   └── ...
│   │   │
│   │   ├── contractDocuments/
│   │   │   ├── docs-controller.ts
│   │   │   └── ...
│   │   │
│   │   ├── contracts/
│   │   │   ├── contract-controller.ts
│   │   │   └── ...
│   │   │
│   │   ├── customers/
│   │   │   ├── customer-controller.ts
│   │   │   └── ...
│   │   │
│   │   ├── users/
│   │   │   ├── user-controller.ts
│   │   │   └── ...
│   │   
│   ├── middlewares/
│   ├── utils/
│   ├── types/
│   ├── app.ts # 서버 진입점
```
---

## 구현 홈페이지

[Dear Carmate](https://dear-carmate-service.onrender.com/)

---

### 최근 수정: 26.01.15
