import { prisma } from "@/lib/prisma";
import DeleteButton from "@/components/admin/DeleteButton";
import HandledToggle from "@/components/admin/HandledToggle";

export const dynamic = "force-dynamic";

export default async function AdminSegnalazioniPage() {
  const reports = await prisma.activityReport.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Segnalazioni ({reports.length})</h1>
        <p className="text-sm text-gray-500">Attività mancanti o correzioni segnalate dai visitatori tramite il sito pubblico.</p>
      </div>

      <div className="space-y-3">
        {reports.map((r) => (
          <div key={r.id} className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${r.type === "edit" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"}`}>
                    {r.type === "edit" ? "Correzione" : "Nuova attività"}
                  </span>
                  <p className="font-semibold text-gray-800">{r.activityName}</p>
                </div>
                {r.categories && <p className="mt-1 text-xs text-gray-500">{r.categories.split(",").join(", ")}</p>}
              </div>
              <HandledToggle id={r.id} handled={r.handled} />
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="space-y-2">
                <p className="whitespace-pre-wrap text-sm text-gray-700">{r.notes}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                  {r.address && <span>📍 {r.address}</span>}
                  {r.phone && <span>☎ {r.phone}</span>}
                  {r.website && <span>🔗 {r.website}</span>}
                </div>
                <div className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
                  Da <strong>{r.reporterName}</strong> — {r.reporterEmail}
                  {r.reporterPhone ? ` — ${r.reporterPhone}` : ""}
                  <span className="ml-2 text-gray-400">{new Date(r.createdAt).toLocaleString("it-IT")}</span>
                </div>
              </div>
              {r.photo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.photo} alt="" className="h-24 w-24 shrink-0 rounded-lg object-cover sm:h-28 sm:w-28" />
              )}
            </div>

            <div className="mt-3">
              <DeleteButton url={`/api/admin/segnalazioni/${r.id}`} />
            </div>
          </div>
        ))}
        {reports.length === 0 && (
          <p className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-400">Nessuna segnalazione ricevuta.</p>
        )}
      </div>
    </div>
  );
}
