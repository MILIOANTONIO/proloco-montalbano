import QRCode from "qrcode";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminQrCodesPage() {
  const pois = await prisma.pointOfInterest.findMany({
    orderBy: { order: "asc" },
    include: { translations: { where: { locale: "it" } } },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const items = await Promise.all(
    pois.map(async (poi) => {
      const targetUrl = `${siteUrl}/it/percorso/${poi.slug}`;
      const dataUrl = await QRCode.toDataURL(targetUrl, { width: 400, margin: 1 });
      return { poi, targetUrl, dataUrl };
    })
  );

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-800">QR Code punti di interesse</h1>
      <p className="text-sm text-gray-500">
        Ogni QR Code apre direttamente la scheda del punto di interesse. Stampali e posizionali sul posto (targa, pannello, adesivo).
      </p>

      {items.length === 0 ? (
        <p className="text-gray-400">Crea prima almeno un punto di interesse.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {items.map(({ poi, targetUrl, dataUrl }) => (
            <div key={poi.id} className="rounded-xl border border-gray-200 bg-white p-4 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={dataUrl} alt={poi.translations[0]?.title || poi.slug} className="mx-auto" />
              <p className="mt-2 text-sm font-medium text-gray-800">{poi.translations[0]?.title || poi.slug}</p>
              <p className="mt-1 truncate text-xs text-gray-400">{targetUrl}</p>
              <a href={dataUrl} download={`qr-${poi.slug}.png`} className="mt-2 inline-block text-sm text-gray-600 hover:underline">
                Scarica PNG
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
