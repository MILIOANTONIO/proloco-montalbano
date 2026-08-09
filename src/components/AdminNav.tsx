"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/homepage", label: "Home page" },
  { href: "/admin/poi", label: "Punti di interesse" },
  { href: "/admin/news", label: "News" },
  { href: "/admin/eventi", label: "Eventi" },
  { href: "/admin/attivita", label: "Attività locali" },
  { href: "/admin/info", label: "Info utili" },
  { href: "/admin/qrcodes", label: "QR Code" },
  { href: "/admin/push", label: "Notifiche push" },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") return null;

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <nav className="flex flex-wrap gap-4 text-sm">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`hover:text-gray-900 ${pathname === l.href ? "font-semibold text-gray-900" : "text-gray-500"}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-900">
          Esci
        </button>
      </div>
    </header>
  );
}
