import Link from "next/link";
import { getDictionary, pickTranslation, type Locale } from "@/lib/i18n";
import { getSiteSettings, getHeroSlides, parseSectionOrder, type HomepageSection } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import PushSubscribeButton from "@/components/PushSubscribeButton";
import HeroCarousel from "@/components/HeroCarousel";
import LatestFlash from "@/components/LatestFlash";
import { MapIcon, InfoIcon, CalendarIcon, NewspaperIcon, AwardIcon, PlayIcon } from "@/components/icons";
import ActivityBanner from "@/components/ActivityBanner";
import InstallPwaButton from "@/components/InstallPwaButton";

const RAIPLAY_URL =
  "https://www.raiplay.it/video/2015/02/Il-Borgo-dei-Borghi-Montalbano-Elicona-Messina---Kilimangiaro-del-22022015-5ac86b31-e331-4cd2-859c-3253f7be486e.html";

export const dynamic = "force-dynamic";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const base = `/${locale}`;
  const [settings, heroSlides] = await Promise.all([getSiteSettings(), getHeroSlides()]);
  const order = parseSectionOrder(settings.sectionOrder);

  const [latestNews, latestEvent] = await Promise.all([
    prisma.newsPost.findFirst({ where: { published: true }, orderBy: { publishedAt: "desc" }, include: { translations: true } }),
    prisma.eventItem.findFirst({ where: { published: true }, orderBy: { createdAt: "desc" }, include: { translations: true } }),
  ]);
  const flashItem = (() => {
    const newsDate = latestNews?.publishedAt;
    const eventDate = latestEvent?.createdAt;
    const pickNews = newsDate && (!eventDate || newsDate >= eventDate);
    if (pickNews && latestNews) {
      const tr = pickTranslation(latestNews.translations, locale);
      if (!tr) return null;
      return {
        id: `news-${latestNews.id}`,
        badgeLabel: t.flash.badge,
        title: tr.title,
        image: latestNews.coverImage,
        video: latestNews.coverVideo,
        href: `${base}/news/${latestNews.id}`,
      };
    }
    if (latestEvent) {
      const tr = pickTranslation(latestEvent.translations, locale);
      if (!tr) return null;
      return {
        id: `evento-${latestEvent.id}`,
        badgeLabel: t.flash.event,
        title: tr.title,
        image: latestEvent.coverImage,
        video: latestEvent.coverVideoMobile || latestEvent.coverVideoDesktop,
        href: `${base}/eventi`,
      };
    }
    return null;
  })();
  const visible: Record<HomepageSection, boolean> = {
    award: settings.showAward,
    about: settings.showAbout,
    cards: settings.showCards,
    attivita: settings.showAttivita,
    install: settings.showInstall,
  };

  const cards = [
    { href: `${base}/percorso`, label: t.nav.percorso, Icon: MapIcon, big: true, image: "/brand/castello/veduta-generale.jpg" },
    { href: `${base}/info`, label: t.nav.info, Icon: InfoIcon, image: "/brand/borgo/stradina.jpg" },
    { href: `${base}/eventi`, label: t.nav.eventi, Icon: CalendarIcon, image: "/brand/duomo/veduta-piazza.jpg" },
    { href: `${base}/news`, label: t.nav.news, Icon: NewspaperIcon, image: "/brand/castello/torre-avvistamento.jpg" },
  ];

  const sections: Record<HomepageSection, React.ReactNode> = {
    award: (
      <span className="inline-flex items-start gap-2 rounded-full bg-olive-400/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-olive-600 dark:text-olive-400">
        <AwardIcon className="h-4 w-4 shrink-0 mt-0.5" />
        {t.home.award}
      </span>
    ),
    about: (
      <section className="rounded-3xl border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-900 p-6 shadow-sm sm:p-8">
        <p className="text-[17px] leading-relaxed text-brand-900/90 dark:text-brand-100/90">{t.home.about}</p>
        <a
          href={RAIPLAY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-700 px-4 py-2.5 text-sm font-semibold text-cream transition-colors duration-200 hover:bg-brand-800"
        >
          <PlayIcon className="h-5 w-5" />
          {t.home.watchVideo}
        </a>
      </section>
    ),
    cards: (
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={`group relative flex aspect-[4/3] items-end overflow-hidden rounded-3xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
              c.big ? "col-span-2 lg:col-span-1" : "col-span-1"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-ink/10" />
            <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 dark:bg-brand-900/20 text-white backdrop-blur-sm">
              <c.Icon className="h-4.5 w-4.5" />
            </span>
            <span className="relative z-10 p-4 font-display text-lg font-bold leading-tight text-white drop-shadow-sm">
              {c.label}
            </span>
          </Link>
        ))}
      </section>
    ),
    attivita: (
      <ActivityBanner
        image={settings.attivitaBannerImage}
        videoMobile={settings.attivitaBannerVideoMobile}
        videoDesktop={settings.attivitaBannerVideoDesktop}
        title={t.home.attivitaTitle}
        subtitle={t.home.attivitaSubtitle}
        cta={t.home.attivitaCta}
        href={`${base}/attivita`}
      />
    ),
    install: (
      <section className="rounded-3xl bg-brand-100/60 dark:bg-brand-800/60 p-5 text-sm text-brand-800 dark:text-brand-200">
        <p>{t.home.installHint}</p>
        <InstallPwaButton label={t.home.installButton} />
      </section>
    ),
  };

  return (
    <div className="space-y-10">
      <HeroCarousel slides={heroSlides} />

      <section className="text-center">
        {visible.award && order.includes("award") && <div className="mb-3">{sections.award}</div>}
        <p className="font-display text-lg font-semibold tracking-wide text-brand-500 dark:text-brand-400">{t.home.welcome}</p>
        <h1 className="mt-1 font-display text-4xl font-extrabold tracking-tight text-brand-900 dark:text-brand-100 sm:text-5xl">{t.home.title}</h1>
        <p className="mx-auto mt-4 max-w-xl text-brand-800/90 dark:text-brand-200/90">{t.home.subtitle}</p>
      </section>

      {flashItem && (
        <LatestFlash
          id={flashItem.id}
          badgeLabel={flashItem.badgeLabel}
          title={flashItem.title}
          image={flashItem.image}
          video={flashItem.video}
          href={flashItem.href}
          dismissLabel={t.flash.dismiss}
        />
      )}

      {order
        .filter((key) => key !== "award" && visible[key])
        .map((key) => (
          <div key={key}>{sections[key]}</div>
        ))}

      <div className="mx-auto max-w-sm">
        <PushSubscribeButton locale={locale as Locale} />
      </div>
    </div>
  );
}
