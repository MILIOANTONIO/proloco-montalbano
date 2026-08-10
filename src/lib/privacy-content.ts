import type { Locale } from "./i18n";

export type PrivacySection = { heading: string; body: string[] };
export type PrivacyContent = { title: string; updated: string; intro: string; sections: PrivacySection[] };

const UPDATED = "10 agosto 2026";

export const privacyContent: Record<Locale, PrivacyContent> = {
  it: {
    title: "Informativa sulla privacy",
    updated: `Ultimo aggiornamento: ${UPDATED}`,
    intro:
      "Questa informativa descrive come il sito e l'app montalbanoelicona.app trattano i dati dei visitatori, ai sensi del Regolamento (UE) 2016/679 (GDPR) e del Codice Privacy italiano.",
    sections: [
      {
        heading: "Titolare del trattamento",
        body: [
          "Pro Loco Montalbano Elicona APS, Piazza Maria SS della Provvidenza, 98065 Montalbano Elicona (ME).",
          "Per qualsiasi richiesta relativa a questa informativa puoi scrivere agli indirizzi indicati nella pagina Contatti del sito.",
        ],
      },
      {
        heading: "Dati raccolti e finalità",
        body: [
          "Statistiche di visita anonime: registriamo la pagina visitata, la lingua del sito e la data/ora, senza indirizzo IP né altri identificatori personali, per capire quali contenuti sono più utili ai visitatori e migliorare il sito.",
          "Notifiche push (facoltative): se attivi le notifiche, il browser genera un identificativo tecnico legato al tuo dispositivo/browser (non al tuo nome o alla tua identità), usato solo per inviarti gli avvisi che scegli di ricevere. Puoi disattivarle in ogni momento dalle impostazioni del browser o del telefono.",
          "Area amministrativa: l'accesso riservato al personale della Pro Loco usa un cookie tecnico di sessione, necessario per il funzionamento del pannello e non rivolto ai visitatori del sito pubblico.",
        ],
      },
      {
        heading: "Base giuridica",
        body: [
          "Legittimo interesse del Titolare per le statistiche anonime di visita (art. 6.1.f GDPR), che non permettono di identificare i singoli visitatori.",
          "Consenso dell'utente per le notifiche push, prestato attivando volontariamente la funzione (art. 6.1.a GDPR) e revocabile in ogni momento.",
        ],
      },
      {
        heading: "Cookie",
        body: [
          "Il sito pubblico non utilizza cookie di profilazione né di tracciamento pubblicitario. L'unico cookie presente è quello tecnico di sessione dell'area amministrativa riservata, non installato sui dispositivi dei visitatori del sito pubblico.",
          "I caratteri tipografici del sito sono ospitati direttamente sui nostri server: nessun dato viene trasmesso a servizi esterni per la loro visualizzazione.",
        ],
      },
      {
        heading: "Conservazione e comunicazione dei dati",
        body: [
          "Le statistiche di visita anonime sono conservate sui server del sito e utilizzate in forma aggregata, senza essere cedute a terzi.",
          "Le notifiche push vengono recapitate tramite i servizi di notifica del browser che utilizzi (es. Google Firebase Cloud Messaging per Chrome/Android, Apple Push Notification service per Safari/iOS): questi fornitori tecnici ricevono solo l'identificativo tecnico necessario alla consegna, non il contenuto del tuo utilizzo del sito.",
          "I dati non vengono venduti né utilizzati per finalità di marketing di terzi.",
        ],
      },
      {
        heading: "I tuoi diritti",
        body: [
          "In qualità di interessato puoi in ogni momento chiedere l'accesso ai tuoi dati, la rettifica, la cancellazione, la limitazione del trattamento, opporti al trattamento o richiederne la portabilità, scrivendo agli indirizzi indicati nella pagina Contatti.",
          "Hai inoltre diritto di proporre reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it) qualora ritenga che il trattamento violi la normativa vigente.",
        ],
      },
      {
        heading: "Modifiche a questa informativa",
        body: ["Questa informativa può essere aggiornata nel tempo; la data di ultimo aggiornamento è indicata in alto alla pagina."],
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    updated: `Last updated: ${UPDATED}`,
    intro:
      "This notice explains how the montalbanoelicona.app website and app handle visitor data, in accordance with EU Regulation 2016/679 (GDPR) and Italian privacy law.",
    sections: [
      {
        heading: "Data Controller",
        body: [
          "Pro Loco Montalbano Elicona APS, Piazza Maria SS della Provvidenza, 98065 Montalbano Elicona (ME), Italy.",
          "For any request regarding this notice, please write to the addresses listed on the Contact page.",
        ],
      },
      {
        heading: "Data collected and purposes",
        body: [
          "Anonymous visit statistics: we log the page visited, the site language and the date/time — with no IP address or other personal identifiers — to understand which content is most useful and improve the site.",
          "Push notifications (optional): if you enable notifications, your browser generates a technical identifier tied to your device/browser (not your name or identity), used only to send you the alerts you choose to receive. You can disable them at any time from your browser or phone settings.",
          "Admin area: staff-only access uses a technical session cookie required for the panel to work; it is not set for visitors of the public site.",
        ],
      },
      {
        heading: "Legal basis",
        body: [
          "Legitimate interest of the Data Controller for anonymous visit statistics (Art. 6.1.f GDPR), which do not allow individual visitors to be identified.",
          "User consent for push notifications, given by voluntarily enabling the feature (Art. 6.1.a GDPR) and revocable at any time.",
        ],
      },
      {
        heading: "Cookies",
        body: [
          "The public site does not use profiling or advertising-tracking cookies. The only cookie in use is the technical session cookie of the restricted admin area, which is not set on public site visitors' devices.",
          "The site's fonts are self-hosted on our own servers: no data is sent to external services to display them.",
        ],
      },
      {
        heading: "Retention and data sharing",
        body: [
          "Anonymous visit statistics are stored on the site's servers and used in aggregate form; they are not shared with third parties.",
          "Push notifications are delivered through the notification services of the browser you use (e.g. Google Firebase Cloud Messaging for Chrome/Android, Apple Push Notification service for Safari/iOS): these technical providers only receive the identifier needed for delivery, not the content of your use of the site.",
          "Data is never sold or used for third-party marketing purposes.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "As a data subject, you may at any time request access to your data, rectification, erasure, restriction of processing, object to processing, or request data portability, by writing to the addresses on the Contact page.",
          "You also have the right to lodge a complaint with the Italian Data Protection Authority (Garante per la protezione dei dati personali, www.garanteprivacy.it) if you believe the processing violates applicable law.",
        ],
      },
      {
        heading: "Changes to this notice",
        body: ["This notice may be updated over time; the last-updated date is shown at the top of the page."],
      },
    ],
  },
  es: {
    title: "Política de privacidad",
    updated: `Última actualización: ${UPDATED}`,
    intro:
      "Esta información describe cómo el sitio web y la aplicación montalbanoelicona.app tratan los datos de los visitantes, de acuerdo con el Reglamento (UE) 2016/679 (RGPD) y la normativa italiana de privacidad.",
    sections: [
      {
        heading: "Responsable del tratamiento",
        body: [
          "Pro Loco Montalbano Elicona APS, Piazza Maria SS della Provvidenza, 98065 Montalbano Elicona (ME), Italia.",
          "Para cualquier solicitud relacionada con esta información, escribe a las direcciones indicadas en la página de Contacto.",
        ],
      },
      {
        heading: "Datos recopilados y finalidades",
        body: [
          "Estadísticas de visita anónimas: registramos la página visitada, el idioma del sitio y la fecha/hora, sin dirección IP ni otros identificadores personales, para entender qué contenidos son más útiles y mejorar el sitio.",
          "Notificaciones push (opcionales): si las activas, el navegador genera un identificador técnico vinculado a tu dispositivo/navegador (no a tu nombre ni identidad), usado solo para enviarte los avisos que elijas recibir. Puedes desactivarlas en cualquier momento desde los ajustes del navegador o del teléfono.",
          "Área de administración: el acceso reservado al personal utiliza una cookie técnica de sesión necesaria para el funcionamiento del panel, no dirigida a los visitantes del sitio público.",
        ],
      },
      {
        heading: "Base jurídica",
        body: [
          "Interés legítimo del Responsable para las estadísticas anónimas de visita (art. 6.1.f RGPD), que no permiten identificar a los visitantes individuales.",
          "Consentimiento del usuario para las notificaciones push, prestado al activar voluntariamente la función (art. 6.1.a RGPD) y revocable en cualquier momento.",
        ],
      },
      {
        heading: "Cookies",
        body: [
          "El sitio público no utiliza cookies de perfilado ni de seguimiento publicitario. La única cookie presente es la técnica de sesión del área de administración reservada, no instalada en los dispositivos de los visitantes del sitio público.",
          "Las tipografías del sitio están alojadas directamente en nuestros servidores: no se transmite ningún dato a servicios externos para mostrarlas.",
        ],
      },
      {
        heading: "Conservación y comunicación de datos",
        body: [
          "Las estadísticas de visita anónimas se conservan en los servidores del sitio y se utilizan de forma agregada, sin cederse a terceros.",
          "Las notificaciones push se entregan a través de los servicios de notificación del navegador que utilizas (p. ej. Google Firebase Cloud Messaging para Chrome/Android, Apple Push Notification service para Safari/iOS): estos proveedores técnicos reciben solo el identificador necesario para la entrega, no el contenido de tu uso del sitio.",
          "Los datos nunca se venden ni se utilizan con fines de marketing de terceros.",
        ],
      },
      {
        heading: "Tus derechos",
        body: [
          "Como interesado, puedes en cualquier momento solicitar el acceso a tus datos, la rectificación, la supresión, la limitación del tratamiento, oponerte al tratamiento o solicitar la portabilidad, escribiendo a las direcciones de la página de Contacto.",
          "También tienes derecho a presentar una reclamación ante la Autoridad de Protección de Datos italiana (Garante per la protezione dei dati personali, www.garanteprivacy.it) si consideras que el tratamiento infringe la normativa vigente.",
        ],
      },
      {
        heading: "Cambios en esta información",
        body: ["Esta información puede actualizarse con el tiempo; la fecha de la última actualización se indica en la parte superior de la página."],
      },
    ],
  },
  fr: {
    title: "Politique de confidentialité",
    updated: `Dernière mise à jour : ${UPDATED}`,
    intro:
      "Cette notice décrit comment le site et l'application montalbanoelicona.app traitent les données des visiteurs, conformément au Règlement (UE) 2016/679 (RGPD) et au droit italien de la protection des données.",
    sections: [
      {
        heading: "Responsable du traitement",
        body: [
          "Pro Loco Montalbano Elicona APS, Piazza Maria SS della Provvidenza, 98065 Montalbano Elicona (ME), Italie.",
          "Pour toute demande relative à cette notice, écrivez aux adresses indiquées sur la page Contact.",
        ],
      },
      {
        heading: "Données collectées et finalités",
        body: [
          "Statistiques de visite anonymes : nous enregistrons la page visitée, la langue du site et la date/heure, sans adresse IP ni autre identifiant personnel, afin de comprendre les contenus les plus utiles et d'améliorer le site.",
          "Notifications push (facultatives) : si vous les activez, le navigateur génère un identifiant technique lié à votre appareil/navigateur (pas à votre nom ni à votre identité), utilisé uniquement pour vous envoyer les alertes que vous choisissez de recevoir. Vous pouvez les désactiver à tout moment depuis les réglages de votre navigateur ou téléphone.",
          "Espace d'administration : l'accès réservé au personnel utilise un cookie technique de session nécessaire au fonctionnement du panneau, non destiné aux visiteurs du site public.",
        ],
      },
      {
        heading: "Base juridique",
        body: [
          "Intérêt légitime du Responsable pour les statistiques de visite anonymes (art. 6.1.f RGPD), qui ne permettent pas d'identifier les visiteurs individuels.",
          "Consentement de l'utilisateur pour les notifications push, donné en activant volontairement la fonction (art. 6.1.a RGPD) et révocable à tout moment.",
        ],
      },
      {
        heading: "Cookies",
        body: [
          "Le site public n'utilise pas de cookies de profilage ni de suivi publicitaire. Le seul cookie présent est le cookie technique de session de l'espace d'administration réservé, non installé sur les appareils des visiteurs du site public.",
          "Les polices du site sont hébergées directement sur nos serveurs : aucune donnée n'est transmise à des services externes pour leur affichage.",
        ],
      },
      {
        heading: "Conservation et communication des données",
        body: [
          "Les statistiques de visite anonymes sont conservées sur les serveurs du site et utilisées sous forme agrégée, sans être cédées à des tiers.",
          "Les notifications push sont acheminées via les services de notification du navigateur que vous utilisez (par ex. Google Firebase Cloud Messaging pour Chrome/Android, Apple Push Notification service pour Safari/iOS) : ces prestataires techniques ne reçoivent que l'identifiant nécessaire à la livraison, pas le contenu de votre utilisation du site.",
          "Les données ne sont jamais vendues ni utilisées à des fins de marketing par des tiers.",
        ],
      },
      {
        heading: "Vos droits",
        body: [
          "En tant que personne concernée, vous pouvez à tout moment demander l'accès à vos données, leur rectification, leur suppression, la limitation du traitement, vous y opposer ou demander leur portabilité, en écrivant aux adresses de la page Contact.",
          "Vous avez également le droit d'introduire une réclamation auprès de l'autorité italienne de protection des données (Garante per la protezione dei dati personali, www.garanteprivacy.it) si vous estimez que le traitement enfreint la réglementation en vigueur.",
        ],
      },
      {
        heading: "Modifications de cette notice",
        body: ["Cette notice peut être mise à jour au fil du temps ; la date de dernière mise à jour figure en haut de la page."],
      },
    ],
  },
};
