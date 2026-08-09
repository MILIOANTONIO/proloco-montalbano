import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { locales, pickTranslation } from "@/lib/i18n";
import { sendPushToAll } from "@/lib/push";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const { id } = await params;
  const post = await prisma.newsPost.findUnique({ where: { id }, include: { translations: true } });
  if (!post) return NextResponse.json({ error: "Non trovato" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Corpo richiesta non valido" }, { status: 400 });

  const nowPublished = body.published ?? true;

  await prisma.$transaction([
    prisma.newsPost.update({ where: { id }, data: { published: nowPublished, coverImage: body.coverImage || null, coverVideo: body.coverVideo || null } }),
    ...locales.map((locale) =>
      prisma.newsTranslation.upsert({
        where: { newsId_locale: { newsId: id, locale } },
        update: { title: body.translations?.[locale]?.title || "", body: body.translations?.[locale]?.body || "" },
        create: { newsId: id, locale, title: body.translations?.[locale]?.title || "", body: body.translations?.[locale]?.body || "" },
      })
    ),
  ]);

  if (nowPublished) {
    const inputTranslations = locales.map((locale) => ({
      locale,
      title: body.translations?.[locale]?.title || "",
      body: body.translations?.[locale]?.body || "",
    }));
    const tr = pickTranslation(inputTranslations, "it");
    if (tr) {
      await sendPushToAll({ title: tr.title, body: tr.body.slice(0, 140), url: `/it/news/${id}` });
    }
  }

  const post = await prisma.newsPost.findUnique({ where: { id }, include: { translations: true } });
  return NextResponse.json(post);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const { id } = await params;
  await prisma.newsPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
