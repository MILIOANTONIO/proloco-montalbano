"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    const payload = JSON.stringify({ path: pathname });
    const sent = navigator.sendBeacon?.(
      "/api/track",
      new Blob([payload], { type: "application/json" })
    );
    if (!sent) {
      fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload, keepalive: true }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
