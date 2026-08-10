export const locales = ["it", "en", "es", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "it";

export const localeNames: Record<Locale, string> = {
  it: "Italiano",
  en: "English",
  es: "Español",
  fr: "Français",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

type Dict = {
  nav: { home: string; percorso: string; info: string; eventi: string; news: string; contatti: string; attivita: string };
  home: {
    welcome: string;
    title: string;
    subtitle: string;
    award: string;
    about: string;
    watchVideo: string;
    installHint: string;
    installButton: string;
    attivitaTitle: string;
    attivitaSubtitle: string;
    attivitaCta: string;
  };
  percorso: { title: string; intro: string; empty: string; scanHint: string };
  attivita: { title: string; intro: string; empty: string; website: string; categories: Record<string, string> };
  info: {
    title: string;
    emergenza: string;
    farmacia: string;
    ufficio: string;
    altro: string;
    empty: string;
  };
  eventi: { title: string; empty: string; upcoming: string; past: string };
  news: { title: string; empty: string };
  contatti: { title: string };
  poi: {
    audio: string;
    video: string;
    backToList: string;
    readMore: string;
    readLess: string;
    directions: string;
    hasAudio: string;
    hasVideo: string;
    filterAll: string;
    categories: Record<string, string>;
  };
  push: { enable: string; enabled: string; denied: string };
  common: { loading: string };
  flash: { badge: string; event: string; news: string; dismiss: string };
};

export const dictionaries: Record<Locale, Dict> = {
  it: {
    nav: { home: "Home", percorso: "Percorso Storico", info: "Info utili", eventi: "Eventi", news: "News", contatti: "Contatti", attivita: "Percorso Gastronomico" },
    home: {
      welcome: "Benvenuti a",
      title: "Montalbano Elicona",
      subtitle: "Guida turistica e informativa del borgo",
      award: "Borgo più bello d'Italia 2015 — Rai 3, Alle Falde del Kilimangiaro",
      about:
        "A 907 metri sui monti Nebrodi, tra boschi secolari e un castello che fu residenza reale, Montalbano Elicona è stato eletto Borgo più bello d'Italia 2015 nella trasmissione di Rai 3 condotta da Camila Raznovich e Dario Vergassola.",
      watchVideo: "Guarda il servizio su RaiPlay",
      installHint: "Aggiungi questa app alla schermata Home per un accesso rapido, anche offline.",
      installButton: "Installa l'app",
      attivitaTitle: "Percorso Gastronomico",
      attivitaSubtitle: "Scopri le bontà gastronomiche di Montalbano Elicona",
      attivitaCta: "Scopri tutte le attività",
    },
    percorso: {
      title: "Percorso Storico e Culturale",
      intro: "Scopri i punti di interesse del borgo. Inquadra il QR Code sul posto oppure sfoglia l'elenco qui sotto.",
      empty: "Nessun punto di interesse pubblicato al momento.",
      scanHint: "Inquadra il QR Code",
    },
    attivita: {
      title: "Percorso Gastronomico",
      intro: "Ristoranti, pizzerie, prodotti tipici, alloggi e botteghe del borgo: sostieni l'economia locale.",
      empty: "Nessuna attività pubblicata al momento.",
      website: "Sito web",
      categories: {
        ristorazione: "Ristorazione",
        panificio: "Panificio",
        formaggi: "Formaggi e latticini",
        macelleria: "Macelleria",
        bnb: "B&B",
        affittacamere: "Affittacamere",
        cantina: "Cantina e vino",
        bar: "Bar",
        souvenir: "Souvenir e artigianato",
        altro: "Altro",
      },
    },
    info: {
      title: "Informazioni utili",
      emergenza: "Numeri di emergenza",
      farmacia: "Farmacie e servizi sanitari",
      ufficio: "Uffici e servizi pubblici",
      altro: "Altri contatti utili",
      empty: "Nessuna informazione disponibile.",
    },
    eventi: { title: "Eventi e manifestazioni", empty: "Nessun evento in programma.", upcoming: "Prossimi eventi", past: "Eventi passati" },
    news: { title: "Comunicati e news", empty: "Nessuna news pubblicata." },
    contatti: { title: "Contatti" },
    poi: {
      audio: "Ascolta la descrizione audio",
      video: "Guarda il video",
      backToList: "Torna al percorso",
      readMore: "Leggi tutto",
      readLess: "Mostra meno",
      directions: "Portami qui",
      hasAudio: "Audio",
      hasVideo: "Video",
      filterAll: "Tutti",
      categories: {
        monumento: "Monumento",
        sala_castello: "Sala del castello",
        chiesa: "Chiesa",
        museo: "Museo",
        piazza: "Piazza storica",
        natura: "Natura",
        archeologico: "Sito archeologico",
      },
    },
    push: { enable: "Attiva notifiche", enabled: "Notifiche attive", denied: "Notifiche non autorizzate" },
    common: { loading: "Caricamento…" },
    flash: { badge: "Novità", event: "Nuovo evento", news: "Nuova comunicazione", dismiss: "Chiudi" },
  },
  en: {
    nav: { home: "Home", percorso: "Trail", info: "Useful info", eventi: "Events", news: "News", contatti: "Contact", attivita: "Businesses" },
    home: {
      welcome: "Welcome to",
      title: "Montalbano Elicona",
      subtitle: "Tourist and information guide to the village",
      award: "Italy's Most Beautiful Village 2015 — Rai 3, Alle Falde del Kilimangiaro",
      about:
        "At 907 metres in the Nebrodi mountains, amid centuries-old woods and a castle that once was a royal residence, Montalbano Elicona was voted Italy's Most Beautiful Village 2015 on the Rai 3 show hosted by Camila Raznovich and Dario Vergassola.",
      watchVideo: "Watch the report on RaiPlay",
      installHint: "Add this app to your Home screen for quick access, even offline.",
      installButton: "Install app",
      attivitaTitle: "Food Trail",
      attivitaSubtitle: "Discover the gastronomic delights of Montalbano Elicona",
      attivitaCta: "Discover all businesses",
    },
    percorso: {
      title: "Tourist and cultural trail",
      intro: "Discover the village's points of interest. Scan the QR Code on site or browse the list below.",
      empty: "No points of interest published yet.",
      scanHint: "Scan the QR Code",
    },
    attivita: {
      title: "Local food & businesses",
      intro: "Restaurants, pizzerias, local products, accommodation and shops in the village: support the local economy.",
      empty: "No businesses published yet.",
      website: "Website",
      categories: {
        ristorazione: "Restaurants & pizzerias",
        panificio: "Bakery",
        formaggi: "Cheese & dairy",
        macelleria: "Butcher",
        bnb: "B&B",
        affittacamere: "Guest rooms",
        cantina: "Winery",
        bar: "Bar / Café",
        souvenir: "Souvenirs & crafts",
        altro: "Other",
      },
    },
    info: {
      title: "Useful information",
      emergenza: "Emergency numbers",
      farmacia: "Pharmacies and health services",
      ufficio: "Public offices and services",
      altro: "Other useful contacts",
      empty: "No information available.",
    },
    eventi: { title: "Events", empty: "No events scheduled.", upcoming: "Upcoming events", past: "Past events" },
    news: { title: "News", empty: "No news published." },
    contatti: { title: "Contact" },
    poi: {
      audio: "Listen to the audio description",
      video: "Watch the video",
      backToList: "Back to the trail",
      readMore: "Read more",
      readLess: "Show less",
      directions: "Take me here",
      hasAudio: "Audio",
      hasVideo: "Video",
      filterAll: "All",
      categories: {
        monumento: "Monument",
        sala_castello: "Castle hall",
        chiesa: "Church",
        museo: "Museum",
        piazza: "Historic square",
        natura: "Nature",
        archeologico: "Archaeological site",
      },
    },
    push: { enable: "Enable notifications", enabled: "Notifications enabled", denied: "Notifications not authorized" },
    common: { loading: "Loading…" },
    flash: { badge: "New", event: "New event", news: "New update", dismiss: "Dismiss" },
  },
  es: {
    nav: { home: "Inicio", percorso: "Ruta", info: "Información útil", eventi: "Eventos", news: "Noticias", contatti: "Contacto", attivita: "Negocios" },
    home: {
      welcome: "Bienvenidos a",
      title: "Montalbano Elicona",
      subtitle: "Guía turística e informativa del pueblo",
      award: "Pueblo más bonito de Italia 2015 — Rai 3, Alle Falde del Kilimangiaro",
      about:
        "A 907 metros en los montes Nebrodi, entre bosques centenarios y un castillo que fue residencia real, Montalbano Elicona fue elegido Pueblo más bonito de Italia 2015 en el programa de Rai 3 presentado por Camila Raznovich y Dario Vergassola.",
      watchVideo: "Ver el reportaje en RaiPlay",
      installHint: "Añade esta app a tu pantalla de inicio para un acceso rápido, incluso sin conexión.",
      installButton: "Instalar la app",
      attivitaTitle: "Ruta Gastronómica",
      attivitaSubtitle: "Descubre las delicias gastronómicas de Montalbano Elicona",
      attivitaCta: "Descubre todos los negocios",
    },
    percorso: {
      title: "Ruta turística y cultural",
      intro: "Descubre los puntos de interés del pueblo. Escanea el código QR in situ o consulta la lista.",
      empty: "Todavía no hay puntos de interés publicados.",
      scanHint: "Escanea el código QR",
    },
    attivita: {
      title: "Gastronomía y negocios locales",
      intro: "Restaurantes, pizzerías, productos típicos, alojamiento y tiendas del pueblo: apoya la economía local.",
      empty: "Todavía no hay negocios publicados.",
      website: "Sitio web",
      categories: {
        ristorazione: "Restaurantes y pizzerías",
        panificio: "Panadería",
        formaggi: "Quesos y lácteos",
        macelleria: "Carnicería",
        bnb: "B&B",
        affittacamere: "Habitaciones",
        cantina: "Bodega",
        bar: "Bar",
        souvenir: "Souvenirs y artesanía",
        altro: "Otro",
      },
    },
    info: {
      title: "Información útil",
      emergenza: "Números de emergencia",
      farmacia: "Farmacias y servicios sanitarios",
      ufficio: "Oficinas y servicios públicos",
      altro: "Otros contactos útiles",
      empty: "No hay información disponible.",
    },
    eventi: { title: "Eventos", empty: "No hay eventos programados.", upcoming: "Próximos eventos", past: "Eventos pasados" },
    news: { title: "Noticias", empty: "No hay noticias publicadas." },
    contatti: { title: "Contacto" },
    poi: {
      audio: "Escuchar la descripción en audio",
      video: "Ver el vídeo",
      backToList: "Volver a la ruta",
      readMore: "Leer más",
      readLess: "Mostrar menos",
      directions: "Llévame aquí",
      hasAudio: "Audio",
      hasVideo: "Vídeo",
      filterAll: "Todos",
      categories: {
        monumento: "Monumento",
        sala_castello: "Sala del castillo",
        chiesa: "Iglesia",
        museo: "Museo",
        piazza: "Plaza histórica",
        natura: "Naturaleza",
        archeologico: "Sitio arqueológico",
      },
    },
    push: { enable: "Activar notificaciones", enabled: "Notificaciones activas", denied: "Notificaciones no autorizadas" },
    common: { loading: "Cargando…" },
    flash: { badge: "Novedad", event: "Nuevo evento", news: "Nueva noticia", dismiss: "Cerrar" },
  },
  fr: {
    nav: { home: "Accueil", percorso: "Parcours", info: "Infos utiles", eventi: "Événements", news: "Actualités", contatti: "Contact", attivita: "Commerces" },
    home: {
      welcome: "Bienvenue à",
      title: "Montalbano Elicona",
      subtitle: "Guide touristique et informatif du village",
      award: "Plus beau village d'Italie 2015 — Rai 3, Alle Falde del Kilimangiaro",
      about:
        "À 907 mètres dans les monts Nebrodi, parmi des bois centenaires et un château qui fut résidence royale, Montalbano Elicona a été élu plus beau village d'Italie 2015 lors de l'émission de Rai 3 animée par Camila Raznovich et Dario Vergassola.",
      watchVideo: "Voir le reportage sur RaiPlay",
      installHint: "Ajoutez cette appli à votre écran d'accueil pour un accès rapide, même hors ligne.",
      installButton: "Installer l'appli",
      attivitaTitle: "Circuit Gastronomique",
      attivitaSubtitle: "Découvrez les délices gastronomiques de Montalbano Elicona",
      attivitaCta: "Découvrir tous les commerces",
    },
    percorso: {
      title: "Parcours touristique et culturel",
      intro: "Découvrez les points d'intérêt du village. Scannez le QR Code sur place ou parcourez la liste.",
      empty: "Aucun point d'intérêt publié pour le moment.",
      scanHint: "Scannez le QR Code",
    },
    attivita: {
      title: "Gastronomie et commerces locaux",
      intro: "Restaurants, pizzerias, produits typiques, hébergements et boutiques du village : soutenez l'économie locale.",
      empty: "Aucun commerce publié pour le moment.",
      website: "Site web",
      categories: {
        ristorazione: "Restaurants et pizzerias",
        panificio: "Boulangerie",
        formaggi: "Fromages",
        macelleria: "Boucherie",
        bnb: "B&B",
        affittacamere: "Chambres d'hôtes",
        cantina: "Cave à vin",
        bar: "Bar",
        souvenir: "Souvenirs et artisanat",
        altro: "Autre",
      },
    },
    info: {
      title: "Informations utiles",
      emergenza: "Numéros d'urgence",
      farmacia: "Pharmacies et services de santé",
      ufficio: "Bureaux et services publics",
      altro: "Autres contacts utiles",
      empty: "Aucune information disponible.",
    },
    eventi: { title: "Événements", empty: "Aucun événement prévu.", upcoming: "Événements à venir", past: "Événements passés" },
    news: { title: "Actualités", empty: "Aucune actualité publiée." },
    contatti: { title: "Contact" },
    poi: {
      audio: "Écouter la description audio",
      video: "Regarder la vidéo",
      backToList: "Retour au parcours",
      readMore: "Lire la suite",
      readLess: "Voir moins",
      directions: "M'y emmener",
      hasAudio: "Audio",
      hasVideo: "Vidéo",
      filterAll: "Tous",
      categories: {
        monumento: "Monument",
        sala_castello: "Salle du château",
        chiesa: "Église",
        museo: "Musée",
        piazza: "Place historique",
        natura: "Nature",
        archeologico: "Site archéologique",
      },
    },
    push: { enable: "Activer les notifications", enabled: "Notifications activées", denied: "Notifications non autorisées" },
    common: { loading: "Chargement…" },
    flash: { badge: "Nouveauté", event: "Nouvel événement", news: "Nouvelle actualité", dismiss: "Fermer" },
  },
};

export function getDictionary(locale: string): Dict {
  return dictionaries[isLocale(locale) ? locale : defaultLocale];
}

/**
 * Sceglie la traduzione per la lingua richiesta; se manca o ha il titolo vuoto
 * (contenuto non ancora tradotto dall'admin) ripiega sull'italiano, poi su una qualsiasi disponibile.
 */
export function pickTranslation<T extends { locale: string; title: string }>(
  translations: T[],
  locale: string
): T | undefined {
  return (
    translations.find((t) => t.locale === locale && t.title.trim()) ||
    translations.find((t) => t.locale === defaultLocale && t.title.trim()) ||
    translations.find((t) => t.title.trim())
  );
}

/** Come pickTranslation, ma per i capitoli dei punti di interesse (campi heading/text invece di title). */
export function pickChapterTranslation<T extends { locale: string; heading: string; text: string }>(
  translations: T[],
  locale: string
): T | undefined {
  const hasContent = (t: T) => t.heading.trim() || t.text.trim();
  return (
    translations.find((t) => t.locale === locale && hasContent(t)) ||
    translations.find((t) => t.locale === defaultLocale && hasContent(t)) ||
    translations.find(hasContent)
  );
}
