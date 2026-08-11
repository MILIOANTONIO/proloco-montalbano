import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Corpo richiesta non valido" }, { status: 400 });

  const data = {
    qrTemplateImage: body.qrTemplateImage || null,
    qrBoxLeft: Number(body.qrBoxLeft) || 0,
    qrBoxTop: Number(body.qrBoxTop) || 0,
    qrBoxWidth: Number(body.qrBoxWidth) || 1,
    qrBoxHeight: Number(body.qrBoxHeight) || 1,
  };

  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { id: "singleton", ...data },
  });

  return NextResponse.json(settings);
}
