"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getDictionary, type Locale } from "@/lib/i18n";
import LocaleSwitcher from "./LocaleSwitcher";
import { MapIcon, InfoIcon, CalendarIcon, NewspaperIcon, ContactIcon, StoreIcon } from "./icons";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" className="h-6 w-6" aria-hidden="true">
      {open ? (
        <path d="M6 6l12 12M18 6L6 18" />
      ) : (
        <>
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="20" y2="17" />
        </>
      )}
    </svg>
  );
}

export default function NavBar({ locale }: { locale: Locale }) {
  const t = getDictionary(locale);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const base = `/${locale}`;
  const links = [
    { href: `${base}/percorso`, label: t.nav.percorso, Icon: MapIcon },
    { href: `${base}/attivita`, label: t.nav.attivita, Icon: StoreIcon },
    { href: `${base}/info`, label: t.nav.info, Icon: InfoIcon },
    { href: `${base}/eventi`, label: t.nav.eventi, Icon: CalendarIcon },
    { href: `${base}/news`, label: t.nav.news, Icon: NewspaperIcon },
    { href: `${base}/contatti`, label: t.nav.contatti, Icon: ContactIcon },
  ];

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-20 border-b border-brand-200/70 bg-cream/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-1.5 sm:px-6 lg:px-8">
        <Link href={base} className="flex shrink-0 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-horizontal.png" alt="Montalbano Elicona" className="h-7 w-auto sm:h-8" />
        </Link>

        {/* Nav desktop */}
        <nav className="hidden flex-1 items-center justify-end gap-1 xl:flex xl:gap-2">
          {links.map((l) => {
            const active = pathname?.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
                  active ? "bg-brand-700 text-cream" : "text-brand-800 hover:bg-brand-100"
                }`}
              >
                <l.Icon className="h-4 w-4" />
                <span>{l.label}</span>
              </Link>
            );
          })}
          <LocaleSwitcher current={locale} />
        </nav>

        {/* Toggle mobile */}
        <div className="flex items-center gap-2 xl:hidden">
          <LocaleSwitcher current={locale} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Chiudi menu" : "Apri menu"}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-brand-800 transition-colors hover:bg-brand-100"
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>

      {/* Menu mobile a tendina */}
      <nav
        className={`overflow-hidden border-t border-brand-200/70 bg-cream transition-[max-height] duration-300 ease-out xl:hidden ${
          open ? "max-h-96" : "max-h-0 border-t-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-4 py-3">
          {links.map((l) => {
            const active = pathname?.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                  active ? "bg-brand-700 text-cream" : "text-brand-800 hover:bg-brand-100"
                }`}
              >
                <l.Icon className="h-5 w-5" />
                <span>{l.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
