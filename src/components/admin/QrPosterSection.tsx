"use client";

import { useState } from "react";
import FileUploadField from "./FileUploadField";

type PoiOption = { slug: string; label: string };

export default function QrPosterSection({
  initial,
  siteUrl,
  pois,
}: {
  initial: { qrTemplateImage: string | null; qrBoxLeft: number; qrBoxTop: number; qrBoxWidth: number; qrBoxHeight: number };
  siteUrl: string;
  pois: PoiOption[];
}) {
  const [templateImage, setTemplateImage] = useState(initial.qrTemplateImage || "");
  const [boxLeft, setBoxLeft] = useState(initial.qrBoxLeft);
  const [boxTop, setBoxTop] = useState(initial.qrBoxTop);
  const [boxWidth, setBoxWidth] = useState(initial.qrBoxWidth);
  const [boxHeight, setBoxHeight] = useState(initial.qrBoxHeight);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [previewNonce, setPreviewNonce] = useState(0);

  const [target, setTarget] = useState("__site__");
  const [posterNonce, setPosterNonce] = useState(0);

  async function saveTemplate() {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/qr-template", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qrTemplateImage: templateImage, qrBoxLeft: boxLeft, qrBoxTop: boxTop, qrBoxWidth: boxWidth, qrBoxHeight: boxHeight }),
    });
    setSaving(false);
    setSaved(true);
    setPreviewNonce((n) => n + 1);
    setPosterNonce((n) => n + 1);
  }

  const targetUrl = target === "__site__" ? `${siteUrl}/it` : `${siteUrl}/it/percorso/${target}`;
  const targetLabel = target === "__site__" ? "sito" : target;
  const posterLabel = target === "__site__" ? "" : pois.find((p) => p.slug === target)?.label || "";

  return (
    <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4">
      <div>
        <h2 className="text-sm font-semibold text-gray-700">Template poster QR Code</h2>
        <p className="text-xs text-gray-400">
          Carica la grafica (formato A4) con lo spazio bianco dove deve andare il QR Code, poi indica dove si trova quello spazio (in percentuale
          rispetto all&apos;immagine, così funziona a qualunque dimensione).
        </p>
      </div>

      <FileUploadField kind="image" label="Immagine template (PNG, formato A4)" value={templateImage} onChange={setTemplateImage} />

      {templateImage && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Sinistra %</label>
              <input
                type="number"
                step="0.1"
                value={boxLeft}
                onChange={(e) => setBoxLeft(Number(e.target.value))}
                className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Alto %</label>
              <input
                type="number"
                step="0.1"
                value={boxTop}
                onChange={(e) => setBoxTop(Number(e.target.value))}
                className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Larghezza %</label>
              <input
                type="number"
                step="0.1"
                value={boxWidth}
                onChange={(e) => setBoxWidth(Number(e.target.value))}
                className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Altezza %</label>
              <input
                type="number"
                step="0.1"
                value={boxHeight}
                onChange={(e) => setBoxHeight(Number(e.target.value))}
                className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={saveTemplate}
              disabled={saving}
              className="rounded bg-gray-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {saving ? "Salvataggio…" : "Salva e aggiorna anteprima"}
            </button>
            {saved && <span className="text-sm text-green-700">Salvato ✓</span>}
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <p className="mb-2 text-xs font-medium text-gray-500">Anteprima (con il QR di prova del sito)</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={previewNonce}
              src={`/api/admin/qrcode-poster?url=${encodeURIComponent(siteUrl + "/it")}&format=png&t=${previewNonce}`}
              alt="Anteprima poster"
              className="mx-auto max-h-[420px] rounded shadow-sm"
            />
          </div>
        </>
      )}

      {templateImage && (
        <div className="space-y-3 border-t border-gray-100 pt-4">
          <h3 className="text-sm font-semibold text-gray-700">Genera poster</h3>
          <div className="flex flex-wrap items-center gap-3">
            <select value={target} onChange={(e) => { setTarget(e.target.value); setPosterNonce((n) => n + 1); }} className="rounded border border-gray-300 px-3 py-2 text-sm">
              <option value="__site__">Sito generale (home)</option>
              {pois.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.label}
                </option>
              ))}
            </select>
            <a
              href={`/api/admin/qrcode-poster?url=${encodeURIComponent(targetUrl)}&format=pdf&filename=poster-${targetLabel}&label=${encodeURIComponent(posterLabel)}`}
              className="rounded-full bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
              style={{ backgroundColor: "#435423" }}
            >
              Scarica PDF
            </a>
          </div>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={posterNonce + target}
              src={`/api/admin/qrcode-poster?url=${encodeURIComponent(targetUrl)}&format=png&t=${posterNonce}&label=${encodeURIComponent(posterLabel)}`}
              alt="Anteprima poster selezionato"
              className="mx-auto max-h-[420px] rounded shadow-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}
