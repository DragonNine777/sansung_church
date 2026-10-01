// pdf.js 실행에 필요한 파일을 public/pdfjs 로 복사 (npm run dev / build 전에 자동 실행)
// - pdf.worker.min.mjs : PDF 해석 워커
// - cmaps, standard_fonts : 글꼴이 포함되지 않은 한글 PDF를 올바르게 그리기 위해 필요
// - wasm, iccs : 이미지 디코딩·색상 프로필용
import { cpSync, mkdirSync, rmSync } from "node:fs";

const src = "node_modules/pdfjs-dist";
const dest = "public/pdfjs";

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });
cpSync(`${src}/build/pdf.worker.min.mjs`, `${dest}/pdf.worker.min.mjs`);
for (const dir of ["cmaps", "standard_fonts", "wasm", "iccs"]) {
  cpSync(`${src}/${dir}`, `${dest}/${dir}`, { recursive: true });
}
