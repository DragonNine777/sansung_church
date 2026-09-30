"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { campuses } from "@/data/church";
import { ClockIcon, MapPinIcon, PhoneIcon, PlayIcon } from "./icons";

// 모바일 하단 고정 바로가기 (lg 이상에서는 숨김)
const items = [
  { href: "/worship", label: "예배시간", Icon: ClockIcon },
  { href: "/sermons", label: "설교영상", Icon: PlayIcon },
  { href: "/location", label: "오시는 길", Icon: MapPinIcon },
];

export default function MobileQuickBar() {
  const pathname = usePathname();
  const main = campuses[0];

  return (
    <nav
      aria-label="바로가기"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="mx-auto grid h-16 max-w-xl grid-cols-4">
        {items.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex h-full flex-col items-center justify-center gap-1 text-[12px] font-medium transition-colors ${
                  active ? "text-brand-600" : "text-muted active:text-brand-600"
                }`}
              >
                <Icon width={22} height={22} />
                {label}
              </Link>
            </li>
          );
        })}
        <li>
          <a
            href={`tel:${main.phone}`}
            aria-label={`${main.name} 전화 걸기 ${main.phone}`}
            className="flex h-full flex-col items-center justify-center gap-1 text-[12px] font-medium text-muted active:text-brand-600"
          >
            <PhoneIcon width={22} height={22} />
            전화문의
          </a>
        </li>
      </ul>
    </nav>
  );
}
