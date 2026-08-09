"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    __introDismissed?: boolean;
  }
}

export default function HeroVideo({
  src,
  className,
  onPlaying,
  onEnded,
  loop,
}: {
  src: string;
  className?: string;
  onPlaying?: () => void;
  onEnded?: () => void;
  loop?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    function play() {
      video?.play().catch(() => {});
    }

    if (window.__introDismissed) {
      play();
      return;
    }
    window.addEventListener("introDone", play, { once: true });
    return () => window.removeEventListener("introDone", play);
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      muted
      playsInline
      autoPlay
      loop={loop}
      preload="auto"
      onPlaying={onPlaying}
      onEnded={onEnded}
    />
  );
}
