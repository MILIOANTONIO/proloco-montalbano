import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { locales } from "@/lib/i18n";
import { buildChapterCreateInput } from "@/lib/poi-chapters";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const { id } = await params;
  const poi = await prisma.pointOfInterest.findUnique({
    where: { id },
    include: { translations: true, chapters: { orderBy: { order: "asc" }, include: { translations: true } } },
  });
  if (!poi) return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  return NextResponse.json(poi);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Corpo richiesta non valido" }, { status: 400 });

  try {
    await prisma.$transaction([
      prisma.pointOfInterest.update({
        where: { id },
        data: {
          slug: body.slug,
          category: body.category,
          order: body.order ?? 0,
          coverImage: body.coverImage || null,
          published: body.published ?? true,
          lat: body.lat != null && body.lat !== "" ? Number(body.lat) : null,
          lng: body.lng != null && body.lng !== "" ? Number(body.lng) : null,
        },
      }),
      ...locales.map((locale) =>
        prisma.poiTranslation.upsert({
          where: { poiId_locale: { poiId: id, locale } },
          update: {
            title: body.translations?.[locale]?.title || "",
            description: body.translations?.[locale]?.description || "",
            audioUrl: body.translations?.[locale]?.audioUrl || null,
            videoUrl: body.translations?.[locale]?.videoUrl || null,
          },
          create: {
            poiId: id,
            locale,
            title: body.translations?.[locale]?.title || "",
            description: body.translations?.[locale]?.description || "",
            audioUrl: body.translations?.[locale]?.audioUrl || null,
            videoUrl: body.translations?.[locale]?.videoUrl || null,
          },
        })
      ),
      prisma.poiChapter.deleteMany({ where: { poiId: id } }),
    ]);

    const chapterInputs = buildChapterCreateInput(body.chapters);
    for (const chapter of chapterInputs) {
      await prisma.poiChapter.create({ data: { ...chapter, poiId: id } });
    }

    const poi = await prisma.pointOfInterest.findUnique({
      where: { id },
      include: { translations: true, chapters: { orderBy: { order: "asc" }, include: { translations: true } } },
    });

    return NextResponse.json(poi);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const { id } = await params;
  await prisma.pointOfInterest.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
