export type ConsentPrefs = { analytics: boolean };

const KEY = "cookie-consent";

export function getConsent(): ConsentPrefs | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setConsent(prefs: ConsentPrefs) {
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs));
    window.dispatchEvent(new CustomEvent("cookie-consent-changed", { detail: prefs }));
  } catch {
    // storage non disponibile (es. modalita' privata): la preferenza vale solo per la sessione corrente.
  }
}
