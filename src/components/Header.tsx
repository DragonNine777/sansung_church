"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { campuses, church, nav, social } from "@/data/church";
import {
  ArrowRightIcon,
  CloseIcon,
  InstagramIcon,
  LogoMark,
  MenuIcon,
  PhoneIcon,
  YoutubeIcon,
} from "./icons";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const overHero = pathname === "/" && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    // 메뉴가 열려 있는 동안 뒤 화면 스크롤 막기
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          overHero ? "bg-transparent" : "border-b border-line bg-white/95 backdrop-blur"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-20 md:px-8">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5"
            aria-label={`${church.name} 홈`}
          >
            <LogoMark className="h-10 w-10 md:h-11 md:w-11" />
            <span
              className={`text-lg font-bold tracking-tight md:text-xl ${
                overHero ? "text-white" : "text-brand-700"
              }`}
            >
              {church.name}
            </span>
          </Link>

          <nav aria-label="주 메뉴" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative rounded-md px-4 py-2 text-[15px] font-medium transition-colors ${
                        overHero
                          ? "text-white/90 hover:text-white"
                          : active
                            ? "text-brand-600"
                            : "text-ink hover:text-brand-600"
                      }`}
                    >
                      {item.label}
                      {active && (
                        <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded bg-brand-500" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            className={`-mr-2 flex h-11 w-11 items-center justify-center rounded-md lg:hidden ${
              overHero ? "text-white" : "text-ink"
            }`}
          >
            {open ? <CloseIcon width={24} height={24} /> : <MenuIcon width={24} height={24} />}
          </button>
        </div>
      </header>
      {open && (
        <nav
          id="mobile-menu"
          aria-label="모바일 메뉴"
          className="fixed inset-x-0 top-16 bottom-0 z-[45] flex flex-col overflow-y-auto overscroll-contain border-t border-line bg-white px-5 pt-2 pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:top-20 lg:hidden"
        >
          <ul className="divide-y divide-line">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={pathname.startsWith(item.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className="flex min-h-14 items-center justify-between py-3 text-lg font-semibold text-ink aria-[current=page]:text-brand-600"
                >
                  {item.label}
                  <ArrowRightIcon className="text-line" width={18} height={18} />
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-auto space-y-3 pt-8">
            <div className="grid grid-cols-2 gap-3">
              {campuses.map((c) => (
                <a
                  key={c.id}
                  href={`tel:${c.phone}`}
                  className="flex min-h-14 flex-col justify-center rounded-xl bg-paper px-4 py-3 active:bg-brand-50"
                >
                  <span className="text-sm text-muted">{c.name}</span>
                  <span className="flex items-center gap-1.5 font-semibold whitespace-nowrap text-ink tabular-nums">
                    <PhoneIcon width={15} height={15} className="shrink-0 text-brand-600" />
                    {c.phone}
                  </span>
                </a>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <a
                href={social.youtube}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line font-medium text-ink"
              >
                <YoutubeIcon /> 유튜브
              </a>
              <a
                href={social.instagram}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line font-medium text-ink"
              >
                <InstagramIcon /> 인스타그램
              </a>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
