import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Endpoint pubblico: chiunque visiti /attivita puo' segnalare un'attivita' mancante
// o proporre una correzione, senza bisogno di login.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Corpo richiesta non valido" }, { status: 400 });

  const type = body.type === "edit" ? "edit" : "missing";
  const activityName = String(body.activityName || "").trim();
  const notes = String(body.notes || "").trim();
  const reporterName = String(body.reporterName || "").trim();
  const reporterEmail = String(body.reporterEmail || "").trim();

  if (!activityName || !notes || !reporterName || !reporterEmail) {
    return NextResponse.json({ error: "Compila i campi obbligatori" }, { status: 400 });
  }

  const report = await prisma.activityReport.create({
    data: {
      type,
      activityId: type === "edit" ? String(body.activityId || "") || null : null,
      activityName,
      categories: body.categories ? String(body.categories) : null,
      address: body.address ? String(body.address) : null,
      phone: body.phone ? String(body.phone) : null,
      website: body.website ? String(body.website) : null,
      notes,
      photo: body.photo ? String(body.photo) : null,
      reporterName,
      reporterEmail,
      reporterPhone: body.reporterPhone ? String(body.reporterPhone) : null,
    },
  });

  return NextResponse.json({ ok: true, id: report.id });
}
