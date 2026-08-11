import type { Locale } from "./i18n";

export type CookieBannerContent = {
  message: string;
  acceptAll: string;
  necessaryOnly: string;
  customize: string;
  savePrefs: string;
  privacyLink: string;
  necessaryTitle: string;
  necessaryDesc: string;
  analyticsTitle: string;
  analyticsDesc: string;
  alwaysOn: string;
};

export const cookieBannerContent: Record<Locale, CookieBannerContent> = {
  it: {
    message: "Usiamo solo dati tecnici necessari e, se acconsenti, statistiche anonime di visita per migliorare il sito.",
    acceptAll: "Acconsento",
    necessaryOnly: "Solo necessari",
    customize: "Personalizza",
    savePrefs: "Salva preferenze",
    privacyLink: "Informativa privacy",
    necessaryTitle: "Tecnici",
    necessaryDesc: "Necessari al funzionamento del sito (es. area amministrativa). Sempre attivi.",
    analyticsTitle: "Statistiche anonime",
    analyticsDesc: "Pagina visitata, lingua e data/ora, senza indirizzo IP, per capire quali contenuti sono più utili.",
    alwaysOn: "Sempre attivo",
  },
  en: {
    message: "We only use necessary technical data and, if you agree, anonymous visit statistics to improve the site.",
    acceptAll: "Accept",
    necessaryOnly: "Necessary only",
    customize: "Customize",
    savePrefs: "Save preferences",
    privacyLink: "Privacy Policy",
    necessaryTitle: "Necessary",
    necessaryDesc: "Required for the site to work (e.g. admin area). Always active.",
    analyticsTitle: "Anonymous statistics",
    analyticsDesc: "Page visited, language and date/time, with no IP address, to understand which content is most useful.",
    alwaysOn: "Always active",
  },
  es: {
    message: "Usamos solo datos técnicos necesarios y, si aceptas, estadísticas de visita anónimas para mejorar el sitio.",
    acceptAll: "Acepto",
    necessaryOnly: "Solo necesarias",
    customize: "Personalizar",
    savePrefs: "Guardar preferencias",
    privacyLink: "Política de privacidad",
    necessaryTitle: "Técnicas",
    necessaryDesc: "Necesarias para el funcionamiento del sitio (p. ej. área de administración). Siempre activas.",
    analyticsTitle: "Estadísticas anónimas",
    analyticsDesc: "Página visitada, idioma y fecha/hora, sin dirección IP, para entender qué contenidos son más útiles.",
    alwaysOn: "Siempre activa",
  },
  fr: {
    message: "Nous utilisons uniquement les données techniques nécessaires et, si vous acceptez, des statistiques de visite anonymes pour améliorer le site.",
    acceptAll: "J'accepte",
    necessaryOnly: "Nécessaires uniquement",
    customize: "Personnaliser",
    savePrefs: "Enregistrer les préférences",
    privacyLink: "Politique de confidentialité",
    necessaryTitle: "Techniques",
    necessaryDesc: "Nécessaires au fonctionnement du site (ex. espace d'administration). Toujours actives.",
    analyticsTitle: "Statistiques anonymes",
    analyticsDesc: "Page visitée, langue et date/heure, sans adresse IP, pour comprendre les contenus les plus utiles.",
    alwaysOn: "Toujours active",
  },
};
