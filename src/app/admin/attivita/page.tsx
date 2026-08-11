import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminActivitiesPage() {
  const activities = await prisma.activity.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-gray-800">Attività locali ({activities.length})</h1>
        <Link href="/admin/attivita/new" className="rounded bg-gray-800 px-4 py-2 text-sm font-medium text-white">
          + Nuova attività
        </Link>
      </div>

      {/* Mobile: schede impilate */}
      <div className="space-y-3 sm:hidden">
        {activities.map((a) => (
          <div key={a.id} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium text-gray-800">{a.name}</p>
                <p className="text-xs text-gray-500">
                  #{a.order} · {a.categories.split(",").join(", ")}
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-1 text-xs ${a.published ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {a.published ? "Pubblicato" : "Bozza"}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-4 text-sm">
              <Link href={`/admin/attivita/${a.id}`} className="text-gray-600 hover:underline">
                Modifica
              </Link>
              <DeleteButton url={`/api/admin/attivita/${a.id}`} />
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <p className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-400">Nessuna attività creata.</p>
        )}
      </div>

      {/* Desktop: tabella */}
      <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white sm:block">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-2">Ordine</th>
              <th className="px-4 py-2">Nome</th>
              <th className="px-4 py-2">Etichette</th>
              <th className="px-4 py-2">Stato</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {activities.map((a) => (
              <tr key={a.id} className="border-t border-gray-100">
                <td className="px-4 py-2">{a.order}</td>
                <td className="px-4 py-2 font-medium text-gray-800">{a.name}</td>
                <td className="px-4 py-2 text-gray-500">{a.categories.split(",").join(", ")}</td>
                <td className="px-4 py-2">{a.published ? "Pubblicato" : "Bozza"}</td>
                <td className="px-4 py-2 text-right">
                  <Link href={`/admin/attivita/${a.id}`} className="mr-3 text-gray-600 hover:underline">
                    Modifica
                  </Link>
                  <DeleteButton url={`/api/admin/attivita/${a.id}`} />
                </td>
              </tr>
            ))}
            {activities.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                  Nessuna attività creata.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
