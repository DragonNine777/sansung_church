"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// 페이지가 바뀔 때마다 방문 기록을 한 번 보냄 (src/app/api/visit/route.ts)
export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const body = JSON.stringify({ path: pathname });
    if (navigator.sendBeacon) navigator.sendBeacon("/api/visit", new Blob([body], { type: "application/json" }));
    else fetch("/api/visit", { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true }).catch(() => {});
  }, [pathname]);

  return null;
}
