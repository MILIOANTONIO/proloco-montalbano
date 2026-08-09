import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { locales, pickTranslation } from "@/lib/i18n";
import { sendPushToAll } from "@/lib/push";
import { buildChapterCreateInput } from "@/lib/poi-chapters";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const pois = await prisma.pointOfInterest.findMany({
    orderBy: { order: "asc" },
    include: { translations: true },
  });
  return NextResponse.json(pois);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.slug || !body?.category) {
    return NextResponse.json({ error: "Slug e categoria obbligatori" }, { status: 400 });
  }

  const count = await prisma.pointOfInterest.count();
  if (count >= 15) {
    return NextResponse.json(
      { error: "Limite di 15 punti di interesse raggiunto (previsto dall'offerta commerciale)" },
      { status: 400 }
    );
  }

  try {
    const poi = await prisma.pointOfInterest.create({
      data: {
        slug: body.slug,
        category: body.category,
        order: body.order ?? 0,
        coverImage: body.coverImage || null,
        published: body.published ?? true,
        lat: body.lat != null && body.lat !== "" ? Number(body.lat) : null,
        lng: body.lng != null && body.lng !== "" ? Number(body.lng) : null,
        translations: {
          create: locales.map((locale) => ({
            locale,
            title: body.translations?.[locale]?.title || "",
            description: body.translations?.[locale]?.description || "",
            audioUrl: body.translations?.[locale]?.audioUrl || null,
            videoUrl: body.translations?.[locale]?.videoUrl || null,
          })),
        },
        chapters: {
          create: buildChapterCreateInput(body.chapters),
        },
      },
    });

    if (poi.published) {
      const inputTranslations = locales.map((locale) => ({
        locale,
        title: body.translations?.[locale]?.title || "",
        description: body.translations?.[locale]?.description || "",
      }));
      const tr = pickTranslation(inputTranslations, "it");
      if (tr) {
        await sendPushToAll({
          title: "Nuovo punto di interesse",
          body: tr.title,
          url: `/it/percorso/${poi.slug}`,
        });
      }
    }

    return NextResponse.json(poi);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
