"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { locales, localeNames } from "@/lib/i18n";
import FileUploadField from "./FileUploadField";

type Translation = { title: string; body: string };
type TranslationsMap = Record<string, Translation>;

function emptyTranslations(): TranslationsMap {
  const t: TranslationsMap = {};
  for (const l of locales) t[l] = { title: "", body: "" };
  return t;
}

export default function NewsForm({
  newsId,
  initial,
}: {
  newsId?: string;
  initial?: {
    published: boolean;
    coverImage: string | null;
    coverVideo: string | null;
    translations: { locale: string; title: string; body: string }[];
  };
}) {
  const router = useRouter();
  const [published, setPublished] = useState(initial?.published ?? true);
  const [coverImage, setCoverImage] = useState(initial?.coverImage || "");
  const [coverVideo, setCoverVideo] = useState(initial?.coverVideo || "");
  const [translations, setTranslations] = useState<TranslationsMap>(() => {
    const t = emptyTranslations();
    if (initial) for (const tr of initial.translations) t[tr.locale] = { title: tr.title, body: tr.body };
    return t;
  });
  const [activeLocale, setActiveLocale] = useState("it");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function update(locale: string, field: keyof Translation, value: string) {
    setTranslations((prev) => ({ ...prev, [locale]: { ...prev[locale], [field]: value } }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch(newsId ? `/api/admin/news/${newsId}` : "/api/admin/news", {
      method: newsId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published, coverImage, coverVideo, translations }),
    });
    setSaving(false);
    if (res.ok) {
      router.push("/admin/news");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Errore durante il salvataggio");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="flex items-center gap-2">
        <input type="checkbox" id="published" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        <label htmlFor="published" className="text-sm text-gray-700">
          Pubblicato
        </label>
      </div>

      <FileUploadField kind="image" label="Immagine di copertina (opzionale)" value={coverImage} onChange={setCoverImage} />
      <FileUploadField kind="video" label="Video di copertina (opzionale, ha priorità sulla foto)" value={coverVideo} onChange={setCoverVideo} />

      <div>
        <div className="mb-2 flex gap-2 border-b border-gray-200">
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
        {locales.map((l) => (
          <div key={l} className={activeLocale === l ? "space-y-3" : "hidden"}>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Titolo ({localeNames[l]})</label>
              <input
                value={translations[l].title}
                onChange={(e) => update(l, "title", e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Testo ({localeNames[l]})</label>
              <textarea
                value={translations[l].body}
                onChange={(e) => update(l, "body", e.target.value)}
                rows={6}
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
        ))}
      </div>

      <button type="submit" disabled={saving} className="rounded bg-gray-800 px-4 py-2 font-medium text-white disabled:opacity-60">
        {saving ? "Salvataggio…" : "Salva"}
      </button>
    </form>
  );
}
