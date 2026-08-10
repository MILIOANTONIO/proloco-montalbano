import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { locales, pickTranslation } from "@/lib/i18n";
import { sendPushToAll } from "@/lib/push";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const posts = await prisma.newsPost.findMany({ orderBy: { publishedAt: "desc" }, include: { translations: true } });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Corpo richiesta non valido" }, { status: 400 });

  const post = await prisma.newsPost.create({
    data: {
      published: body.published ?? true,
      coverImage: body.coverImage || null,
      coverVideo: body.coverVideo || null,
      translations: {
        create: locales.map((locale) => ({
          locale,
          title: body.translations?.[locale]?.title || "",
          body: body.translations?.[locale]?.body || "",
        })),
      },
    },
  });

  if (post.published && body.notify) {
    const inputTranslations = locales.map((locale) => ({
      locale,
      title: body.translations?.[locale]?.title || "",
      body: body.translations?.[locale]?.body || "",
    }));
    const tr = pickTranslation(inputTranslations, "it");
    if (tr) {
      await sendPushToAll({
        title: tr.title,
        body: tr.body.slice(0, 140),
        url: `/it/news/${post.id}`,
      });
    }
  }

  return NextResponse.json(post);
}
