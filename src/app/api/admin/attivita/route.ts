import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { locales } from "@/lib/i18n";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const activities = await prisma.activity.findMany({ orderBy: [{ order: "asc" }, { name: "asc" }], include: { translations: true } });
  return NextResponse.json(activities);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.name || !body?.categories) {
    return NextResponse.json({ error: "Nome e almeno un'etichetta obbligatori" }, { status: 400 });
  }

  try {
    const activity = await prisma.activity.create({
      data: {
        categories: body.categories,
        name: body.name,
        address: body.address || null,
        phone: body.phone || null,
        website: body.website || null,
        order: body.order ?? 0,
        published: body.published ?? true,
        coverImage: body.coverImage || null,
        translations: {
          create: locales.map((locale) => ({
            locale,
            description: body.translations?.[locale]?.description || "",
          })),
        },
      },
    });
    return NextResponse.json(activity);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
