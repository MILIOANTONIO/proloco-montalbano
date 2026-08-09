"use client";

import { useEffect } from "react";

/** Garantisce che un solo audio/video alla volta sia in riproduzione nella pagina: avviarne uno mette in pausa tutti gli altri. */
export default function AudioCoordinator() {
  useEffect(() => {
    function handlePlay(e: Event) {
      document.querySelectorAll("audio, video").forEach((el) => {
        if (el !== e.target) (el as HTMLMediaElement).pause();
      });
    }

    document.addEventListener("play", handlePlay, true);
    return () => document.removeEventListener("play", handlePlay, true);
  }, []);

  return null;
}
