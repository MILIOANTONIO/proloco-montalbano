"use client";

import { useEffect } from "react";

export default function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // registrazione fallita: l'app funziona comunque, solo senza funzioni offline/push
      });
    }
  }, []);
  return null;
}
