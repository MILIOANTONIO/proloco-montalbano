"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import HeroVideo from "./HeroVideo";
import { StoreIcon } from "./icons";

export default function ActivityBanner({
  image,
  videoMobile,
  videoDesktop,
  title,
  subtitle,
  cta,
  href,
}: {
  image: string | null;
  videoMobile: string | null;
  videoDesktop: string | null;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
}) {
  // null finché non conosciamo il viewport reale (evita hydration mismatch e il bug del
  // doppio video mobile+desktop montati insieme, già visto nel carosello hero).
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const activeVideo = isDesktop === null ? null : isDesktop ? videoDesktop || videoMobile : videoMobile || videoDesktop;

  return (
    <Link
      href={href}
      className="group relative block aspect-[4/3] w-full overflow-hidden rounded-3xl bg-brand-900 shadow-xl sm:aspect-[21/9]"
    >
      {activeVideo ? (
        <HeroVideo src={activeVideo} className="absolute inset-0 h-full w-full object-cover" loop />
      ) : image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700 to-olive-700" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-ink/10" />

      <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-10">
        <h2 className="font-display text-2xl font-extrabold leading-tight text-white drop-shadow-sm sm:text-4xl">{subtitle}</h2>
        <p className="mt-3 inline-flex w-fit items-center gap-2 rounded-full bg-cream dark:bg-brand-900 px-4 py-2.5 text-sm font-semibold text-brand-900 dark:text-brand-100 transition-colors duration-200 group-hover:bg-white">
          <StoreIcon className="h-4 w-4" />
          {cta}
        </p>
        <span className="sr-only">{title}</span>
      </div>
    </Link>
  );
}
