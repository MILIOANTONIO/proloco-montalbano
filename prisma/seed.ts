import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "admin@prolocomontalbano.it";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "montalbano2026";

async function main() {
  const existingAdmin = await prisma.adminUser.findUnique({ where: { email: ADMIN_EMAIL } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await prisma.adminUser.create({ data: { email: ADMIN_EMAIL, passwordHash } });
    console.log(`Admin creato: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD} (CAMBIARE la password dopo il primo accesso)`);
  }

  const poiCount = await prisma.pointOfInterest.count();
  if (poiCount === 0) {
    await prisma.pointOfInterest.create({
      data: {
        slug: "castello-di-montalbano",
        category: "sala_castello",
        order: 1,
        published: true,
        translations: {
          create: [
            {
              locale: "it",
              title: "Castello di Montalbano Elicona",
              description:
                "[CONTENUTO DI ESEMPIO — sostituire con il testo fornito dalla Pro Loco] Il Castello normanno-svevo domina il borgo, tra i più belli d'Italia. Ampliato da Federico II d'Aragona, ospitò la corte reale nel XIV secolo.",
            },
            {
              locale: "en",
              title: "Montalbano Elicona Castle",
              description:
                "[SAMPLE CONTENT — replace with text supplied by Pro Loco] The Norman-Swabian castle overlooks the village, one of the most beautiful in Italy. Enlarged by Frederick II of Aragon, it hosted the royal court in the 14th century.",
            },
            {
              locale: "es",
              title: "Castillo de Montalbano Elicona",
              description:
                "[CONTENIDO DE EJEMPLO — sustituir con el texto proporcionado por la Pro Loco] El castillo normando-suevo domina el pueblo, uno de los más bellos de Italia.",
            },
            {
              locale: "fr",
              title: "Château de Montalbano Elicona",
              description:
                "[CONTENU D'EXEMPLE — à remplacer par le texte fourni par la Pro Loco] Le château normand-souabe domine le village, l'un des plus beaux d'Italie.",
            },
          ],
        },
      },
    });

    await prisma.pointOfInterest.create({
      data: {
        slug: "chiesa-madre-san-nicolo",
        category: "chiesa",
        order: 2,
        published: true,
        translations: {
          create: [
            {
              locale: "it",
              title: "Chiesa Madre San Nicolò di Bari",
              description:
                "[CONTENUTO DI ESEMPIO — sostituire con il testo fornito dalla Pro Loco] Edificio religioso principale del borgo, custodisce opere d'arte sacra di rilievo storico.",
            },
            {
              locale: "en",
              title: "San Nicolò di Bari Mother Church",
              description: "[SAMPLE CONTENT — replace with text supplied by Pro Loco] The main religious building of the village.",
            },
            {
              locale: "es",
              title: "Iglesia Madre San Nicolò di Bari",
              description: "[CONTENIDO DE EJEMPLO — sustituir con el texto proporcionado por la Pro Loco]",
            },
            {
              locale: "fr",
              title: "Église mère San Nicolò di Bari",
              description: "[CONTENU D'EXEMPLE — à remplacer par le texte fourni par la Pro Loco]",
            },
          ],
        },
      },
    });
  }

  const infoCount = await prisma.infoContact.count();
  if (infoCount === 0) {
    await prisma.infoContact.createMany({
      data: [
        { category: "emergenza", name: "Emergenza Sanitaria", phone: "118", order: 1 },
        { category: "emergenza", name: "Carabinieri", phone: "112", order: 2 },
        { category: "emergenza", name: "Vigili del Fuoco", phone: "115", order: 3 },
        {
          category: "farmacia",
          name: "[ESEMPIO] Farmacia Comunale",
          phone: "0941 000000",
          address: "Via da completare, Montalbano Elicona",
          order: 1,
        },
        {
          category: "ufficio",
          name: "Comune di Montalbano Elicona",
          phone: "0941 000000",
          address: "Piazza Maria SS della Provvidenza, Montalbano Elicona",
          order: 1,
        },
        {
          category: "ufficio",
          name: "Pro Loco Montalbano Elicona APS",
          phone: "[da fornire]",
          address: "Piazza Maria SS della Provvidenza, Montalbano Elicona",
          order: 2,
        },
      ],
    });
  }

  // Attività reali trovate via ricerca web (nomi/categoria pubblici, tipo elenco Pagine Gialle);
  // indirizzo/telefono riportati solo dove trovati con certezza nei risultati di ricerca.
  // Foto NON scaricate da internet per diritti d'autore: coverImage resta vuoto, da caricare
  // dall'admin con foto fornite direttamente dall'esercente. Categorie senza attività verificate
  // (panificio, formaggi, cantina, bar, souvenir, affittacamere) hanno un placeholder "[ESEMPIO]"
  // da sostituire, come già avviene per i punti di interesse e le info utili.
  const activityCount = await prisma.activity.count();
  if (activityCount === 0) {
    const activities: {
      categories: string;
      name: string;
      address?: string;
      phone?: string;
      order: number;
      description: string;
    }[] = [
      {
        categories: "ristorazione",
        name: "Al Barile Ristorante Tipico Pizzeria",
        address: "Via Malimpresa, 4, Montalbano Elicona (ME)",
        phone: "0941 676108",
        order: 1,
        description: "Ristorante tipico e pizzeria nel centro del borgo, cucina dei Nebrodi.",
      },
      {
        categories: "ristorazione",
        name: "Pizzeria Villa Sulla",
        order: 2,
        description: "Specialità tipiche dei Nebrodi e pizze cotte in forno a legna. [Indirizzo/telefono da verificare]",
      },
      {
        categories: "ristorazione",
        name: "U Sicilianu",
        order: 3,
        description: "Trattoria, pizzeria e panineria nel cuore di Montalbano Elicona, cucina tipica siciliana. [Indirizzo/telefono da verificare]",
      },
      {
        categories: "ristorazione",
        name: "La Sciarbonata",
        address: "Via Rocca dell'Elmo, Montalbano Elicona (ME)",
        phone: "389 1840789",
        order: 4,
        description: "Ristorante tipico siciliano.",
      },
      {
        categories: "ristorazione",
        name: "Agriturismo Il Gelso",
        address: "Contrada Fontana Pumo, Montalbano Elicona (ME)",
        phone: "339 2849365",
        order: 5,
        description: "Agriturismo con cucina tipica dei Nebrodi.",
      },
      {
        categories: "bnb",
        name: "Al Tripiciano",
        order: 6,
        description: "Bed & Breakfast. [Indirizzo/telefono da verificare]",
      },
      {
        categories: "bnb",
        name: "Marea B&B",
        order: 7,
        description: "Bed & Breakfast. [Indirizzo/telefono da verificare]",
      },
      {
        categories: "bnb",
        name: "Casa Gita a Tindari",
        order: 8,
        description: "Bed & Breakfast. [Indirizzo/telefono da verificare]",
      },
      {
        categories: "bnb",
        name: "San Nicolò",
        order: 15,
        description: "Alloggio a Montalbano Elicona. [Indirizzo/telefono da verificare]",
      },
      {
        categories: "bnb",
        name: "Palazzo Restifa",
        order: 16,
        description: "Alloggio a Montalbano Elicona. [Indirizzo/telefono da verificare]",
      },
      {
        categories: "affittacamere",
        name: "Anteros Luxury Suite",
        order: 17,
        description: "Alloggio a Montalbano Elicona. [Indirizzo/telefono da verificare]",
      },
      {
        categories: "affittacamere",
        name: "Kaaba",
        order: 18,
        description: "Alloggio a Montalbano Elicona. [Indirizzo/telefono da verificare]",
      },
      {
        categories: "panificio",
        name: "Panificio Popolo",
        order: 9,
        description: "Panificio del borgo, pane e prodotti da forno.",
      },
      {
        categories: "ristorazione",
        name: "Antico Forno",
        order: 14,
        description: "Ristorante a Montalbano Elicona.",
      },
      {
        categories: "formaggi",
        name: "[ESEMPIO] Caseificio Nebrodi",
        phone: "[da fornire]",
        order: 10,
        description: "[CONTENUTO DI ESEMPIO — sostituire con un caseificio/formaggeria reale] Provole e formaggi tipici dei Nebrodi.",
      },
      {
        categories: "cantina",
        name: "[ESEMPIO] Cantina del Borgo",
        phone: "[da fornire]",
        order: 11,
        description: "[CONTENUTO DI ESEMPIO — sostituire con una cantina/produttore di vino reale] Vini e degustazioni del territorio.",
      },
      {
        categories: "bar",
        name: "Caffè Trinacria Bartolone Gianni Franco",
        address: "Via Provinciale, 89, Montalbano Elicona (ME)",
        order: 19,
        description: "Bar, 4,5★ (123 recensioni).",
      },
      {
        categories: "bar",
        name: "Il Girasole",
        address: "Corso Principe Umberto, 55/57, Montalbano Elicona (ME)",
        order: 20,
        description: "Bar, 4,3★ (420 recensioni).",
      },
      {
        categories: "bar",
        name: "Bedda Camurria Bar",
        address: "Via Provinciale, 76, Montalbano Elicona (ME)",
        order: 21,
        description: "Bar, 5,0★ (9 recensioni).",
      },
      {
        categories: "ristorazione",
        name: "La Taberna di Arnaldo",
        address: "Via Cavalier Cernuto, 19, Montalbano Elicona (ME)",
        order: 22,
        description: "Ristorante, 4,6★ (103 recensioni).",
      },
      {
        categories: "souvenir",
        name: "[ESEMPIO] Bottega dell'Artigianato",
        phone: "[da fornire]",
        order: 13,
        description: "[CONTENUTO DI ESEMPIO — sostituire con una bottega reale] Souvenir e artigianato locale.",
      },
    ];

    for (const a of activities) {
      await prisma.activity.create({
        data: {
          categories: a.categories,
          name: a.name,
          address: a.address || null,
          phone: a.phone || null,
          order: a.order,
          published: true,
          translations: { create: [{ locale: "it", description: a.description }] },
        },
      });
    }
  }

  const newsCount = await prisma.newsPost.count();
  if (newsCount === 0) {
    await prisma.newsPost.create({
      data: {
        translations: {
          create: [
            { locale: "it", title: "Benvenuti sulla nuova app di Montalbano Elicona", body: "[CONTENUTO DI ESEMPIO] Questo è un comunicato di prova, sostituibile dal pannello admin." },
            { locale: "en", title: "Welcome to the new Montalbano Elicona app", body: "[SAMPLE CONTENT] This is a placeholder news post, editable from the admin panel." },
            { locale: "es", title: "Bienvenidos a la nueva app de Montalbano Elicona", body: "[CONTENIDO DE EJEMPLO] Esta es una noticia de ejemplo." },
            { locale: "fr", title: "Bienvenue sur la nouvelle appli de Montalbano Elicona", body: "[CONTENU D'EXEMPLE] Ceci est une actualité d'exemple." },
          ],
        },
      },
    });
  }

  console.log("Seed completato.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
