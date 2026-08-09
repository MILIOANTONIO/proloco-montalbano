import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [poiCount, newsCount, eventCount, activityCount, infoCount, subCount] = await Promise.all([
    prisma.pointOfInterest.count(),
    prisma.newsPost.count(),
    prisma.eventItem.count(),
    prisma.activity.count(),
    prisma.infoContact.count(),
    prisma.pushSubscription.count(),
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

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-400">
            <p className="text-sm text-gray-500">{c.label}</p>
            {c.count !== null && <p className="mt-1 text-2xl font-bold text-gray-800">{c.count}</p>}
            {c.hint && <p className="mt-1 text-xs text-gray-400">{c.hint}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
