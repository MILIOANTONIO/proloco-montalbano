import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminNewsListPage() {
  const posts = await prisma.newsPost.findMany({
    orderBy: { publishedAt: "desc" },
    include: { translations: { where: { locale: "it" } } },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-gray-800">News</h1>
        <Link href="/admin/news/new" className="rounded bg-gray-800 px-4 py-2 text-sm font-medium text-white">
          + Nuova news
        </Link>
      </div>

      {/* Mobile: schede impilate */}
      <div className="space-y-3 sm:hidden">
        {posts.map((p) => (
          <div key={p.id} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-medium text-gray-800">{p.translations[0]?.title || "(senza titolo)"}</p>
                <p className="text-xs text-gray-500">{new Date(p.publishedAt).toLocaleDateString("it-IT")}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2 py-1 text-xs ${p.published ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {p.published ? "Pubblicato" : "Bozza"}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-4 text-sm">
              <Link href={`/admin/news/${p.id}`} className="text-gray-600 hover:underline">
                Modifica
              </Link>
              <DeleteButton url={`/api/admin/news/${p.id}`} />
            </div>
          </div>
        ))}
        {posts.length === 0 && <p className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-400">Nessuna news creata.</p>}
      </div>

      {/* Desktop: tabella */}
      <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white sm:block">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-2">Data</th>
              <th className="px-4 py-2">Titolo (IT)</th>
              <th className="px-4 py-2">Stato</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="border-t border-gray-100">
                <td className="px-4 py-2 text-gray-500">{new Date(p.publishedAt).toLocaleDateString("it-IT")}</td>
                <td className="px-4 py-2 font-medium text-gray-800">{p.translations[0]?.title || "(senza titolo)"}</td>
                <td className="px-4 py-2">{p.published ? "Pubblicato" : "Bozza"}</td>
                <td className="px-4 py-2 text-right">
                  <Link href={`/admin/news/${p.id}`} className="mr-3 text-gray-600 hover:underline">
                    Modifica
                  </Link>
                  <DeleteButton url={`/api/admin/news/${p.id}`} />
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                  Nessuna news creata.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
