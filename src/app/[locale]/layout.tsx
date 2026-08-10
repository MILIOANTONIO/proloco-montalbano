import { isLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import NavBar from "@/components/NavBar";
import PwaRegister from "@/components/PwaRegister";
import IntroAnimation from "@/components/IntroAnimation";
import AudioCoordinator from "@/components/AudioCoordinator";
import PageViewTracker from "@/components/PageViewTracker";

export function generateStaticParams() {
  return [{ locale: "it" }, { locale: "en" }, { locale: "es" }, { locale: "fr" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  return (
    <>
      <PageViewTracker />
      <IntroAnimation />
      <AudioCoordinator />
      <PwaRegister />
      <NavBar locale={locale} />
      <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      <footer className="border-t border-brand-200 dark:border-brand-700 bg-brand-100/60 dark:bg-brand-800/60 px-4 py-8 text-center text-brand-700 dark:text-brand-300">
        <div className="flex items-center justify-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/stemma.png" alt="Stemma del Comune di Montalbano Elicona" className="h-10 w-auto shrink-0" />
          <span className="font-display text-sm font-bold uppercase tracking-wide text-brand-900 dark:text-brand-100">
            Comune di Montalbano Elicona
          </span>
        </div>
        <p className="mt-4 text-xs">
          © {new Date().getFullYear()} Pro Loco Montalbano Elicona APS — Piazza Maria SS della Provvidenza, 98065 Montalbano Elicona (ME)
        </p>
      </footer>
    </>
  );
}
