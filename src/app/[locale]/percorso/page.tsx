import { prisma } from "@/lib/prisma";
import { getDictionary, pickTranslation } from "@/lib/i18n";
import PercorsoGrid, { type PercorsoCard } from "@/components/PercorsoGrid";

export const dynamic = "force-dynamic";

export default async function PercorsoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);

  const pois = await prisma.pointOfInterest.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
    include: { translations: true },
  });

  const cards: PercorsoCard[] = pois
    .map((poi) => {
      const tr = pickTranslation(poi.translations, locale);
      if (!tr) return null;
      return { id: poi.id, slug: poi.slug, category: poi.category, coverImage: poi.coverImage, title: tr.title };
    })
    .filter((c): c is PercorsoCard => c !== null);

  return (
    <div className="space-y-6">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-brand-900">{t.percorso.title}</h1>
        <p className="mt-2 text-brand-700">{t.percorso.intro}</p>
      </div>

      {cards.length === 0 ? (
        <p className="text-brand-600">{t.percorso.empty}</p>
      ) : (
        <PercorsoGrid locale={locale} pois={cards} categoryLabels={t.poi.categories} filterAllLabel={t.poi.filterAll} />
      )}
    </div>
  );
}
