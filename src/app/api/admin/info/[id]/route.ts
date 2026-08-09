import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendPushToAll } from "@/lib/push";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Corpo richiesta non valido" }, { status: 400 });

  const item = await prisma.infoContact.update({
    where: { id },
    data: {
      category: body.category,
      name: body.name,
      phone: body.phone || null,
      address: body.address || null,
      notes: body.notes || null,
      order: body.order ?? 0,
    },
  });

  await sendPushToAll({
    title: "Informazione aggiornata",
    body: item.name,
    url: "/it/info",
  });

  return NextResponse.json(item);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const { id } = await params;
  await prisma.infoContact.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
