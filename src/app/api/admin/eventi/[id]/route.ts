import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { locales, pickTranslation } from "@/lib/i18n";
import { sendPushToAll } from "@/lib/push";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const { id } = await params;
  const event = await prisma.eventItem.findUnique({ where: { id }, include: { translations: true } });
  if (!event) return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  return NextResponse.json(event);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body?.startDate) return NextResponse.json({ error: "Data di inizio obbligatoria" }, { status: 400 });

  const nowPublished = body.published ?? true;
  const startDate = new Date(body.startDate);

  await prisma.$transaction([
    prisma.eventItem.update({
      where: { id },
      data: {
        startDate,
        endDate: body.endDate ? new Date(body.endDate) : null,
        location: body.location || null,
        coverImage: body.coverImage || null,
        coverVideoMobile: body.coverVideoMobile || null,
        coverVideoDesktop: body.coverVideoDesktop || null,
        published: nowPublished,
      },
    }),
    ...locales.map((locale) =>
      prisma.eventTranslation.upsert({
        where: { eventId_locale: { eventId: id, locale } },
        update: { title: body.translations?.[locale]?.title || "", description: body.translations?.[locale]?.description || "" },
        create: {
          eventId: id,
          locale,
          title: body.translations?.[locale]?.title || "",
          description: body.translations?.[locale]?.description || "",
        },
      })
    ),
  ]);

  if (nowPublished && body.notify) {
    const inputTranslations = locales.map((locale) => ({
      locale,
      title: body.translations?.[locale]?.title || "",
      description: body.translations?.[locale]?.description || "",
    }));
    const tr = pickTranslation(inputTranslations, "it");
    if (tr) {
      const dateLabel = new Intl.DateTimeFormat("it-IT", { day: "2-digit", month: "long" }).format(startDate);
      const locationLabel = body.location ? ` — ${body.location}` : "";
      await sendPushToAll({ title: `Evento aggiornato: ${tr.title}`, body: `${dateLabel}${locationLabel}`, url: "/it/eventi" });
    }
  }

  const event = await prisma.eventItem.findUnique({ where: { id }, include: { translations: true } });
  return NextResponse.json(event);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const { id } = await params;
  await prisma.eventItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
