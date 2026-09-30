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
| 주보 | PDF를 `public/bulletins/`에 넣고 `bulletins` 배열에 추가 |

사진은 `public/images/`에 있습니다.

설교·영상 페이지는 유튜브 "산성의 빛 TV" 채널의 최신 영상을 1시간마다 자동으로 가져옵니다.

## 페이지

- `/` 홈
- `/about` 교회소개 (인사말, 비전, 연혁)
- `/worship` 예배안내
- `/sermons` 설교·영상
- `/news` 교회소식·주보
- `/education` 교회학교·청년부
- `/location` 오시는 길
