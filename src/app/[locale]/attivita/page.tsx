import { prisma } from "@/lib/prisma";
import { getDictionary, defaultLocale } from "@/lib/i18n";
import ActivityGrid, { type ActivityCard } from "@/components/ActivityGrid";

export const dynamic = "force-dynamic";

function pickDescription(translations: { locale: string; description: string }[], locale: string) {
  return (
    translations.find((t) => t.locale === locale && t.description.trim())?.description ||
    translations.find((t) => t.locale === defaultLocale && t.description.trim())?.description ||
    translations.find((t) => t.description.trim())?.description ||
    ""
  );
}

export default async function AttivitaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);

  const activities = await prisma.activity.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
    include: { translations: true },
  });

  const cards: ActivityCard[] = activities.map((a) => ({
    id: a.id,
    categories: a.categories.split(",").filter(Boolean),
    name: a.name,
    address: a.address,
    phone: a.phone,
    website: a.website,
    coverImage: a.coverImage,
    description: pickDescription(a.translations, locale),
  }));

  return (
    <div className="space-y-6">
      <div className="max-w-2xl">
        <h1 className="font-display text-3xl font-bold text-brand-900 dark:text-brand-100">{t.attivita.title}</h1>
        <p className="mt-2 text-brand-700 dark:text-brand-300">{t.attivita.intro}</p>
      </div>

      {cards.length === 0 ? (
        <p className="text-brand-600 dark:text-brand-300">{t.attivita.empty}</p>
      ) : (
        <ActivityGrid
          activities={cards}
          categoryLabels={t.attivita.categories}
          filterAllLabel={t.poi.filterAll}
          directionsLabel={t.poi.directions}
          websiteLabel={t.attivita.website}
        />
      )}
    </div>
  );
}
