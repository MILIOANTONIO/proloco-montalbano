import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { locales, pickTranslation } from "@/lib/i18n";
import { sendPushToAll } from "@/lib/push";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const events = await prisma.eventItem.findMany({ orderBy: { startDate: "asc" }, include: { translations: true } });
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.startDate) return NextResponse.json({ error: "Data di inizio obbligatoria" }, { status: 400 });

  const event = await prisma.eventItem.create({
    data: {
      startDate: new Date(body.startDate),
      endDate: body.endDate ? new Date(body.endDate) : null,
      location: body.location || null,
      coverImage: body.coverImage || null,
      coverVideoMobile: body.coverVideoMobile || null,
      coverVideoDesktop: body.coverVideoDesktop || null,
      published: body.published ?? true,
      translations: {
        create: locales.map((locale) => ({
          locale,
          title: body.translations?.[locale]?.title || "",
          description: body.translations?.[locale]?.description || "",
        })),
      },
    },
  });

  if (event.published) {
    const inputTranslations = locales.map((locale) => ({
      locale,
      title: body.translations?.[locale]?.title || "",
      description: body.translations?.[locale]?.description || "",
    }));
    const tr = pickTranslation(inputTranslations, "it");
    if (tr) {
      const dateLabel = new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "long" }).format(event.startDate);
      const locationLabel = event.location ? ` — ${event.location}` : "";
      await sendPushToAll({
        title: `Nuovo evento: ${tr.title}`,
        body: `${dateLabel}${locationLabel}`,
        url: "/it/eventi",
      });
    }
  }

  return NextResponse.json(event);
}
