import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { locales } from "@/lib/i18n";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const { id } = await params;
  const activity = await prisma.activity.findUnique({ where: { id }, include: { translations: true } });
  if (!activity) return NextResponse.json({ error: "Non trovata" }, { status: 404 });
  return NextResponse.json(activity);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.categories) {
    return NextResponse.json({ error: "Nome e almeno un'etichetta obbligatori" }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.activity.update({
      where: { id },
      data: {
        categories: body.categories,
        name: body.name,
        address: body.address || null,
        phone: body.phone || null,
        website: body.website || null,
        order: body.order ?? 0,
        published: body.published ?? true,
        coverImage: body.coverImage || null,
      },
    }),
    ...locales.map((locale) =>
      prisma.activityTranslation.upsert({
        where: { activityId_locale: { activityId: id, locale } },
        update: { description: body.translations?.[locale]?.description || "" },
        create: { activityId: id, locale, description: body.translations?.[locale]?.description || "" },
      })
    ),
  ]);

  const activity = await prisma.activity.findUnique({ where: { id }, include: { translations: true } });
  return NextResponse.json(activity);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const { id } = await params;
  await prisma.activity.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
