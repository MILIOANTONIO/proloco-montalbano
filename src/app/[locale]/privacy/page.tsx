import { isLocale, type Locale } from "@/lib/i18n";
import { privacyContent } from "@/lib/privacy-content";
import { notFound } from "next/navigation";

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const content = privacyContent[locale];

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-brand-900 dark:text-brand-100 sm:text-3xl">{content.title}</h1>
        <p className="mt-1 text-xs uppercase tracking-wide text-brand-500 dark:text-brand-400">{content.updated}</p>
        <p className="mt-4 text-brand-700 dark:text-brand-300">{content.intro}</p>
      </div>

      <div className="space-y-6">
        {content.sections.map((s) => (
          <section key={s.heading} className="rounded-2xl border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-900 p-5">
            <h2 className="font-display text-lg font-semibold text-brand-900 dark:text-brand-100">{s.heading}</h2>
            <div className="mt-2 space-y-2 text-sm leading-relaxed text-brand-700 dark:text-brand-300">
              {s.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
