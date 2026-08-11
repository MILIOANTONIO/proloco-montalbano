import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getSiteSettings } from "@/lib/settings";
import { renderPosterPng, pngToA4Pdf } from "@/lib/qr-poster";

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const targetUrl = req.nextUrl.searchParams.get("url");
  const format = req.nextUrl.searchParams.get("format") === "pdf" ? "pdf" : "png";
  const filename = req.nextUrl.searchParams.get("filename") || "poster-qr";
  const label = req.nextUrl.searchParams.get("label") || undefined;
  if (!targetUrl) return NextResponse.json({ error: "Parametro url mancante" }, { status: 400 });

  const settings = await getSiteSettings();
  if (!settings.qrTemplateImage) {
    return NextResponse.json({ error: "Nessun template caricato" }, { status: 400 });
  }

  try {
    const png = await renderPosterPng(
      settings.qrTemplateImage,
      { left: settings.qrBoxLeft, top: settings.qrBoxTop, width: settings.qrBoxWidth, height: settings.qrBoxHeight },
      targetUrl,
      label
    );

    if (format === "pdf") {
      const pdf = await pngToA4Pdf(png);
      return new NextResponse(new Uint8Array(pdf), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${filename}.pdf"`,
        },
      });
    }

    return new NextResponse(new Uint8Array(png), {
      headers: { "Content-Type": "image/png", "Cache-Control": "no-store" },
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
