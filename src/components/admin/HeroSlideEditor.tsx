"use client";

import FileUploadField from "./FileUploadField";

export type HeroSlideState = { image: string; videoMobile: string; videoDesktop: string };

export function emptyHeroSlide(): HeroSlideState {
  return { image: "", videoMobile: "", videoDesktop: "" };
}

function SlideCard({
  slide,
  index,
  total,
  onChange,
  onRemove,
  onMove,
}: {
  slide: HeroSlideState;
  index: number;
  total: number;
  onChange: (next: HeroSlideState) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
}) {
  return (
    <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-700">Slide {index + 1}</p>
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
        kind="video"
        label="Video da cellulare (verticale/quadrato)"
        value={slide.videoMobile}
        onChange={(url) => onChange({ ...slide, videoMobile: url })}
      />
      <FileUploadField
        kind="video"
        label="Video da PC (orizzontale/16:9)"
        value={slide.videoDesktop}
        onChange={(url) => onChange({ ...slide, videoDesktop: url })}
      />
      <FileUploadField
        kind="image"
        label="Foto (usata se non carichi nessun video)"
        value={slide.image}
        onChange={(url) => onChange({ ...slide, image: url })}
      />
    </div>
  );
}

export default function HeroSlideEditor({ slides, onChange }: { slides: HeroSlideState[]; onChange: (next: HeroSlideState[]) => void }) {
  function updateAt(index: number, next: HeroSlideState) {
    const copy = [...slides];
    copy[index] = next;
    onChange(copy);
  }

  function removeAt(index: number) {
    onChange(slides.filter((_, i) => i !== index));
  }

  function moveAt(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= slides.length) return;
    const copy = [...slides];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    onChange(copy);
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold text-gray-700">Slide della home (foto/video in evidenza)</h2>
        <p className="text-xs text-gray-400">
          Con più di una slide, sul sito compare un carosello automatico con i puntini per navigare, oppure si scorre con swipe da cellulare.
        </p>
      </div>

      {slides.map((slide, i) => (
        <SlideCard
          key={i}
          slide={slide}
          index={i}
          total={slides.length}
          onChange={(next) => updateAt(i, next)}
          onRemove={() => removeAt(i)}
          onMove={(dir) => moveAt(i, dir)}
        />
      ))}

      <button
        type="button"
        onClick={() => onChange([...slides, emptyHeroSlide()])}
        className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
      >
        + Aggiungi slide
      </button>
    </div>
  );
}
