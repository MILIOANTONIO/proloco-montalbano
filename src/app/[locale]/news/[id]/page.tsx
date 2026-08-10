import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getDictionary, pickTranslation } from "@/lib/i18n";
import { ChevronLeftIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

function formatDate(d: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "long", year: "numeric" }).format(d);
}

export default async function NewsDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  const t = getDictionary(locale);

  const post = await prisma.newsPost.findUnique({ where: { id }, include: { translations: true } });
  if (!post || !post.published) notFound();

  const tr = pickTranslation(post.translations, locale);
  if (!tr) notFound();

  return (
    <article className="mx-auto max-w-2xl space-y-4">
      {(post.coverVideo || post.coverImage) ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-brand-900 shadow-soft">
          {post.coverVideo ? (
            <video controls className="h-full w-full object-cover" src={post.coverVideo} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.coverImage!} alt={tr.title} className="h-full w-full object-cover" />
          )}
          <Link
            href={`/${locale}/news`}
            aria-label={t.news.title}
            className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 dark:bg-brand-900/90 text-brand-800 dark:text-brand-200 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Link>
        </div>
      ) : (
        <Link href={`/${locale}/news`} className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-300 hover:text-brand-800">
          <ChevronLeftIcon className="h-4 w-4" />
          {t.news.title}
        </Link>
      )}
      <p className="text-xs font-semibold uppercase tracking-wide text-olive-600 dark:text-olive-400">{formatDate(post.publishedAt, locale)}</p>
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-brand-900 dark:text-brand-100">{tr.title}</h1>

      <p className="whitespace-pre-line text-[17px] leading-relaxed text-brand-900/90 dark:text-brand-100/90">{tr.body}</p>
    </article>
  );
}
