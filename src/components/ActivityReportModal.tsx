"use client";

import { useState } from "react";

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

type ActivityOption = { id: string; name: string };

const emptyForm = {
  type: "missing" as "missing" | "edit",
  activityId: "",
  activityName: "",
  categories: [] as string[],
  address: "",
  phone: "",
  website: "",
  notes: "",
  photo: "",
  reporterName: "",
  reporterEmail: "",
  reporterPhone: "",
};

export default function ActivityReportModal({ activities }: { activities: ActivityOption[] }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function close() {
    setOpen(false);
    setForm(emptyForm);
    setError(null);
    setDone(false);
  }

  function toggleCategory(value: string) {
    setForm((f) => ({ ...f, categories: f.categories.includes(value) ? f.categories.filter((c) => c !== value) : [...f.categories, value] }));
  }

  async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/segnalazioni/upload", { method: "POST", body: fd });
    setUploading(false);
    if (res.ok) {
      const data = await res.json();
      setForm((f) => ({ ...f, photo: data.url }));
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Caricamento foto non riuscito");
    }
    e.target.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch("/api/segnalazioni", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, categories: form.categories.join(",") }),
    });
    setSaving(false);
    if (res.ok) {
      setDone(true);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Invio non riuscito, riprova.");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-brand-400 bg-white px-4 py-2 text-sm font-medium text-brand-800 transition-colors hover:bg-brand-50 dark:border-brand-600 dark:bg-brand-900 dark:text-brand-200 dark:hover:bg-brand-800"
      >
        📍 Segnala un'attività
      </button>

      {open && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" onClick={close}>
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 dark:bg-brand-900 sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {done ? (
              <div className="space-y-4 text-center">
                <p className="text-lg font-semibold text-brand-900 dark:text-brand-100">Grazie della segnalazione!</p>
                <p className="text-sm text-brand-700 dark:text-brand-300">La rivediamo al più presto e, se serve, ti ricontattiamo.</p>
                <button type="button" onClick={close} className="rounded-full bg-brand-700 px-5 py-2 text-sm font-medium text-cream">
                  Chiudi
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold text-brand-900 dark:text-brand-100">Segnala un'attività</h2>
                  <button type="button" onClick={close} aria-label="Chiudi" className="text-brand-500 hover:text-brand-800 dark:hover:text-brand-200">
                    ✕
                  </button>
                </div>

                {error && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

                <div className="flex gap-2 text-sm">
                  <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-brand-300 p-2.5 dark:border-brand-600">
                    <input
                      type="radio"
                      name="type"
                      checked={form.type === "missing"}
                      onChange={() => setForm((f) => ({ ...f, type: "missing", activityId: "" }))}
                    />
                    Attività non presente
                  </label>
                  <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border border-brand-300 p-2.5 dark:border-brand-600">
                    <input type="radio" name="type" checked={form.type === "edit"} onChange={() => setForm((f) => ({ ...f, type: "edit" }))} />
                    Correggere una attività
                  </label>
                </div>

                {form.type === "edit" && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-brand-800 dark:text-brand-200">Quale attività?</label>
                    <select
                      required
                      value={form.activityId}
                      onChange={(e) => {
                        const act = activities.find((a) => a.id === e.target.value);
                        setForm((f) => ({ ...f, activityId: e.target.value, activityName: act?.name || "" }));
                      }}
                      className="w-full rounded border border-brand-300 px-3 py-2 dark:border-brand-600 dark:bg-brand-900"
                    >
                      <option value="">Seleziona…</option>
                      {activities.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-sm font-medium text-brand-800 dark:text-brand-200">Nome attività</label>
                  <input
                    required
                    value={form.activityName}
                    onChange={(e) => setForm((f) => ({ ...f, activityName: e.target.value }))}
                    disabled={form.type === "edit"}
                    className="w-full rounded border border-brand-300 px-3 py-2 disabled:bg-brand-50 dark:border-brand-600 dark:bg-brand-900 dark:disabled:bg-brand-800"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-brand-800 dark:text-brand-200">Categoria (opzionale)</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => (
                      <label
                        key={c.value}
                        className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs ${
                          form.categories.includes(c.value)
                            ? "border-brand-700 bg-brand-700 text-cream"
                            : "border-brand-300 text-brand-700 dark:border-brand-600 dark:text-brand-300"
                        }`}
                      >
                        <input type="checkbox" checked={form.categories.includes(c.value)} onChange={() => toggleCategory(c.value)} className="sr-only" />
                        {c.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    placeholder="Indirizzo (opzionale)"
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    className="w-full rounded border border-brand-300 px-3 py-2 dark:border-brand-600 dark:bg-brand-900"
                  />
                  <input
                    placeholder="Telefono attività (opzionale)"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full rounded border border-brand-300 px-3 py-2 dark:border-brand-600 dark:bg-brand-900"
                  />
                </div>
                <input
                  placeholder="Sito web / pagina social (opzionale)"
                  value={form.website}
                  onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                  className="w-full rounded border border-brand-300 px-3 py-2 dark:border-brand-600 dark:bg-brand-900"
                />

                <div>
                  <label className="mb-1 block text-sm font-medium text-brand-800 dark:text-brand-200">Cosa vuoi segnalarci?</label>
                  <textarea
                    required
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    placeholder="Es. indirizzo sbagliato, telefono cambiato, attività non più aperta, nuova attività da aggiungere…"
                    className="w-full rounded border border-brand-300 px-3 py-2 dark:border-brand-600 dark:bg-brand-900"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-brand-800 dark:text-brand-200">Foto (opzionale)</label>
                  <input type="file" accept="image/*" onChange={handlePhoto} disabled={uploading} className="block w-full text-sm" />
                  {uploading && <p className="mt-1 text-xs text-brand-500">Caricamento…</p>}
                  {form.photo && <p className="mt-1 text-xs text-green-700">Foto caricata ✓</p>}
                </div>

                <div className="rounded-xl border border-brand-200 p-3 dark:border-brand-700">
                  <p className="mb-2 text-sm font-medium text-brand-800 dark:text-brand-200">I tuoi dati (per essere ricontattato se serve)</p>
                  <div className="space-y-3">
                    <input
                      required
                      placeholder="Il tuo nome"
                      value={form.reporterName}
                      onChange={(e) => setForm((f) => ({ ...f, reporterName: e.target.value }))}
                      className="w-full rounded border border-brand-300 px-3 py-2 dark:border-brand-600 dark:bg-brand-900"
                    />
                    <input
                      required
                      type="email"
                      placeholder="La tua email"
                      value={form.reporterEmail}
                      onChange={(e) => setForm((f) => ({ ...f, reporterEmail: e.target.value }))}
                      className="w-full rounded border border-brand-300 px-3 py-2 dark:border-brand-600 dark:bg-brand-900"
                    />
                    <input
                      placeholder="Il tuo telefono (opzionale)"
                      value={form.reporterPhone}
                      onChange={(e) => setForm((f) => ({ ...f, reporterPhone: e.target.value }))}
                      className="w-full rounded border border-brand-300 px-3 py-2 dark:border-brand-600 dark:bg-brand-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="w-full rounded-full bg-brand-700 px-4 py-2.5 text-sm font-medium text-cream disabled:opacity-60"
                >
                  {saving ? "Invio…" : "Invia segnalazione"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
