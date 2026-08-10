"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { locales, localeNames } from "@/lib/i18n";
import FileUploadField from "./FileUploadField";
import TranslateButton from "./TranslateButton";
import ChapterEditor, { emptyChapter, type ChapterState } from "./ChapterEditor";

type Translation = { title: string; description: string; audioUrl: string; videoUrl: string };
type TranslationsMap = Record<string, Translation>;

const CATEGORIES = [
  { value: "monumento", label: "Monumento" },
  { value: "sala_castello", label: "Sala del Castello" },
  { value: "chiesa", label: "Chiesa" },
  { value: "museo", label: "Museo" },
  { value: "piazza", label: "Piazza storica" },
  { value: "natura", label: "Attrazione naturalistica" },
  { value: "archeologico", label: "Sito archeologico/culturale" },
];

function emptyTranslations(): TranslationsMap {
  const t: TranslationsMap = {};
  for (const l of locales) t[l] = { title: "", description: "", audioUrl: "", videoUrl: "" };
  return t;
}

export default function PoiForm({
  poiId,
  initial,
}: {
  poiId?: string;
  initial?: {
    slug: string;
    category: string;
    order: number;
    published: boolean;
    coverImage: string | null;
    lat?: number | null;
    lng?: number | null;
    translations: { locale: string; title: string; description: string; audioUrl: string | null; videoUrl: string | null }[];
    chapters?: {
      imageUrl: string | null;
      translations: { locale: string; heading: string; text: string; audioUrl: string | null; videoUrl: string | null }[];
    }[];
  };
}) {
  const router = useRouter();
  const [slug, setSlug] = useState(initial?.slug || "");
  const [category, setCategory] = useState(initial?.category || CATEGORIES[0].value);
  const [order, setOrder] = useState(initial?.order ?? 1);
  const [published, setPublished] = useState(initial?.published ?? true);
  const [coverImage, setCoverImage] = useState(initial?.coverImage || "");
  const [lat, setLat] = useState(initial?.lat != null ? String(initial.lat) : "");
  const [lng, setLng] = useState(initial?.lng != null ? String(initial.lng) : "");
  const [translations, setTranslations] = useState<TranslationsMap>(() => {
    const t = emptyTranslations();
    if (initial) {
      for (const tr of initial.translations) {
        t[tr.locale] = {
          title: tr.title,
          description: tr.description,
          audioUrl: tr.audioUrl || "",
          videoUrl: tr.videoUrl || "",
        };
      }
    }
    return t;
  });
  const [activeLocale, setActiveLocale] = useState<string>("it");
  const [chapters, setChapters] = useState<ChapterState[]>(() => {
    if (!initial?.chapters) return [];
    return initial.chapters.map((ch) => {
      const state = emptyChapter();
      state.imageUrl = ch.imageUrl || "";
      for (const t of ch.translations) {
        state.translations[t.locale] = { heading: t.heading, text: t.text, audioUrl: t.audioUrl || "", videoUrl: t.videoUrl || "" };
      }
      return state;
    });
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function updateTranslation(locale: string, field: keyof Translation, value: string) {
    setTranslations((prev) => ({ ...prev, [locale]: { ...prev[locale], [field]: value } }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = { slug, category, order, published, coverImage, lat, lng, translations, chapters };
    const res = await fetch(poiId ? `/api/admin/poi/${poiId}` : "/api/admin/poi", {
      method: poiId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      router.push("/admin/poi");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Errore durante il salvataggio");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Slug (URL)</label>
          <input
            required
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="es. castello-di-montalbano"
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Categoria</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded border border-gray-300 px-3 py-2">
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Ordine nel percorso</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <div className="flex items-end gap-2">
          <input type="checkbox" id="published" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          <label htmlFor="published" className="text-sm text-gray-700">
            Pubblicato
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Latitudine (opzionale)</label>
          <input
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="es. 38.02372"
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Longitudine (opzionale)</label>
          <input
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder="es. 15.01103"
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
      </div>
      <p className="-mt-4 text-xs text-gray-400">
        Se non indicate, il pulsante &quot;Portami qui&quot; userà il nome del punto per la ricerca su Google Maps.
      </p>

      <FileUploadField kind="image" label="Immagine di copertina" value={coverImage} onChange={setCoverImage} />

      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-2">
          <div className="flex gap-2">
            {locales.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setActiveLocale(l)}
                className={`px-3 py-2 text-sm ${activeLocale === l ? "border-b-2 border-gray-800 font-semibold text-gray-900" : "text-gray-500"}`}
              >
                {localeNames[l]}
              </button>
            ))}
          </div>
          <TranslateButton
            fields={["title", "description"]}
            itValues={translations.it}
            onTranslated={(locale, values) => setTranslations((prev) => ({ ...prev, [locale]: { ...prev[locale], ...values } }))}
          />
        </div>

        {locales.map((l) => (
          <div key={l} className={activeLocale === l ? "space-y-3" : "hidden"}>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Titolo ({localeNames[l]})</label>
              <input
                value={translations[l].title}
                onChange={(e) => updateTranslation(l, "title", e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Descrizione ({localeNames[l]})</label>
              <textarea
                value={translations[l].description}
                onChange={(e) => updateTranslation(l, "description", e.target.value)}
                rows={5}
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>
            <FileUploadField
              kind="audio"
              label={`Podcast audio (${localeNames[l]})`}
              value={translations[l].audioUrl}
              onChange={(url) => updateTranslation(l, "audioUrl", url)}
            />
            <FileUploadField
              kind="video"
              label={`Video (${localeNames[l]})`}
              value={translations[l].videoUrl}
              onChange={(url) => updateTranslation(l, "videoUrl", url)}
            />
          </div>
        ))}
      </div>

      <ChapterEditor chapters={chapters} onChange={setChapters} />

      <button type="submit" disabled={saving} className="rounded bg-gray-800 px-4 py-2 font-medium text-white disabled:opacity-60">
        {saving ? "Salvataggio…" : "Salva"}
      </button>
    </form>
  );
}
