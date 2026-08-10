"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "montalbano-flash-dismissed";

export default function LatestFlash({
  id,
  badgeLabel,
  title,
  image,
  video,
  href,
  dismissLabel,
}: {
  id: string;
  badgeLabel: string;
  title: string;
  image: string | null;
  video?: string | null;
  href: string;
  dismissLabel: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) !== id) setVisible(true);
  }, [id]);

  if (!visible) return null;

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, id);
    setVisible(false);
  }

  return (
    <div className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-900 p-2.5 pr-9 shadow-sm">
      <Link href={href} className="flex flex-1 items-center gap-3 min-w-0">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-brand-100 dark:bg-brand-800">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" className="h-full w-full object-cover" />
          ) : (
            video && (
              <video
                src={video}
                muted
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
                onLoadedMetadata={(e) => {
                  e.currentTarget.currentTime = 0.1;
                }}
              />
            )
          )}
        </div>
        <div className="min-w-0">
          <span className="inline-block rounded-full bg-olive-400/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-olive-600 dark:text-olive-400">
            {badgeLabel}
          </span>
          <p className="mt-0.5 truncate font-display text-sm font-bold text-brand-900 dark:text-brand-100">{title}</p>
        </div>
      </Link>
      <button
        type="button"
        onClick={dismiss}
        aria-label={dismissLabel}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-brand-400 hover:bg-brand-100 hover:text-brand-700"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
