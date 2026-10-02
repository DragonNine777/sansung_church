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

## 관리자 페이지 (주보·소식 올리기)

비밀 주소의 관리자 페이지에서 주보(JPG·PDF)와 소식(포스터 이미지 + 글)을 올리고 지울 수 있습니다.
올린 내용은 교회소식 페이지에 바로 반영됩니다. 관리자 주소는 사이트 어디에도 링크되지 않습니다.

Vercel 프로젝트 설정이 필요합니다.

1. **Storage → Create → Blob** 으로 저장소를 만들고 이 프로젝트에 연결 (`BLOB_READ_WRITE_TOKEN` 자동 설정)
2. **Settings → Environment Variables** 에 추가
   - `ADMIN_PATH` : 관리자 페이지 비밀 주소 (예: `sl-admin-abc123` → `https://사이트/sl-admin-abc123`)
   - `ADMIN_PASSWORD` : 관리자 비밀번호
3. 다시 배포 (Deployments → 최신 배포 → Redeploy)

저장소가 공개되어 있으므로 비밀 주소와 비밀번호는 코드가 아닌 환경변수에만 둡니다.
로컬에서 시험할 때는 같은 값을 `.env.local` 에 적습니다.

## 페이지

- `/` 홈
- `/about` 교회소개 (인사말, 비전, 연혁)
- `/worship` 예배안내
- `/sermons` 설교·영상
- `/news` 교회소식·주보
- `/education` 교회학교·청년부
- `/location` 오시는 길
