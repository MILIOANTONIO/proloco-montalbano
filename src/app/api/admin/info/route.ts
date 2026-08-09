import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendPushToAll } from "@/lib/push";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const items = await prisma.infoContact.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body?.category || !body?.name) {
    return NextResponse.json({ error: "Categoria e nome obbligatori" }, { status: 400 });
  }
  const item = await prisma.infoContact.create({
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
    title: "Nuova informazione utile",
    body: item.name,
    url: "/it/info",
  });

  return NextResponse.json(item);
}
