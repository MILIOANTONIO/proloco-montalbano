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
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full min-w-[600px] text-sm">
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
