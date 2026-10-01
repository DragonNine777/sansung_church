"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent, type TouchEvent } from "react";
import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import type { Bulletin } from "@/data/church";
import { ChevronLeftIcon, ChevronRightIcon, ExternalIcon, FileIcon } from "./icons";

type PdfState = { file: string; pages: number; error?: boolean };

// 주보 미리보기: PDF는 pdf.js로 페이지마다, JPG는 이미지마다 한 장씩 넘겨 봄
export default function BulletinViewer({ bulletins }: { bulletins: Bulletin[] }) {
  const [selected, setSelected] = useState(0);
  const [page, setPage] = useState(0);
  const [pdf, setPdf] = useState<PdfState | null>(null);
  const [width, setWidth] = useState(0);
  const docRef = useRef<PDFDocumentProxy | null>(null);
  const taskRef = useRef<PDFDocumentLoadingTask | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const touchX = useRef<number | null>(null);

  const bulletin = bulletins[selected];
  const images = bulletin.images ?? [];
  const pdfFile = images.length === 0 ? bulletin.file : undefined;
  const pdfReady = !!pdfFile && pdf?.file === pdfFile && !pdf.error;
  const pageCount = pdfFile ? (pdfReady ? pdf.pages : 0) : images.length;
  const loading = !!pdfFile && pdf?.file !== pdfFile;
  const failed = !!pdfFile && pdf?.file === pdfFile && pdf.error;
  const original = bulletin.file ?? images[page];

  // 미리보기 영역 너비 추적 (PDF를 화면 크기에 맞춰 선명하게 다시 그리기 위함)
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    ro.observe(frame);
    return () => ro.disconnect();
  }, []);

  // PDF 불러오기
  useEffect(() => {
    if (!pdfFile) return;
    let cancelled = false;
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
        // 일부 서버가 Range 요청에 204를 돌려주므로 파일 전체를 받아서 넘김
        const res = await fetch(pdfFile);
        if (!res.ok) throw new Error(String(res.status));
        const loading = pdfjs.getDocument({
          data: new Uint8Array(await res.arrayBuffer()),
          // 글꼴이 포함되지 않은 한글 PDF도 올바르게 그리기 위한 리소스 (scripts/copy-pdfjs.mjs)
          cMapUrl: "/pdfjs/cmaps/",
          cMapPacked: true,
          standardFontDataUrl: "/pdfjs/standard_fonts/",
          wasmUrl: "/pdfjs/wasm/",
          iccUrl: "/pdfjs/iccs/",
        });
        const doc = await loading.promise;
        if (cancelled) return void loading.destroy();
        taskRef.current?.destroy();
        taskRef.current = loading;
        docRef.current = doc;
        setPdf({ file: pdfFile, pages: doc.numPages });
      } catch {
        if (!cancelled) setPdf({ file: pdfFile, pages: 0, error: true });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pdfFile]);

  useEffect(() => () => void taskRef.current?.destroy(), []);

  // 현재 페이지를 캔버스에 그리기
  useEffect(() => {
    const doc = docRef.current;
    if (!pdfReady || !doc || !width) return;
    let cancelled = false;
    let task: RenderTask | undefined;
    (async () => {
      const p = await doc.getPage(page + 1);
      const canvas = canvasRef.current;
      if (cancelled || !canvas) return;
      const base = p.getViewport({ scale: 1 });
      // 주보 글씨가 작으므로 일반 화면에서도 최소 2배 해상도로 그림
      const density = Math.min(Math.max(window.devicePixelRatio || 1, 2), 3);
      const viewport = p.getViewport({ scale: (width * density) / base.width });
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      task = p.render({ canvas, viewport });
      await task.promise.catch(() => {});
    })();
    return () => {
      cancelled = true;
      task?.cancel();
    };
  }, [pdfReady, page, width]);

  const go = (delta: number) => setPage((p) => Math.min(Math.max(p + delta, 0), Math.max(pageCount - 1, 0)));

  const choose = (i: number) => {
    setSelected(i);
    setPage(0);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  };
  const onTouchStart = (e: TouchEvent) => (touchX.current = e.touches[0].clientX);
  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
      <section
        aria-roledescription="carousel"
        aria-label={`${bulletin.title} 미리보기`}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="min-w-0 rounded-2xl outline-offset-4"
      >
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-brand-600 tabular-nums">{bulletin.date}</p>
            <h3 className="mt-0.5 text-lg font-bold md:text-xl">{bulletin.title}</h3>
          </div>
          {original && (
            <a
              href={original}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line px-4 text-sm font-semibold text-ink transition-colors hover:border-brand-200 hover:text-brand-600"
            >
              {bulletin.file ? "PDF 원본" : "원본 보기"} <ExternalIcon width={14} height={14} />
            </a>
          )}
        </div>

        <div
          ref={frameRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="relative -mx-5 overflow-hidden border-y border-line bg-paper sm:mx-0 sm:rounded-2xl sm:border"
        >
          {pdfFile ? (
            <canvas
              ref={canvasRef}
              aria-label={`${bulletin.title} ${page + 1}쪽`}
              role="img"
              className={`h-auto w-full bg-white ${pdfReady ? "block" : "hidden"}`}
            />
          ) : (
            images[page] && (
              <a href={images[page]} target="_blank" rel="noreferrer" aria-label={`${page + 1}쪽 크게 보기 (새 창)`}>
                <Image
                  key={images[page]}
                  src={images[page]}
                  alt={`${bulletin.title} ${page + 1}쪽`}
                  width={1403}
                  height={992}
                  sizes="(min-width: 1024px) 800px, 100vw"
                  className="block h-auto w-full cursor-zoom-in bg-white"
                />
              </a>
            )
          )}

          {(loading || failed) && (
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-muted">
              {loading ? "주보를 불러오는 중입니다…" : "미리보기를 표시할 수 없습니다. ‘PDF 원본’을 눌러 주세요."}
            </div>
          )}
          {(loading || failed) && <div aria-hidden="true" className="aspect-[1.414]" />}

          {pageCount > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                disabled={page === 0}
                aria-label="이전 쪽"
                className="absolute top-1/2 left-2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-md transition-opacity hover:bg-white disabled:pointer-events-none disabled:opacity-0 md:left-3 md:h-12 md:w-12"
              >
                <ChevronLeftIcon width={24} height={24} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                disabled={page >= pageCount - 1}
                aria-label="다음 쪽"
                className="absolute top-1/2 right-2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-md transition-opacity hover:bg-white disabled:pointer-events-none disabled:opacity-0 md:right-3 md:h-12 md:w-12"
              >
                <ChevronRightIcon width={24} height={24} />
              </button>
            </>
          )}
        </div>

        {images.length > 0 && (
          <p className="mt-3 text-center text-sm text-muted">주보 이미지를 누르면 크게 볼 수 있습니다.</p>
        )}

        {pageCount > 0 && (
          <div className="mt-3 flex items-center justify-center gap-4">
            <div className="flex gap-2" aria-hidden="true">
              {Array.from({ length: pageCount }, (_, i) => (
                <span
                  key={i}
                  className={`h-2 rounded-full transition-all ${i === page ? "w-6 bg-brand-600" : "w-2 bg-line"}`}
                />
              ))}
            </div>
            <p aria-live="polite" className="text-sm font-medium text-muted tabular-nums">
              {page + 1} / {pageCount}
            </p>
          </div>
        )}
      </section>

      <div>
        <h3 className="mb-3 text-sm font-bold tracking-wide text-muted">지난 주보</h3>
        <ul className="space-y-2">
          {bulletins.map((b, i) => (
            <li key={b.date + b.title}>
              <button
                type="button"
                onClick={() => choose(i)}
                aria-current={i === selected ? "true" : undefined}
                className={`flex min-h-14 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                  i === selected
                    ? "border-brand-200 bg-brand-50"
                    : "border-line hover:border-brand-200 hover:bg-brand-50"
                }`}
              >
                <FileIcon className="shrink-0 text-brand-600" />
                <span className="min-w-0 flex-1 font-medium text-ink">{b.title}</span>
                <span className="text-sm text-muted tabular-nums">{b.date}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
