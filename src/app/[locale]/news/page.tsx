import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getDictionary, pickTranslation } from "@/lib/i18n";

export const dynamic = "force-dynamic";

function formatDate(d: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "long", year: "numeric" }).format(d);
}

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);

  const posts = await prisma.newsPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: { translations: true },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-brand-900">{t.news.title}</h1>
      {posts.length === 0 ? (
        <p className="text-brand-600">{t.news.empty}</p>
      ) : (
        <ul className="space-y-3">
          {posts.map((p) => {
            const tr = pickTranslation(p.translations, locale);
            if (!tr) return null;
            return (
              <li key={p.id}>
                <Link
                  href={`/${locale}/news/${p.id}`}
                  className="flex items-center gap-4 rounded-3xl bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                >
                  {p.coverImage && (
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-brand-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.coverImage} alt="" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-olive-600">{formatDate(p.publishedAt, locale)}</p>
                    <p className="mt-1 font-display text-lg font-bold text-brand-900">{tr.title}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
