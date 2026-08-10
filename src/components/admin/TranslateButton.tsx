"use client";

import { useState } from "react";

const TARGET_LOCALES = ["en", "es", "fr"] as const;

export default function TranslateButton({
  fields,
  itValues,
  onTranslated,
}: {
  /** Nomi dei campi da tradurre, nell'ordine in cui compaiono in itValues. */
  fields: string[];
  /** Valori italiani (sorgente) per ciascun campo. */
  itValues: Record<string, string>;
  /** Chiamata per ogni lingua tradotta con il risultato { campo: testo }. */
  onTranslated: (locale: "en" | "es" | "fr", values: Record<string, string>) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function translate() {
    const texts = fields.map((f) => itValues[f] || "");
    if (texts.every((t) => !t.trim())) {
      setError("Scrivi prima il testo in italiano");
      return;
    }
    if (!confirm("Sovrascrivere le traduzioni EN/ES/FR con quelle generate automaticamente dal testo italiano?")) return;

    setLoading(true);
    setError(null);
    try {
      for (const locale of TARGET_LOCALES) {
        const res = await fetch("/api/admin/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texts, targetLocale: locale }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Errore di traduzione");
        const values: Record<string, string> = {};
        fields.forEach((f, i) => { values[f] = data.translations[i] ?? ""; });
        onTranslated(locale, values);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={translate}
        disabled={loading}
        className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-gray-400 disabled:opacity-60"
      >
        {loading ? "Traduzione in corso…" : "🌐 Traduci automaticamente in EN/ES/FR"}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
