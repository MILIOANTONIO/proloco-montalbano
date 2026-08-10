"use client";

import { useMemo, useState } from "react";
import { activityCategoryIcons, PhoneIcon, StoreIcon } from "@/components/icons";
import DirectionsButton from "@/components/DirectionsButton";

export type ActivityCard = {
  id: string;
  categories: string[];
  name: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  coverImage: string | null;
  description: string;
};

export default function ActivityGrid({
  activities,
  categoryLabels,
  filterAllLabel,
  directionsLabel,
  websiteLabel,
}: {
  activities: ActivityCard[];
  categoryLabels: Record<string, string>;
  filterAllLabel: string;
  directionsLabel: string;
  websiteLabel: string;
}) {
  const categoriesPresent = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const a of activities) {
      for (const cat of a.categories) {
        if (!seen.has(cat)) {
          seen.add(cat);
          list.push(cat);
        }
      }
    }
    return list;
  }, [activities]);

  const [active, setActive] = useState<string | null>(null);
  const visible = active ? activities.filter((a) => a.categories.includes(active)) : activities;

  return (
    <>
      {categoriesPresent.length > 1 && (
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          <button
            type="button"
            onClick={() => setActive(null)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
              active === null ? "bg-brand-700 text-cream" : "border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-900 text-brand-700 dark:text-brand-300 hover:bg-brand-100"
            }`}
          >
            {filterAllLabel}
          </button>
          {categoriesPresent.map((cat) => {
            const Icon = activityCategoryIcons[cat] ?? StoreIcon;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
                  active === cat ? "bg-brand-700 text-cream" : "border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-900 text-brand-700 dark:text-brand-300 hover:bg-brand-100"
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
        {visible.map((a) => {
          const MainIcon = activityCategoryIcons[a.categories[0]] ?? StoreIcon;
          return (
            <li key={a.id} className="overflow-hidden rounded-3xl bg-white dark:bg-brand-900 shadow-sm">
              <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-brand-200 to-olive-400/40">
                {a.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.coverImage} alt={a.name} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MainIcon className="h-12 w-12 text-brand-600 dark:text-brand-300" />
                  </div>
                )}
                <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                  {a.categories.map((cat) => {
                    const Icon = activityCategoryIcons[cat] ?? StoreIcon;
                    return (
                      <span
                        key={cat}
                        className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-cream shadow-sm"
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {categoryLabels[cat] ?? cat}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2 p-4">
                <p className="font-display text-lg font-bold leading-tight text-brand-900 dark:text-brand-100">{a.name}</p>
                {a.description && <p className="text-sm text-brand-700 dark:text-brand-300">{a.description}</p>}

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {a.address && <DirectionsButton label={directionsLabel} title={a.name} lat={null} lng={null} />}
                  {a.phone && (
                    <a
                      href={`tel:${a.phone.replace(/\s+/g, "")}`}
                      className="inline-flex items-center gap-2 rounded-full border border-brand-200 dark:border-brand-700 px-4 py-2.5 text-sm font-medium text-brand-700 dark:text-brand-300 transition-colors duration-200 hover:bg-brand-100"
                    >
                      <PhoneIcon className="h-4 w-4" />
                      {a.phone}
                    </a>
                  )}
                  {a.website && (
                    <a
                      href={a.website.startsWith("http") ? a.website : `https://${a.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-full border border-brand-200 dark:border-brand-700 px-4 py-2.5 text-sm font-medium text-brand-700 dark:text-brand-300 transition-colors duration-200 hover:bg-brand-100"
                    >
                      {websiteLabel}
                    </a>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
