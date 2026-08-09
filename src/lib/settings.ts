import { prisma } from "./prisma";

export async function getSiteSettings() {
  return prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: { id: "singleton" },
  });
}

export async function getHeroSlides() {
  return prisma.heroSlide.findMany({ orderBy: { order: "asc" } });
}

export const HOMEPAGE_SECTIONS = ["award", "about", "cards", "attivita", "install"] as const;
export type HomepageSection = (typeof HOMEPAGE_SECTIONS)[number];

export function parseSectionOrder(value: string): HomepageSection[] {
  const parsed = value.split(",").filter((s): s is HomepageSection => (HOMEPAGE_SECTIONS as readonly string[]).includes(s));
  const missing = HOMEPAGE_SECTIONS.filter((s) => !parsed.includes(s));
  return [...parsed, ...missing];
}
