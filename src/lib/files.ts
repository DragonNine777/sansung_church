// 업로드 파일의 화면용 주소 (비공개 저장소라 사이트의 /files/ 를 거쳐 전달)
// 서버·브라우저 양쪽에서 쓰므로 서버 전용 모듈을 가져오지 않음
export const fileUrl = (pathname: string) => `/files/${pathname}`;
