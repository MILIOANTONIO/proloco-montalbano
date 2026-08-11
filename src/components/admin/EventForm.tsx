"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { locales, localeNames } from "@/lib/i18n";
import FileUploadField from "./FileUploadField";
import TranslateButton from "./TranslateButton";

type Translation = { title: string; description: string };
type TranslationsMap = Record<string, Translation>;

function emptyTranslations(): TranslationsMap {
  const t: TranslationsMap = {};
  for (const l of locales) t[l] = { title: "", description: "" };
  return t;
}

function toInputDate(d?: string | Date | null) {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

export default function EventForm({
  eventId,
  initial,
}: {
  eventId?: string;
  initial?: {
    startDate: string | Date;
    endDate: string | Date | null;
    location: string | null;
    published: boolean;
    coverImage?: string | null;
    coverVideoMobile?: string | null;
    coverVideoDesktop?: string | null;
    translations: { locale: string; title: string; description: string }[];
  };
}) {
  const router = useRouter();
  const [startDate, setStartDate] = useState(toInputDate(initial?.startDate));
  const [endDate, setEndDate] = useState(toInputDate(initial?.endDate));
  const [location, setLocation] = useState(initial?.location || "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [notify, setNotify] = useState(!eventId);
  const [coverImage, setCoverImage] = useState(initial?.coverImage || "");
  const [coverVideoMobile, setCoverVideoMobile] = useState(initial?.coverVideoMobile || "");
  const [coverVideoDesktop, setCoverVideoDesktop] = useState(initial?.coverVideoDesktop || "");
  const [translations, setTranslations] = useState<TranslationsMap>(() => {
    const t = emptyTranslations();
    if (initial) for (const tr of initial.translations) t[tr.locale] = { title: tr.title, description: tr.description };
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
    const res = await fetch(eventId ? `/api/admin/eventi/${eventId}` : "/api/admin/eventi", {
      method: eventId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startDate, endDate: endDate || null, location, published, notify, coverImage, coverVideoMobile, coverVideoDesktop, translations }),
    });
    setSaving(false);
    if (res.ok) {
      router.push("/admin/eventi");
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
          <label className="mb-1 block text-sm font-medium text-gray-700">Data inizio</label>
          <input
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Data fine (opzionale)</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Luogo</label>
          <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full rounded border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label htmlFor="published" className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" id="published" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            Pubblicato
          </label>
          <p className="mt-1 text-xs text-gray-400">Deseleziona per sospendere: resta salvato ma sparisce dal sito.</p>
        </div>
        <div className="flex items-end gap-2">
          <input type="checkbox" id="notify" checked={notify} onChange={(e) => setNotify(e.target.checked)} />
          <label htmlFor="notify" className="text-sm text-gray-700">
            Invia notifica push agli iscritti
          </label>
        </div>
      </div>

      <FileUploadField kind="image" label="Immagine (opzionale, usata se non carichi video)" value={coverImage} onChange={setCoverImage} />
      <div className="rounded-xl border border-gray-200 p-3">
        <FileUploadField
          kind="video"
          label="Video da cellulare (verticale/quadrato)"
          value={coverVideoMobile}
          onChange={setCoverVideoMobile}
        />
        <p className="mt-1 text-xs text-gray-400">Mostrato sugli schermi stretti (telefono). Carica qui i video girati col telefono.</p>
      </div>
      <div className="rounded-xl border border-gray-200 p-3">
        <FileUploadField
          kind="video"
          label="Video da PC (orizzontale/16:9)"
          value={coverVideoDesktop}
          onChange={setCoverVideoDesktop}
        />
        <p className="mt-1 text-xs text-gray-400">Mostrato su schermi larghi (PC/tablet). Se manca, si usa la versione cellulare anche lì.</p>
      </div>

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
                onChange={(e) => update(l, "title", e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Descrizione ({localeNames[l]})</label>
              <textarea
                value={translations[l].description}
                onChange={(e) => update(l, "description", e.target.value)}
                rows={5}
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
