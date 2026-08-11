import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const report = await prisma.activityReport.update({ where: { id }, data: { handled: !!body?.handled } });
  return NextResponse.json(report);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const { id } = await params;
  await prisma.activityReport.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
