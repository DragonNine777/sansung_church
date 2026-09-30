import Link from "next/link";
import { campuses, church, nav, social } from "@/data/church";
import { InstagramIcon, LogoMark, YoutubeIcon } from "./icons";

export default function Footer() {
  return (
    <footer className="bg-brand-900 text-white/75">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-2 md:gap-10 md:px-8 md:py-14 lg:grid-cols-[1.4fr_1fr_auto]">
        <div>
          <div className="flex items-center gap-2.5">
            <LogoMark className="h-10 w-10" />
            <span className="text-lg font-bold text-white">{church.name}</span>
          </div>
          <p className="mt-3 text-sm">{church.denomination}</p>
          <div className="mt-6 space-y-3 text-sm leading-relaxed">
            {campuses.map((c) => (
              <p key={c.id}>
                <strong className="font-semibold text-white">{c.name}</strong>{" "}
                {c.address}
                <br />
                <a href={`tel:${c.phone}`} className="hover:text-white">
                  {c.phone}
                </a>
              </p>
            ))}
            <p>
              <a href={`mailto:${church.email}`} className="hover:text-white">
                {church.email}
              </a>
            </p>
          </div>
        </div>

        <nav aria-label="바닥글 메뉴">
          <ul className="grid grid-cols-3 gap-x-4 text-sm md:grid-cols-2 md:gap-x-6">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="flex min-h-11 items-center hover:text-white md:min-h-9">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex gap-3 md:col-span-2 lg:col-span-1">
          <a
            href={social.youtube}
            target="_blank"
            rel="noreferrer"
            aria-label="유튜브 채널 (새 창)"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 hover:text-white"
          >
            <YoutubeIcon />
          </a>
          <a
            href={social.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="인스타그램 (새 창)"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 hover:text-white"
          >
            <InstagramIcon />
          </a>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-white/55 md:px-8">
          © {new Date().getFullYear()} {church.name} {church.nameEn}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
