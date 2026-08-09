import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSiteSettings, getHeroSlides } from "@/lib/settings";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  const [settings, heroSlides] = await Promise.all([getSiteSettings(), getHeroSlides()]);
  return NextResponse.json({ ...settings, heroSlides });
}

export async function PUT(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Corpo richiesta non valido" }, { status: 400 });

  const slides: { image?: string; videoMobile?: string; videoDesktop?: string }[] = Array.isArray(body.heroSlides) ? body.heroSlides : [];

  const [settings] = await prisma.$transaction([
    prisma.siteSettings.upsert({
      where: { id: "singleton" },
      update: {
        showAward: !!body.showAward,
        showAbout: !!body.showAbout,
        showCards: !!body.showCards,
        showAttivita: !!body.showAttivita,
        showInstall: !!body.showInstall,
        sectionOrder: body.sectionOrder || "award,about,cards,attivita,install",
        attivitaBannerImage: body.attivitaBannerImage || null,
        attivitaBannerVideoMobile: body.attivitaBannerVideoMobile || null,
        attivitaBannerVideoDesktop: body.attivitaBannerVideoDesktop || null,
      },
      create: {
        id: "singleton",
        showAward: !!body.showAward,
        showAbout: !!body.showAbout,
        showCards: !!body.showCards,
        showAttivita: !!body.showAttivita,
        showInstall: !!body.showInstall,
        sectionOrder: body.sectionOrder || "award,about,cards,attivita,install",
        attivitaBannerImage: body.attivitaBannerImage || null,
        attivitaBannerVideoMobile: body.attivitaBannerVideoMobile || null,
        attivitaBannerVideoDesktop: body.attivitaBannerVideoDesktop || null,
      },
    }),
    prisma.heroSlide.deleteMany({}),
    ...slides.map((s, i) =>
      prisma.heroSlide.create({
        data: { order: i, image: s.image || null, videoMobile: s.videoMobile || null, videoDesktop: s.videoDesktop || null },
      })
    ),
  ]);

  return NextResponse.json(settings);
}
