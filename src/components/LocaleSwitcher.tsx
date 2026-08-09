"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, localeNames, type Locale } from "@/lib/i18n";

export default function LocaleSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(locale: string) {
    const rest = pathname.split("/").slice(2).join("/");
    router.push(`/${locale}${rest ? `/${rest}` : ""}`);
  }

  return (
    <select
      value={current}
      onChange={(e) => switchTo(e.target.value)}
      className="ml-1 shrink-0 cursor-pointer rounded-full border border-brand-300 bg-white px-2.5 py-1.5 text-sm text-brand-900 transition-colors hover:border-brand-500"
      aria-label="Lingua / Language"
    >
      {locales.map((l) => (
        <option key={l} value={l}>
          {localeNames[l]}
        </option>
      ))}
    </select>
  );
}
