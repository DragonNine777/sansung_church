# 산성의빛교회 홈페이지

대한예수교장로회(합동) 성남노회 산성의빛교회 홈페이지입니다. Next.js 16 + Tailwind CSS 4로 만들었습니다.

## 실행

```bash
npm install
npm run dev      # 개발 서버: http://localhost:3000
npm run build    # 배포용 빌드
npm run start    # 빌드 결과 실행
```

## 내용 수정

교회 정보는 대부분 [`src/data/church.ts`](src/data/church.ts) 한 파일에 모여 있습니다.

| 바꾸고 싶은 것 | 위치 |
| --- | --- |
| 예배 시간 | `serviceGroups` |
| 담임목사 인사말 | `pastor.greeting`, `values` |
| 올해 표어·성경 구절 | `motto` |
| 성전 주소·전화 | `campuses` |
| 교회학교·청년부 소개 | `ministries` |
| 교회소식 | `news` 배열 맨 앞에 추가 |
| 주보 | 관리자 페이지에서 올리기 (또는 JPG를 `public/bulletins/`에 넣고 `bulletins` 배열에 추가) |

사진은 `public/images/`에 있습니다.

설교·영상 페이지는 유튜브 "산성의 빛 TV" 채널의 최신 영상을 1시간마다 자동으로 가져옵니다.

## 관리자 페이지 (주보·소식 올리기)

비밀 링크의 관리자 페이지에서 주보(JPG·PDF)와 소식(포스터 이미지 + 글)을 올리고 지울 수 있습니다.
올린 내용은 교회소식 페이지에 바로 반영됩니다. 비밀 링크를 아는 사람만 들어갈 수 있으므로 링크를 다른 사람과 공유하지 마세요.

Vercel 설정 (Settings → Environment Variables, Production)

- `ADMIN_PATH` : 관리자 비밀 링크 주소 (12자 이상, 길고 추측하기 어렵게). 바꾸면 이전 링크는 즉시 막힘
- `ADMIN_PASSWORD` : (선택) 설정하면 비밀 링크 + 비밀번호 로그인까지 요구
- `BLOB_STORE_ID` : Vercel Blob 저장소 연결 시 자동 설정 (비공개 저장소)

환경변수를 바꾼 뒤에는 다시 배포해야 반영됩니다.
업로드한 파일은 비공개 저장소에 저장되고 사이트의 `/files/...` 주소로 보여집니다.
사진은 올리기 전에 브라우저에서 긴 변 2400px 이하로 줄여서 보냅니다 (Vercel 요청 한도 4.5MB).

## 페이지

- `/` 홈
- `/about` 교회소개 (인사말, 비전, 연혁)
- `/worship` 예배안내
- `/sermons` 설교·영상
- `/news` 교회소식·주보
- `/education` 교회학교·청년부
- `/location` 오시는 길
