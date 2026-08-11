"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n";
import { cookieBannerContent } from "@/lib/cookie-banner-content";
import { getConsent, setConsent } from "@/lib/cookie-consent";

export default function CookieConsent({ locale }: { locale: Locale }) {
  const t = cookieBannerContent[locale];
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  useEffect(() => {
    setVisible(getConsent() === null);
  }, []);

  function acceptAll() {
    setConsent({ analytics: true });
    setVisible(false);
  }

  function necessaryOnly() {
    setConsent({ analytics: false });
    setVisible(false);
  }

  function savePrefs() {
    setConsent({ analytics });
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-brand-200 bg-cream/98 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] backdrop-blur-sm dark:border-brand-700 dark:bg-brand-900/98 sm:p-5">
      <div className="mx-auto max-w-3xl">
        {!customizing ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-brand-800 dark:text-brand-200">
              {t.message}{" "}
              <a href={`/${locale}/privacy`} className="underline decoration-brand-400 underline-offset-2">
                {t.privacyLink}
              </a>
            </p>
            <div className="flex shrink-0 flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCustomizing(true)}
                className="rounded-full border border-brand-300 px-4 py-2 text-sm font-medium text-brand-800 hover:bg-brand-100 dark:border-brand-600 dark:text-brand-200 dark:hover:bg-brand-800"
              >
                {t.customize}
              </button>
              <button
                type="button"
                onClick={necessaryOnly}
                className="rounded-full border border-brand-300 px-4 py-2 text-sm font-medium text-brand-800 hover:bg-brand-100 dark:border-brand-600 dark:text-brand-200 dark:hover:bg-brand-800"
              >
                {t.necessaryOnly}
              </button>
              <button type="button" onClick={acceptAll} className="rounded-full bg-brand-700 px-4 py-2 text-sm font-medium text-cream hover:bg-brand-800">
                {t.acceptAll}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3 rounded-xl border border-brand-200 p-3 dark:border-brand-700">
              <div>
                <p className="text-sm font-medium text-brand-900 dark:text-brand-100">{t.necessaryTitle}</p>
                <p className="text-xs text-brand-600 dark:text-brand-400">{t.necessaryDesc}</p>
              </div>
              <span className="shrink-0 rounded-full bg-brand-100 px-2.5 py-1 text-xs font-medium text-brand-700 dark:bg-brand-800 dark:text-brand-300">
                {t.alwaysOn}
              </span>
            </div>
            <label className="flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-brand-200 p-3 dark:border-brand-700">
              <span>
                <span className="block text-sm font-medium text-brand-900 dark:text-brand-100">{t.analyticsTitle}</span>
                <span className="block text-xs text-brand-600 dark:text-brand-400">{t.analyticsDesc}</span>
              </span>
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="mt-1 h-5 w-5 shrink-0 accent-brand-700"
              />
            </label>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCustomizing(false)}
                className="rounded-full border border-brand-300 px-4 py-2 text-sm font-medium text-brand-800 hover:bg-brand-100 dark:border-brand-600 dark:text-brand-200 dark:hover:bg-brand-800"
              >
                ←
              </button>
              <button type="button" onClick={savePrefs} className="rounded-full bg-brand-700 px-4 py-2 text-sm font-medium text-cream hover:bg-brand-800">
                {t.savePrefs}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
