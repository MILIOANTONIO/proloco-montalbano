import { prisma } from "@/lib/prisma";
import { getDictionary } from "@/lib/i18n";
import { infoCategoryIcons, ContactIcon, PhoneIcon, PinIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

const categories = ["emergenza", "farmacia", "ufficio", "altro"] as const;

export default async function InfoPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);

  const contacts = await prisma.infoContact.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });

  const grouped = categories
    .map((cat) => ({ cat, label: t.info[cat], items: contacts.filter((c) => c.category === cat) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-brand-900 dark:text-brand-100">{t.info.title}</h1>

      {grouped.length === 0 ? (
        <p className="text-brand-600 dark:text-brand-300">{t.info.empty}</p>
      ) : (
        grouped.map((g) => {
          const CatIcon = infoCategoryIcons[g.cat] ?? ContactIcon;
          return (
            <section key={g.cat}>
              <div className="mb-3 flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-700 text-cream">
                  <CatIcon className="h-4 w-4" />
                </span>
                <h2 className="font-display text-lg font-bold text-brand-800 dark:text-brand-200">{g.label}</h2>
              </div>
              <ul className="space-y-3">
                {g.items.map((item) => (
                  <li key={item.id} className="rounded-3xl bg-white dark:bg-brand-900 p-4 shadow-sm">
                    <p className="font-semibold text-brand-900 dark:text-brand-100">{item.name}</p>
                    {item.phone && (
                      <a href={`tel:${item.phone.replace(/\s/g, "")}`} className="mt-1 flex items-center gap-1.5 text-sm text-brand-600 dark:text-brand-300 hover:text-brand-800">
                        <PhoneIcon className="h-4 w-4" /> {item.phone}
                      </a>
                    )}
                    {item.address && (
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-brand-600 dark:text-brand-300">
                        <PinIcon className="h-4 w-4" /> {item.address}
                      </p>
                    )}
                    {item.notes && <p className="mt-1 text-sm text-brand-500 dark:text-brand-400">{item.notes}</p>}
                  </li>
                ))}
              </ul>
            </section>
          );
        })
      )}
    </div>
  );
}
