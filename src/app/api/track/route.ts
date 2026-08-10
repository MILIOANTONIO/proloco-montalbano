import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { locales } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const path = typeof body?.path === "string" ? body.path.slice(0, 300) : null;
  if (!path || !path.startsWith("/")) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  const firstSegment = path.split("/")[1];
  const locale = (locales as readonly string[]).includes(firstSegment) ? firstSegment : "it";

  await prisma.pageView.create({ data: { path, locale } });
  return NextResponse.json({ ok: true });
}
