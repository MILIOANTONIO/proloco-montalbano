"use client";

import { useState } from "react";
import { locales, localeNames } from "@/lib/i18n";
import FileUploadField from "./FileUploadField";
import TranslateButton from "./TranslateButton";

export type ChapterTranslationState = { heading: string; text: string; audioUrl: string; videoUrl: string };
export type ChapterState = { imageUrl: string; translations: Record<string, ChapterTranslationState> };

function emptyChapterTranslations(): Record<string, ChapterTranslationState> {
  const t: Record<string, ChapterTranslationState> = {};
  for (const l of locales) t[l] = { heading: "", text: "", audioUrl: "", videoUrl: "" };
  return t;
}

export function emptyChapter(): ChapterState {
  return { imageUrl: "", translations: emptyChapterTranslations() };
}

function ChapterCard({
  chapter,
  index,
  total,
  onChange,
  onRemove,
  onMove,
}: {
  chapter: ChapterState;
  index: number;
  total: number;
  onChange: (next: ChapterState) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
}) {
  const [activeLocale, setActiveLocale] = useState("it");

  function updateTranslation(locale: string, field: keyof ChapterTranslationState, value: string) {
    onChange({ ...chapter, translations: { ...chapter.translations, [locale]: { ...chapter.translations[locale], [field]: value } } });
  }

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">Capitolo {index + 1}</p>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => onMove(-1)} disabled={index === 0} className="rounded px-2 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30">
            ↑
          </button>
          <button type="button" onClick={() => onMove(1)} disabled={index === total - 1} className="rounded px-2 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30">
            ↓
          </button>
          <button type="button" onClick={onRemove} className="ml-2 text-sm text-red-600 hover:underline">
            Elimina
          </button>
        </div>
      </div>

      <FileUploadField
        kind="image"
        label="Immagine del capitolo (es. foto della statua, dell'altare...)"
        value={chapter.imageUrl}
        onChange={(url) => onChange({ ...chapter, imageUrl: url })}
      />

      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-2">
          <div className="flex gap-2">
            {locales.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setActiveLocale(l)}
                className={`px-3 py-1.5 text-sm ${activeLocale === l ? "border-b-2 border-gray-800 font-semibold text-gray-900" : "text-gray-500"}`}
              >
                {localeNames[l]}
              </button>
            ))}
          </div>
          <TranslateButton
            fields={["heading", "text"]}
            itValues={chapter.translations.it}
            onTranslated={(locale, values) =>
              onChange({ ...chapter, translations: { ...chapter.translations, [locale]: { ...chapter.translations[locale], ...values } } })
            }
          />
        </div>
        {locales.map((l) => (
          <div key={l} className={activeLocale === l ? "space-y-3" : "hidden"}>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Titolo del capitolo ({localeNames[l]})</label>
              <input
                value={chapter.translations[l].heading}
                onChange={(e) => updateTranslation(l, "heading", e.target.value)}
                placeholder="es. Statua di Santa Rita"
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Testo ({localeNames[l]})</label>
              <textarea
                value={chapter.translations[l].text}
                onChange={(e) => updateTranslation(l, "text", e.target.value)}
                rows={4}
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>
            <FileUploadField
              kind="audio"
              label={`Podcast audio del capitolo (${localeNames[l]})`}
              value={chapter.translations[l].audioUrl}
              onChange={(url) => updateTranslation(l, "audioUrl", url)}
            />
            <FileUploadField
              kind="video"
              label={`Video del capitolo (${localeNames[l]})`}
              value={chapter.translations[l].videoUrl}
              onChange={(url) => updateTranslation(l, "videoUrl", url)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ChapterEditor({ chapters, onChange }: { chapters: ChapterState[]; onChange: (next: ChapterState[]) => void }) {
  function updateAt(index: number, next: ChapterState) {
    const copy = [...chapters];
    copy[index] = next;
    onChange(copy);
  }

  function removeAt(index: number) {
    onChange(chapters.filter((_, i) => i !== index));
  }

  function moveAt(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= chapters.length) return;
    const copy = [...chapters];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    onChange(copy);
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-gray-700">Capitoli</h2>
        <p className="text-xs text-gray-400">
          Aggiungi paragrafi separati per dettagli specifici (es. l&apos;altare, una statua, un affresco), ciascuno con la propria foto, audio e video.
        </p>
      </div>

      {chapters.map((chapter, i) => (
        <ChapterCard
          key={i}
          chapter={chapter}
          index={i}
          total={chapters.length}
          onChange={(next) => updateAt(i, next)}
          onRemove={() => removeAt(i)}
          onMove={(dir) => moveAt(i, dir)}
        />
      ))}

      <button
        type="button"
        onClick={() => onChange([...chapters, emptyChapter()])}
        className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
      >
        + Aggiungi capitolo
      </button>
    </div>
  );
}
