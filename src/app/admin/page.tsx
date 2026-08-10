import Link from "next/link";
import { prisma } from "@/lib/prisma";
import VisitsChart from "@/components/admin/VisitsChart";
import StatBars from "@/components/admin/StatBars";
import CollapsibleCard from "@/components/admin/CollapsibleCard";

export const dynamic = "force-dynamic";

const LOCALE_LABELS: Record<string, string> = { it: "Italiano", en: "Inglese", es: "Spagnolo", fr: "Francese" };

function simplifyPath(path: string) {
  const parts = path.split("/").filter(Boolean);
  parts.shift(); // rimuove il locale (it/en/es/fr)
  return "/" + (parts.join("/") || "");
}

async function getStats() {
  const now = new Date();
  // Confronti in UTC (non ora locale del processo) per allinearsi a strftime/toISOString,
  // che sono sempre UTC — altrimenti su un server con fuso diverso da UTC i conteggi
  // giornalieri si sfasano di un giorno.
  const startToday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const start7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const start14 = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 13));
  const start30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [viewsToday, views7d, views30d, viewsTotal, dailyRaw, topPagesRaw, localeRaw] = await Promise.all([
    prisma.pageView.count({ where: { createdAt: { gte: startToday } } }),
    prisma.pageView.count({ where: { createdAt: { gte: start7 } } }),
    prisma.pageView.count({ where: { createdAt: { gte: start30 } } }),
    prisma.pageView.count(),
    prisma.$queryRaw<{ day: string; count: bigint }[]>`
      SELECT strftime('%Y-%m-%d', "createdAt" / 1000, 'unixepoch') as day, COUNT(*) as count
      FROM "PageView"
      WHERE "createdAt" >= ${start14.getTime()}
      GROUP BY day
      ORDER BY day ASC
    `,
    prisma.pageView.groupBy({
      by: ["path"],
      where: { createdAt: { gte: start30 } },
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 8,
    }),
    prisma.pageView.groupBy({
      by: ["locale"],
      where: { createdAt: { gte: start30 } },
      _count: { locale: true },
      orderBy: { _count: { locale: "desc" } },
    }),
  ]);

  const dailyMap = new Map(dailyRaw.map((r) => [r.day, Number(r.count)]));
  const daily: { label: string; count: number }[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(start14.getTime() + i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    daily.push({ label: `${String(d.getUTCDate()).padStart(2, "0")}/${String(d.getUTCMonth() + 1).padStart(2, "0")}`, count: dailyMap.get(key) ?? 0 });
  }

  const topPages = topPagesRaw.map((r) => ({ label: simplifyPath(r.path), count: r._count.path }));
  const localeBreakdown = localeRaw.map((r) => ({ label: LOCALE_LABELS[r.locale] ?? r.locale, count: r._count.locale }));

  return { viewsToday, views7d, views30d, viewsTotal, daily, topPages, localeBreakdown };
}

export default async function AdminDashboard() {
  const [poiCount, newsCount, eventCount, activityCount, infoCount, subCount, stats] = await Promise.all([
    prisma.pointOfInterest.count(),
    prisma.newsPost.count(),
    prisma.eventItem.count(),
    prisma.activity.count(),
    prisma.infoContact.count(),
    prisma.pushSubscription.count(),
    getStats(),
  ]);

  const cards = [
    { href: "/admin/homepage", label: "Home page", count: null, hint: "foto in evidenza, ordine sezioni" },
    { href: "/admin/poi", label: "Punti di interesse", count: poiCount, hint: "max 15 previsti dall'offerta" },
    { href: "/admin/news", label: "News", count: newsCount },
    { href: "/admin/eventi", label: "Eventi", count: eventCount },
    { href: "/admin/attivita", label: "Attività locali", count: activityCount, hint: "ristoranti, B&B, cantine, botteghe..." },
    { href: "/admin/info", label: "Info utili", count: infoCount },
    { href: "/admin/qrcodes", label: "QR Code", count: null },
    { href: "/admin/push", label: "Iscritti notifiche push", count: subCount },
  ];

  const kpis = [
    { label: "Oggi", count: stats.viewsToday },
    { label: "Ultimi 7 giorni", count: stats.views7d },
    { label: "Ultimi 30 giorni", count: stats.views30d },
    { label: "Totale", count: stats.viewsTotal },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Statistiche di visita</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-xl border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-500">{k.label}</p>
              <p className="mt-1 text-2xl font-bold text-gray-800">{k.count}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CollapsibleCard title="Visite giornaliere" subtitle="Ultimi 14 giorni">
              {stats.viewsTotal === 0 ? (
                <p className="py-8 text-center text-sm text-gray-400">Nessuna visita registrata ancora.</p>
              ) : (
                <VisitsChart data={stats.daily} />
              )}
            </CollapsibleCard>
          </div>
          <CollapsibleCard title="Lingue" subtitle="Ultimi 30 giorni">
            {stats.localeBreakdown.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400">Nessun dato.</p>
            ) : (
              <StatBars items={stats.localeBreakdown} />
            )}
          </CollapsibleCard>
        </div>

        <div className="mt-4">
          <CollapsibleCard title="Pagine più visitate" subtitle="Ultimi 30 giorni" defaultOpen={false}>
            {stats.topPages.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400">Nessun dato.</p>
            ) : (
              <StatBars items={stats.topPages} />
            )}
          </CollapsibleCard>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Sezioni</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {cards.map((c) => (
            <Link key={c.href} href={c.href} className="rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-400">
              <p className="text-sm text-gray-500">{c.label}</p>
              {c.count !== null && <p className="mt-1 text-2xl font-bold text-gray-800">{c.count}</p>}
              {c.hint && <p className="mt-1 text-xs text-gray-400">{c.hint}</p>}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
