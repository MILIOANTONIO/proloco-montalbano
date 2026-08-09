// Genera i podcast audio (ElevenLabs) per tutti i POI e capitoli, nelle lingue EN/ES/FR,
// con voci dinamiche/profonde selezionate per lingua. IT resta invariato (già generato).
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env.local");
fs.readFileSync(envPath, "utf8").split("\n").forEach((l) => {
  const m = l.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
});

const VOICES = {
  en: "nPczCjzI2devNBz1zQrb", // Brian - Deep, Resonant and Comforting
  es: "rYfJkB5tkRMd0eVr5Lon", // VOXZ Hombre Wings - profonda, matura ma dinamica
  fr: "N2lVS1w4EtoT3dr4eOWO", // Callum - Husky Trickster (voce profonda)
};

function stripCredit(text) {
  return text.replace(/\n*\(Foto:[^)]*\)\s*$/i, "").replace(/\n*\(Photo:[^)]*\)\s*$/i, "").trim();
}

async function synth(text, outPath) {
  if (fs.existsSync(outPath)) {
    console.log(`SKIP (esiste già) ${outPath}`);
    return;
  }
  const locale = path.basename(outPath).match(/-(en|es|fr)\.mp3$/)[1];
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICES[locale]}`, {
    method: "POST",
    headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.55, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true },
    }),
  });
  if (!res.ok) throw new Error(`ElevenLabs error ${res.status} for ${outPath}: ${await res.text()}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(outPath, buf);
  console.log(`OK ${outPath} (${buf.length} bytes, ${text.length} chars)`);
}

async function main() {
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();

  const pois = await prisma.pointOfInterest.findMany({
    include: { translations: true, chapters: { orderBy: { order: "asc" }, include: { translations: true } } },
    orderBy: { order: "asc" },
  });

  for (const poi of pois) {
    const it = poi.translations.find((t) => t.locale === "it");
    // La cartella podcast è derivata dal percorso del file audio italiano esistente.
    const podcastDir = it?.audioUrl ? path.join(__dirname, "..", "public", path.dirname(it.audioUrl)) : null;
    if (!podcastDir) {
      console.log(`Skip ${poi.slug}: nessun audioUrl IT di riferimento`);
      continue;
    }
    fs.mkdirSync(podcastDir, { recursive: true });

    for (const locale of ["en", "es", "fr"]) {
      const tr = poi.translations.find((t) => t.locale === locale);
      if (!tr || !tr.description.trim()) continue;

      const introFile = `00-intro-${locale}.mp3`;
      await synth(stripCredit(tr.description), path.join(podcastDir, introFile));
      const introUrl = `${path.dirname(it.audioUrl)}/${introFile}`;
      await prisma.poiTranslation.update({ where: { id: tr.id }, data: { audioUrl: introUrl } });

      let chapterIndex = 0;
      for (const ch of poi.chapters) {
        chapterIndex++;
        const chTr = ch.translations.find((t) => t.locale === locale);
        if (!chTr || !chTr.text.trim()) continue;
        const chFile = `${String(chapterIndex).padStart(2, "0")}-capitolo-${locale}.mp3`;
        await synth(stripCredit(chTr.text), path.join(podcastDir, chFile));
        const chUrl = `${path.dirname(it.audioUrl)}/${chFile}`;
        await prisma.poiChapterTranslation.update({ where: { id: chTr.id }, data: { audioUrl: chUrl } });
      }
    }
    console.log(`--- Completato ${poi.slug} ---`);
  }

  console.log("\nFatto.");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
