import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const currentPassword = String(body?.currentPassword || "");
  const newPassword = String(body?.newPassword || "");
  if (!currentPassword || !newPassword) return NextResponse.json({ error: "Compila entrambi i campi" }, { status: 400 });
  if (newPassword.length < 8) return NextResponse.json({ error: "La nuova password deve avere almeno 8 caratteri" }, { status: 400 });

  const me = await prisma.adminUser.findUnique({ where: { id: session.sub } });
  if (!me) return NextResponse.json({ error: "Utente non trovato" }, { status: 404 });

  const valid = await bcrypt.compare(currentPassword, me.passwordHash);
  if (!valid) return NextResponse.json({ error: "Password attuale errata" }, { status: 401 });

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.adminUser.update({ where: { id: me.id }, data: { passwordHash } });
  return NextResponse.json({ ok: true });
}
