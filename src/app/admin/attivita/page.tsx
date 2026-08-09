import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminActivitiesPage() {
  const activities = await prisma.activity.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }] });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Attività locali ({activities.length})</h1>
        <Link href="/admin/attivita/new" className="rounded bg-gray-800 px-4 py-2 text-sm font-medium text-white">
          + Nuova attività
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
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
