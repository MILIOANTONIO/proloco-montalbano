import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminEventiListPage() {
  const events = await prisma.eventItem.findMany({
    orderBy: { startDate: "asc" },
    include: { translations: { where: { locale: "it" } } },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-gray-800">Eventi</h1>
        <Link href="/admin/eventi/new" className="rounded bg-gray-800 px-4 py-2 text-sm font-medium text-white">
          + Nuovo evento
        </Link>
      </div>

      {/* Mobile: schede impilate */}
      <div className="space-y-3 sm:hidden">
        {events.map((ev) => (
          <div key={ev.id} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium text-gray-800">{ev.translations[0]?.title || "(senza titolo)"}</p>
                <p className="text-xs text-gray-500">
                  {new Date(ev.startDate).toLocaleDateString("it-IT")}
                  {ev.location ? ` · ${ev.location}` : ""}
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-1 text-xs ${ev.published ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {ev.published ? "Pubblicato" : "Bozza"}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-4 text-sm">
              <Link href={`/admin/eventi/${ev.id}`} className="text-gray-600 hover:underline">
                Modifica
              </Link>
              <DeleteButton url={`/api/admin/eventi/${ev.id}`} />
            </div>
          </div>
        ))}
        {events.length === 0 && <p className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-400">Nessun evento creato.</p>}
      </div>

      {/* Desktop: tabella */}
      <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white sm:block">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-2">Data</th>
              <th className="px-4 py-2">Titolo (IT)</th>
              <th className="px-4 py-2">Luogo</th>
              <th className="px-4 py-2">Stato</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {events.map((ev) => (
              <tr key={ev.id} className="border-t border-gray-100">
                <td className="px-4 py-2 text-gray-500">{new Date(ev.startDate).toLocaleDateString("it-IT")}</td>
                <td className="px-4 py-2 font-medium text-gray-800">{ev.translations[0]?.title || "(senza titolo)"}</td>
                <td className="px-4 py-2 text-gray-500">{ev.location}</td>
                <td className="px-4 py-2">{ev.published ? "Pubblicato" : "Bozza"}</td>
                <td className="px-4 py-2 text-right">
                  <Link href={`/admin/eventi/${ev.id}`} className="mr-3 text-gray-600 hover:underline">
                    Modifica
                  </Link>
                  <DeleteButton url={`/api/admin/eventi/${ev.id}`} />
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                  Nessun evento creato.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
