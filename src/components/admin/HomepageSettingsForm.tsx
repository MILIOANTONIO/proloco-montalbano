"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import HeroSlideEditor, { emptyHeroSlide, type HeroSlideState } from "./HeroSlideEditor";
import FileUploadField from "./FileUploadField";
import { HOMEPAGE_SECTIONS, type HomepageSection } from "@/lib/settings";

const SECTION_LABELS: Record<HomepageSection, string> = {
  award: "Fascia riconoscimento (Borgo più bello d'Italia)",
  about: "Paragrafo di presentazione + link video",
  cards: "Riquadri di accesso rapido (Percorso, Info, Eventi, News)",
  attivita: "Gastronomia e attività locali (ristoranti, B&B, cantine...)",
  install: "Messaggio \"Aggiungi alla schermata Home\"",
};

export default function HomepageSettingsForm({
  initial,
}: {
  initial: {
    heroSlides: { image: string | null; videoMobile: string | null; videoDesktop: string | null }[];
    showAward: boolean;
    showAbout: boolean;
    showCards: boolean;
    showAttivita: boolean;
    showInstall: boolean;
    sectionOrder: string;
    attivitaBannerImage: string | null;
    attivitaBannerVideoMobile: string | null;
    attivitaBannerVideoDesktop: string | null;
    cardPercorsoImage?: string | null;
    cardInfoImage?: string | null;
    cardEventiImage?: string | null;
    cardNewsImage?: string | null;
  };
}) {
  const router = useRouter();
  const [heroSlides, setHeroSlides] = useState<HeroSlideState[]>(() =>
    initial.heroSlides.length
      ? initial.heroSlides.map((s) => ({ image: s.image || "", videoMobile: s.videoMobile || "", videoDesktop: s.videoDesktop || "" }))
      : [emptyHeroSlide()]
  );
  const [visibility, setVisibility] = useState<Record<HomepageSection, boolean>>({
    award: initial.showAward,
    about: initial.showAbout,
    cards: initial.showCards,
    attivita: initial.showAttivita,
    install: initial.showInstall,
  });
  const [order, setOrder] = useState<HomepageSection[]>(() => {
    const parsed = initial.sectionOrder.split(",").filter((s): s is HomepageSection => (HOMEPAGE_SECTIONS as readonly string[]).includes(s));
    const missing = HOMEPAGE_SECTIONS.filter((s) => !parsed.includes(s));
    return [...parsed, ...missing];
  });
  const [bannerImage, setBannerImage] = useState(initial.attivitaBannerImage || "");
  const [bannerVideoMobile, setBannerVideoMobile] = useState(initial.attivitaBannerVideoMobile || "");
  const [bannerVideoDesktop, setBannerVideoDesktop] = useState(initial.attivitaBannerVideoDesktop || "");
  const [cardPercorsoImage, setCardPercorsoImage] = useState(initial.cardPercorsoImage || "");
  const [cardInfoImage, setCardInfoImage] = useState(initial.cardInfoImage || "");
  const [cardEventiImage, setCardEventiImage] = useState(initial.cardEventiImage || "");
  const [cardNewsImage, setCardNewsImage] = useState(initial.cardNewsImage || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= order.length) return;
    const next = [...order];
    [next[index], next[target]] = [next[target], next[index]];
    setOrder(next);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        heroSlides: heroSlides.filter((s) => s.image || s.videoMobile || s.videoDesktop),
        showAward: visibility.award,
        showAbout: visibility.about,
        showCards: visibility.cards,
        showAttivita: visibility.attivita,
        showInstall: visibility.install,
        sectionOrder: order.join(","),
        attivitaBannerImage: bannerImage,
        attivitaBannerVideoMobile: bannerVideoMobile,
        attivitaBannerVideoDesktop: bannerVideoDesktop,
        cardPercorsoImage,
        cardInfoImage,
        cardEventiImage,
        cardNewsImage,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Errore durante il salvataggio");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
      {error && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      {saved && <p className="rounded bg-green-50 px-3 py-2 text-sm text-green-700">Home page aggiornata.</p>}

      <HeroSlideEditor slides={heroSlides} onChange={setHeroSlides} />

      <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-700">Banner "Percorso Gastronomico"</h2>
          <p className="text-xs text-gray-400">Un unico riquadro grande, foto o video, che rimanda alla pagina attività.</p>
        </div>
        <FileUploadField kind="video" label="Video da cellulare (verticale/quadrato)" value={bannerVideoMobile} onChange={setBannerVideoMobile} />
        <FileUploadField kind="video" label="Video da PC (orizzontale)" value={bannerVideoDesktop} onChange={setBannerVideoDesktop} />
        <FileUploadField kind="image" label="Foto (usata se non carichi nessun video)" value={bannerImage} onChange={setBannerImage} />
      </div>

      <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-700">Foto dei riquadri di accesso rapido</h2>
          <p className="text-xs text-gray-400">Le 4 foto sotto al benvenuto che rimandano a Percorso, Info utili, Eventi e News.</p>
        </div>
        <FileUploadField kind="image" label="Foto — Percorso Storico" value={cardPercorsoImage} onChange={setCardPercorsoImage} />
        <FileUploadField kind="image" label="Foto — Info utili" value={cardInfoImage} onChange={setCardInfoImage} />
        <FileUploadField kind="image" label="Foto — Eventi" value={cardEventiImage} onChange={setCardEventiImage} />
        <FileUploadField kind="image" label="Foto — News" value={cardNewsImage} onChange={setCardNewsImage} />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-gray-700">Sezioni della home — ordine e visibilità</h2>
        <p className="mb-3 text-xs text-gray-400">Usa le frecce per decidere cosa appare più in alto o più in basso nella pagina.</p>
        <ul className="space-y-2">
          {order.map((section, i) => (
            <li key={section} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
              <input
                type="checkbox"
                checked={visibility[section]}
                onChange={(e) => setVisibility((v) => ({ ...v, [section]: e.target.checked }))}
              />
              <span className="flex-1 text-sm text-gray-800">{SECTION_LABELS[section]}</span>
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="rounded px-2 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                aria-label="Sposta su"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === order.length - 1}
                className="rounded px-2 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                aria-label="Sposta giù"
              >
                ↓
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button type="submit" disabled={saving} className="rounded bg-gray-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
        {saving ? "Salvataggio…" : "Salva"}
      </button>
    </form>
  );
}
