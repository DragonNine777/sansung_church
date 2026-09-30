import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Video } from "@/lib/youtube";
import { formatDate } from "@/lib/youtube";
import { ArrowRightIcon, PlayIcon } from "./icons";

// 하위 페이지 상단 제목 영역
export function PageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <section className="relative overflow-hidden bg-brand-50 pt-16 md:pt-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-brand-100/70 blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-20">
        <p className="text-sm font-semibold tracking-[0.2em] text-brand-600">{eyebrow}</p>
        <h1 className="mt-3 font-serif text-3xl font-bold md:text-[2.75rem] md:leading-tight">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted md:text-lg">{description}</p>}
      </div>
    </section>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  align = "left",
  action,
}: {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
  action?: ReactNode;
}) {
  return (
    <div
      className={`mb-8 flex flex-wrap items-end gap-x-4 gap-y-2 md:mb-10 ${
        align === "center" ? "flex-col items-center text-center" : "justify-between"
      }`}
    >
      <div>
        <p className="text-sm font-semibold tracking-[0.2em] text-brand-600">{eyebrow}</p>
        <h2 className="mt-2 font-serif text-2xl font-bold md:text-3xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function MoreLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-brand-600 hover:text-brand-700"
    >
      {children}
      <ArrowRightIcon className="transition-transform group-hover:translate-x-0.5" width={18} height={18} />
    </Link>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-6xl px-5 md:px-8 ${className}`}>{children}</div>;
}

export function VideoCard({ video }: { video: Video }) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.id}`}
      target="_blank"
      rel="noreferrer"
      className="group flex items-start gap-4 md:block"
    >
      {/* 모바일: 썸네일 + 제목 가로 목록 / md 이상: 카드 */}
      <div className="relative aspect-video w-[42%] max-w-52 shrink-0 overflow-hidden rounded-lg bg-paper md:w-auto md:max-w-none md:rounded-xl">
        <Image
          src={video.thumbnail}
          alt=""
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 768px) 50vw, 42vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-brand-900/0 transition-colors group-hover:bg-brand-900/25">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-brand-600 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            <PlayIcon />
          </span>
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-3 text-[15px] leading-snug font-semibold text-ink group-hover:text-brand-600 md:mt-3 md:line-clamp-2">
          {video.title}
          <span className="sr-only"> (유튜브, 새 창)</span>
        </h3>
        <p className="mt-1 text-[13px] text-muted md:text-sm">{formatDate(video.published)}</p>
      </div>
    </a>
  );
}
