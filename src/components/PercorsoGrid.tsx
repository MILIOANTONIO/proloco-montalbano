"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { categoryIcons, LandmarkIcon } from "@/components/icons";

export type PercorsoCard = {
  id: string;
  slug: string;
  category: string;
  coverImage: string | null;
  title: string;
};

export default function PercorsoGrid({
  locale,
  pois,
  categoryLabels,
  filterAllLabel,
}: {
  locale: string;
  pois: PercorsoCard[];
  categoryLabels: Record<string, string>;
  filterAllLabel: string;
}) {
  const categoriesPresent = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const p of pois) {
      if (!seen.has(p.category)) {
        seen.add(p.category);
        list.push(p.category);
      }
    }
    return list;
  }, [pois]);

  const [active, setActive] = useState<string | null>(null);
  const visible = active ? pois.filter((p) => p.category === active) : pois;

  return (
    <>
      {categoriesPresent.length > 1 && (
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          <button
            type="button"
            onClick={() => setActive(null)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
              active === null ? "bg-brand-700 text-cream" : "border border-brand-200 bg-white text-brand-700 hover:bg-brand-100"
            }`}
          >
            {filterAllLabel}
          </button>
          {categoriesPresent.map((cat) => {
            const Icon = categoryIcons[cat] ?? LandmarkIcon;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
                  active === cat ? "bg-brand-700 text-cream" : "border border-brand-200 bg-white text-brand-700 hover:bg-brand-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                {categoryLabels[cat] ?? cat}
              </button>
            );
          })}
        </div>
      )}

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((poi) => {
          const Icon = categoryIcons[poi.category] ?? LandmarkIcon;
          const orderIndex = pois.indexOf(poi);
          return (
            <li key={poi.id}>
              <Link
                href={`/${locale}/percorso/${poi.slug}`}
                className="group relative flex aspect-[3/4] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-brand-200 to-olive-400/40 shadow-md transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {poi.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={poi.coverImage}
                    alt={poi.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icon className="h-14 w-14 text-brand-600" />
                  </div>
                )}

                {/* scrim per leggibilità testo */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />

                <span className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-xs font-bold text-brand-800 shadow-sm backdrop-blur-sm">
                  {String(orderIndex + 1).padStart(2, "0")}
                </span>
                <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-cream shadow-sm">
                  <Icon className="h-3.5 w-3.5" />
                  {categoryLabels[poi.category] ?? poi.category}
                </span>

                <span className="relative z-10 mt-auto p-4 font-display text-xl font-bold leading-tight text-white drop-shadow-sm">
                  {poi.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
