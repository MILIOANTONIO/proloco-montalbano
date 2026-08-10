import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getDictionary, pickTranslation, pickChapterTranslation } from "@/lib/i18n";
import { ChevronLeftIcon, SpeakerIcon, VideoIcon, categoryIcons, LandmarkIcon } from "@/components/icons";
import ExpandableText from "@/components/ExpandableText";
import DirectionsButton from "@/components/DirectionsButton";

export const dynamic = "force-dynamic";

export default async function PoiDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = getDictionary(locale);

  const poi = await prisma.pointOfInterest.findUnique({
    where: { slug },
    include: { translations: true, chapters: { orderBy: { order: "asc" }, include: { translations: true } } },
  });

  if (!poi || !poi.published) notFound();

  const tr = pickTranslation(poi.translations, locale);
  if (!tr) notFound();

  const Icon = categoryIcons[poi.category] ?? LandmarkIcon;
  const categoryLabel = t.poi.categories[poi.category] ?? poi.category;

  return (
    <article className="mx-auto max-w-2xl space-y-6">
      <div className="relative flex h-72 w-full items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-brand-100 to-olive-400/30 shadow-soft sm:h-96">
        {poi.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poi.coverImage} alt={tr.title} className="h-full w-full object-cover" />
        ) : (
          <Icon className="h-16 w-16 text-brand-500 dark:text-brand-400" />
        )}
        <Link
          href={`/${locale}/percorso`}
          aria-label={t.poi.backToList}
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 dark:bg-brand-900/90 text-brand-800 dark:text-brand-200 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </Link>
      </div>

      <div className="space-y-3">
        <h1 className="font-display text-3xl font-bold text-brand-900 dark:text-brand-100">{tr.title}</h1>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 dark:bg-brand-800 px-3 py-1.5 text-xs font-medium text-brand-800 dark:text-brand-200">
            <Icon className="h-4 w-4" />
            {categoryLabel}
          </span>
          {tr.audioUrl && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 dark:bg-brand-800 px-3 py-1.5 text-xs font-medium text-brand-800 dark:text-brand-200">
              <SpeakerIcon className="h-4 w-4" />
              {t.poi.hasAudio}
            </span>
          )}
          {tr.videoUrl && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 dark:bg-brand-800 px-3 py-1.5 text-xs font-medium text-brand-800 dark:text-brand-200">
              <VideoIcon className="h-4 w-4" />
              {t.poi.hasVideo}
            </span>
          )}
        </div>
      </div>

      <DirectionsButton label={t.poi.directions} title={tr.title} lat={poi.lat} lng={poi.lng} />

      <ExpandableText text={tr.description} readMoreLabel={t.poi.readMore} readLessLabel={t.poi.readLess} />

      {tr.audioUrl && (
        <div className="rounded-2xl border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-900 p-4">
          <p className="mb-2 text-sm font-medium text-brand-700 dark:text-brand-300">{t.poi.audio}</p>
          <audio controls src={tr.audioUrl} className="w-full" />
        </div>
      )}

      {tr.videoUrl && (
        <div className="rounded-2xl border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-900 p-4">
          <p className="mb-2 text-sm font-medium text-brand-700 dark:text-brand-300">{t.poi.video}</p>
          <video controls src={tr.videoUrl} className="w-full rounded-xl" />
        </div>
      )}

      {poi.chapters.map((chapter) => {
        const ctr = pickChapterTranslation(chapter.translations, locale);
        if (!ctr || (!ctr.heading.trim() && !ctr.text.trim())) return null;
        return (
          <section key={chapter.id} className="space-y-3 border-t border-brand-200 dark:border-brand-700 pt-6">
            {chapter.imageUrl && (
              <div className="flex max-h-[420px] w-full items-center justify-center overflow-hidden rounded-2xl bg-brand-100 dark:bg-brand-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={chapter.imageUrl} alt={ctr.heading} className="max-h-[420px] w-full object-contain" />
              </div>
            )}
            {ctr.heading && <h2 className="font-display text-2xl font-bold text-brand-900 dark:text-brand-100">{ctr.heading}</h2>}
            {ctr.text && <ExpandableText text={ctr.text} readMoreLabel={t.poi.readMore} readLessLabel={t.poi.readLess} />}
            {ctr.audioUrl && (
              <div className="rounded-2xl border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-900 p-4">
                <p className="mb-2 text-sm font-medium text-brand-700 dark:text-brand-300">{t.poi.audio}</p>
                <audio controls src={ctr.audioUrl} className="w-full" />
              </div>
            )}
            {ctr.videoUrl && (
              <div className="rounded-2xl border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-900 p-4">
                <p className="mb-2 text-sm font-medium text-brand-700 dark:text-brand-300">{t.poi.video}</p>
                <video controls src={ctr.videoUrl} className="w-full rounded-xl" />
              </div>
            )}
          </section>
        );
      })}
    </article>
  );
}
