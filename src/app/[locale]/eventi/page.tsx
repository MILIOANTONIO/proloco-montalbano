import { prisma } from "@/lib/prisma";
import { getDictionary, pickTranslation } from "@/lib/i18n";
import { PinIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

function formatDate(d: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "long", year: "numeric" }).format(d);
}

export default async function EventiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);

  const events = await prisma.eventItem.findMany({
    where: { published: true },
    orderBy: { startDate: "asc" },
    include: { translations: true },
  });

  const now = new Date();
  const upcoming = events.filter((e) => e.startDate >= now);
  const past = events.filter((e) => e.startDate < now).reverse();

  function renderList(list: typeof events) {
    return (
      <ul className="space-y-4">
        {list.map((ev) => {
          const tr = pickTranslation(ev.translations, locale);
          if (!tr) return null;
          const d = new Date(ev.startDate);
          return (
            <li
              key={ev.id}
              className="overflow-hidden rounded-3xl bg-white shadow-md transition-shadow duration-300 hover:shadow-xl"
            >
              {(() => {
                const mobileSrc = ev.coverVideoMobile || ev.coverVideoDesktop;
                const desktopSrc = ev.coverVideoDesktop || ev.coverVideoMobile;
                if (mobileSrc || desktopSrc) {
                  return (
                    <>
                      <div className="aspect-[3/4] w-full overflow-hidden bg-brand-900 md:hidden">
                        <video controls className="h-full w-full object-cover" src={mobileSrc!} />
                      </div>
                      <div className="hidden aspect-video w-full overflow-hidden bg-brand-900 md:block">
                        <video controls className="h-full w-full object-cover" src={desktopSrc!} />
                      </div>
                    </>
                  );
                }
                if (ev.coverImage) {
                  return (
                    <div className="aspect-video w-full overflow-hidden bg-brand-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={ev.coverImage} alt={tr.title} className="h-full w-full object-cover" />
                    </div>
                  );
                }
                return null;
              })()}
              <div className="flex gap-4 p-5">
                <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-brand-700 text-cream">
                  <span className="text-[10px] font-bold uppercase tracking-wide">{d.toLocaleDateString(locale, { month: "short" })}</span>
                  <span className="font-display text-xl font-extrabold leading-none">{d.getDate()}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-display text-lg font-bold text-brand-900">{tr.title}</p>
                  {ev.location && (
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-brand-600">
                      <PinIcon className="h-4 w-4" /> {ev.location}
                    </p>
                  )}
                  <p className="mt-1 whitespace-pre-line text-sm text-brand-700">{tr.description}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-brand-900">{t.eventi.title}</h1>
      {events.length === 0 ? (
        <p className="text-brand-600">{t.eventi.empty}</p>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section>
              <h2 className="mb-3 font-display text-lg font-bold text-brand-800">{t.eventi.upcoming}</h2>
              {renderList(upcoming)}
            </section>
          )}
          {past.length > 0 && (
            <section>
              <h2 className="mb-3 font-display text-lg font-bold text-brand-800">{t.eventi.past}</h2>
              {renderList(past)}
            </section>
          )}
        </>
      )}
    </div>
  );
}
