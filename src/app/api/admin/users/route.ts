import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const users = await prisma.adminUser.findMany({ select: { id: true, email: true, createdAt: true }, orderBy: { createdAt: "asc" } });
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");

  if (!email || !password) return NextResponse.json({ error: "Email e password obbligatorie" }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "La password deve avere almeno 8 caratteri" }, { status: 400 });

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Esiste già un utente con questa email" }, { status: 400 });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.adminUser.create({ data: { email, passwordHash } });
  return NextResponse.json({ id: user.id, email: user.email, createdAt: user.createdAt });
}
