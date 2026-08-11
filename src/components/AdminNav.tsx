"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/homepage", label: "Home page" },
  { href: "/admin/poi", label: "Punti di interesse" },
  { href: "/admin/news", label: "News" },
  { href: "/admin/eventi", label: "Eventi" },
  { href: "/admin/attivita", label: "Attività locali" },
  { href: "/admin/segnalazioni", label: "Segnalazioni" },
  { href: "/admin/info", label: "Info utili" },
  { href: "/admin/qrcodes", label: "QR Code" },
  { href: "/admin/push", label: "Notifiche push" },
  { href: "/admin/utenti", label: "Utenti" },
];

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

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (pathname === "/admin/login") return null;

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/admin" className="flex shrink-0 items-center gap-2 font-display font-bold text-gray-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-sm text-white">M</span>
          <span className="hidden sm:inline">Montalbano · Admin</span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden flex-1 items-center justify-end gap-1 lg:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  active ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <button
            onClick={logout}
            className="ml-2 rounded-full border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Esci
          </button>
        </nav>

        {/* Toggle mobile */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Chiudi menu" : "Apri menu"}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 lg:hidden"
        >
          <MenuIcon open={open} />
        </button>
      </div>

      {/* Menu mobile a tendina */}
      <nav
        className={`overflow-hidden border-t border-gray-200 bg-white transition-[max-height] duration-300 ease-out lg:hidden ${
          open ? "max-h-[28rem]" : "max-h-0 border-t-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-4 py-3">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-xl px-3 py-2.5 text-sm font-medium ${active ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"}`}
              >
                {l.label}
              </Link>
            );
          })}
          <button onClick={logout} className="mt-1 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-gray-500 hover:bg-gray-100">
            Esci
          </button>
        </div>
      </nav>
    </header>
  );
}
