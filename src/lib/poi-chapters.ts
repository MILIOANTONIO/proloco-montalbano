import { locales } from "./i18n";

type ChapterInput = {
  imageUrl?: string;
  translations?: Record<string, { heading?: string; text?: string; audioUrl?: string; videoUrl?: string }>;
};

/** Converte i capitoli inviati dal form admin nel formato di creazione annidata di Prisma. */
export function buildChapterCreateInput(chapters: ChapterInput[] | undefined) {
  if (!Array.isArray(chapters)) return [];
  return chapters.map((ch, i) => ({
    order: i,
    imageUrl: ch.imageUrl || null,
    translations: {
      create: locales.map((locale) => ({
        locale,
        heading: ch.translations?.[locale]?.heading || "",
        text: ch.translations?.[locale]?.text || "",
        audioUrl: ch.translations?.[locale]?.audioUrl || null,
        videoUrl: ch.translations?.[locale]?.videoUrl || null,
      })),
    },
  }));
}
