"use client";

import { useEffect, useRef, useState } from "react";
import HeroVideo from "./HeroVideo";

type Slide = { id: string; image: string | null; videoMobile: string | null; videoDesktop: string | null };

const IMAGE_DURATION_MS = 6000;
// Rete di sicurezza se il video non parte mai o non finisce mai (autoplay bloccato, file rotto):
// senza questo il carosello resterebbe bloccato per sempre su quella slide. L'avanzamento
// normale avviene però tramite onEnded quando il video finisce davvero, quindi questo valore
// deve stare abbondantemente sopra la durata di qualunque video caricato (anche 1-2 minuti).
const VIDEO_MAX_DURATION_MS = 180000;

export default function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const advancedRef = useRef(false);
  // null finché non conosciamo il viewport reale (evita hydration mismatch);
  // resta comunque coperto dall'IntroAnimation nei primi istanti.
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const slide = slides[index];
  const mobileSrc = slide?.videoMobile || slide?.videoDesktop;
  const desktopSrc = slide?.videoDesktop || slide?.videoMobile;
  // Solo il video del viewport corrente va montato: se restano montati entrambi
  // (mobile nascosto + desktop nascosto via CSS, o viceversa), quello nascosto continua
  // comunque a scaricarsi e a riprodursi, e il suo onEnded fa avanzare il carosello
  // "tagliando" quello visibile prima che finisca (specie se le due durate differiscono).
  const activeSrc = isDesktop === null ? null : isDesktop ? desktopSrc : mobileSrc;
  const hasVideo = !!(mobileSrc || desktopSrc);

  useEffect(() => {
    advancedRef.current = false;
  }, [index]);

  function advance() {
    if (advancedRef.current) return;
    advancedRef.current = true;
    setIndex((i) => (i + 1) % slides.length);
  }

  useEffect(() => {
    if (slides.length < 2) return;
    // Le slide-video avanzano quando il video finisce (onEnded, gestito sotto);
    // questo timer è solo la rete di sicurezza. Le slide-immagine usano invece un timer fisso.
    const ms = hasVideo ? VIDEO_MAX_DURATION_MS : IMAGE_DURATION_MS;
    const timer = setTimeout(advance, ms);
    return () => clearTimeout(timer);
  }, [slides.length, index, hasVideo]);

  if (slides.length === 0) return null;

  function go(next: number) {
    setIndex(((next % slides.length) + slides.length) % slides.length);
  }

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) go(index + (delta < 0 ? 1 : -1));
    touchStartX.current = null;
  }

  const onVideoEnded = slides.length > 1 ? advance : undefined;

  return (
    <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {activeSrc ? (
        <div
          className={`mx-auto w-full overflow-hidden rounded-[2rem] bg-brand-900 shadow-xl ${
            isDesktop ? "aspect-video" : "aspect-square max-w-xl"
          }`}
        >
          <HeroVideo key={`${slide.id}-${isDesktop ? "d" : "m"}`} src={activeSrc} className="h-full w-full object-cover" onEnded={onVideoEnded} />
        </div>
      ) : slide.image ? (
        <div className="aspect-video overflow-hidden rounded-[2rem] bg-brand-900 shadow-xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={`${slide.id}-i`} src={slide.image} alt="" className="h-full w-full object-cover" />
        </div>
      ) : null}

      {slides.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => go(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-brand-600" : "w-2 bg-brand-300"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
