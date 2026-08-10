"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { locales, localeNames } from "@/lib/i18n";
import FileUploadField from "./FileUploadField";
import TranslateButton from "./TranslateButton";

type Translation = { description: string };
type TranslationsMap = Record<string, Translation>;

const CATEGORIES = [
  { value: "ristorazione", label: "Ristorazione (ristorante/pizzeria)" },
  { value: "panificio", label: "Panificio / pane casareccio" },
  { value: "formaggi", label: "Formaggi e latticini" },
  { value: "macelleria", label: "Macelleria" },
  { value: "bnb", label: "B&B" },
  { value: "affittacamere", label: "Affittacamere" },
  { value: "cantina", label: "Cantina / vino" },
  { value: "bar", label: "Bar" },
  { value: "souvenir", label: "Souvenir e artigianato" },
  { value: "altro", label: "Altro" },
];

function emptyTranslations(): TranslationsMap {
  const t: TranslationsMap = {};
  for (const l of locales) t[l] = { description: "" };
  return t;
}

export default function ActivityForm({
  activityId,
  initial,
}: {
  activityId?: string;
  initial?: {
    categories: string;
    name: string;
    address: string | null;
    phone: string | null;
    website: string | null;
    order: number;
    published: boolean;
    coverImage: string | null;
    translations: { locale: string; description: string }[];
  };
}) {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>(() =>
    initial?.categories ? initial.categories.split(",").filter(Boolean) : [CATEGORIES[0].value]
  );
  const [name, setName] = useState(initial?.name || "");
  const [address, setAddress] = useState(initial?.address || "");
  const [phone, setPhone] = useState(initial?.phone || "");
  const [website, setWebsite] = useState(initial?.website || "");
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [published, setPublished] = useState(initial?.published ?? true);
  const [coverImage, setCoverImage] = useState(initial?.coverImage || "");
  const [translations, setTranslations] = useState<TranslationsMap>(() => {
    const t = emptyTranslations();
    if (initial) for (const tr of initial.translations) t[tr.locale] = { description: tr.description };
    return t;
  });
  const [activeLocale, setActiveLocale] = useState("it");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function updateTranslation(locale: string, value: string) {
    setTranslations((prev) => ({ ...prev, [locale]: { description: value } }));
  }

  function toggleCategory(value: string) {
    setCategories((prev) => (prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (categories.length === 0) {
      setError("Seleziona almeno un'etichetta");
      return;
    }
    setSaving(true);
    setError(null);
    const payload = { categories: categories.join(","), name, address, phone, website, order, published, coverImage, translations };
    const res = await fetch(activityId ? `/api/admin/attivita/${activityId}` : "/api/admin/attivita", {
      method: activityId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      router.push("/admin/attivita");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Errore durante il salvataggio");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Nome attività</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="es. Pizzeria Villa Sulla"
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Indirizzo (opzionale)</label>
          <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Telefono (opzionale)</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Sito web / pagina social (opzionale)</label>
          <input value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full rounded border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Ordine</label>
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

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Etichette (seleziona tutte quelle pertinenti — molte attività fanno più cose)
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <label
              key={c.value}
              className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
                categories.includes(c.value) ? "border-gray-800 bg-gray-800 text-white" : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <input
                type="checkbox"
                checked={categories.includes(c.value)}
                onChange={() => toggleCategory(c.value)}
                className="sr-only"
              />
              {c.label}
            </label>
          ))}
        </div>
      </div>

      <FileUploadField kind="image" label="Foto dell'attività (fornita dall'esercente)" value={coverImage} onChange={setCoverImage} />

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
            fields={["description"]}
            itValues={translations.it}
            onTranslated={(locale, values) => setTranslations((prev) => ({ ...prev, [locale]: { description: values.description ?? "" } }))}
          />
        </div>
        {locales.map((l) => (
          <div key={l} className={activeLocale === l ? "space-y-3" : "hidden"}>
            <label className="mb-1 block text-sm font-medium text-gray-700">Breve descrizione ({localeNames[l]})</label>
            <textarea
              value={translations[l].description}
              onChange={(e) => updateTranslation(l, e.target.value)}
              rows={4}
              placeholder="es. Pizze cotte in forno a legna e piatti tipici dei Nebrodi."
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
        ))}
      </div>

      <button type="submit" disabled={saving} className="rounded bg-gray-800 px-4 py-2 font-medium text-white disabled:opacity-60">
        {saving ? "Salvataggio…" : "Salva"}
      </button>
    </form>
  );
}
