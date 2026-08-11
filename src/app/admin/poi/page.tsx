import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminPoiListPage() {
  const pois = await prisma.pointOfInterest.findMany({
    orderBy: { order: "asc" },
    include: { translations: { where: { locale: "it" } } },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-gray-800">Punti di interesse ({pois.length}/15)</h1>
        <Link
          href="/admin/poi/new"
          className={`rounded px-4 py-2 text-sm font-medium text-white ${pois.length >= 15 ? "pointer-events-none bg-gray-300" : "bg-gray-800"}`}
        >
          + Nuovo punto
        </Link>
      </div>

      {/* Mobile: schede impilate */}
      <div className="space-y-3 sm:hidden">
        {pois.map((poi) => (
          <div key={poi.id} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium text-gray-800">{poi.translations[0]?.title || poi.slug}</p>
                <p className="text-xs text-gray-500">
                  #{poi.order} · {poi.category}
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-1 text-xs ${poi.published ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {poi.published ? "Pubblicato" : "Bozza"}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-4 text-sm">
              <Link href={`/admin/poi/${poi.id}`} className="text-gray-600 hover:underline">
                Modifica
              </Link>
              <DeleteButton url={`/api/admin/poi/${poi.id}`} />
            </div>
          </div>
        ))}
        {pois.length === 0 && (
          <p className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-400">Nessun punto di interesse creato.</p>
        )}
      </div>

      {/* Desktop: tabella */}
      <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white sm:block">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-2">Ordine</th>
              <th className="px-4 py-2">Titolo (IT)</th>
              <th className="px-4 py-2">Categoria</th>
              <th className="px-4 py-2">Stato</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {pois.map((poi) => (
              <tr key={poi.id} className="border-t border-gray-100">
                <td className="px-4 py-2">{poi.order}</td>
                <td className="px-4 py-2 font-medium text-gray-800">{poi.translations[0]?.title || poi.slug}</td>
                <td className="px-4 py-2 text-gray-500">{poi.category}</td>
                <td className="px-4 py-2">{poi.published ? "Pubblicato" : "Bozza"}</td>
                <td className="px-4 py-2 text-right">
                  <Link href={`/admin/poi/${poi.id}`} className="mr-3 text-gray-600 hover:underline">
                    Modifica
                  </Link>
                  <DeleteButton url={`/api/admin/poi/${poi.id}`} />
                </td>
              </tr>
            ))}
            {pois.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                  Nessun punto di interesse creato.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
