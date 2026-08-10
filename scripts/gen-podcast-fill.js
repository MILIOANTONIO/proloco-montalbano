// Completa gli audio mancanti in EN/FR (stessa voce di sempre) e rigenera TUTTO lo spagnolo
// con la nuova voce "Arconte" (accento peninsulare, profonda). Normalizza il volume di ogni
// file generato con ffmpeg (loudnorm) cosi il volume percepito resta costante tra le lingue.
const fs = require("fs");
const path = require("path");
const ffmpegPath = require("ffmpeg-static");
const { execFileSync } = require("child_process");

const envPath = path.join(__dirname, "..", ".env.local");
fs.readFileSync(envPath, "utf8").split("\n").forEach((l) => {
  const m = l.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
});
// Legge i testi da uno snapshot READ-ONLY del DB di produzione (non dal dev.db locale, che
// puo' essere disallineato). Gli aggiornamenti di audioUrl vengono scritti in un file JSON
// e applicati poi alla produzione vera con uno script separato via SSH.
process.env.DATABASE_URL = "file:" + path.resolve(__dirname, "..", "prisma", "prod-snapshot.db");
const updates = [];

const VOICES = {
  en: "nPczCjzI2devNBz1zQrb", // Brian - Deep, Resonant and Comforting (invariata)
  fr: "N2lVS1w4EtoT3dr4eOWO", // Callum - Husky Trickster (invariata)
  es: "QtPMrakdgePQIUwOX7Ut", // Arconte - Evocative, Deep and Elegant (nuova, sostituisce VOXZ)
};

// Le lingue per cui rigeneriamo SEMPRE (anche se il file esiste gia', per cambiare voce).
const FORCE_REGEN = new Set(["es"]);

function stripCredit(text) {
  return text.replace(/\n*\(Foto:[^)]*\)\s*$/i, "").replace(/\n*\(Photo:[^)]*\)\s*$/i, "").trim();
}

function normalizeVolume(filePath) {
  const tmp = filePath + ".norm.mp3";
  execFileSync(ffmpegPath, [
    "-y", "-i", filePath,
    "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
    "-ar", "44100", "-b:a", "128k",
    tmp,
  ], { stdio: "pipe" });
  fs.renameSync(tmp, filePath);
}

async function synth(text, outPath, locale) {
  if (fs.existsSync(outPath) && !FORCE_REGEN.has(locale)) {
    console.log(`SKIP (esiste già) ${outPath}`);
    return;
  }
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
  normalizeVolume(outPath);
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
      await synth(stripCredit(tr.description), path.join(podcastDir, introFile), locale);
      const introUrl = `${path.dirname(it.audioUrl)}/${introFile}`;
      if (tr.audioUrl !== introUrl) {
        updates.push({ model: "poiTranslation", id: tr.id, audioUrl: introUrl });
      }

      let chapterIndex = 0;
      for (const ch of poi.chapters) {
        chapterIndex++;
        const chTr = ch.translations.find((t) => t.locale === locale);
        if (!chTr || !chTr.text.trim()) continue;
        const chFile = `${String(chapterIndex).padStart(2, "0")}-capitolo-${locale}.mp3`;
        await synth(stripCredit(chTr.text), path.join(podcastDir, chFile), locale);
        const chUrl = `${path.dirname(it.audioUrl)}/${chFile}`;
        if (chTr.audioUrl !== chUrl) {
          updates.push({ model: "poiChapterTranslation", id: chTr.id, audioUrl: chUrl });
        }
      }
    }
    console.log(`--- Completato ${poi.slug} ---`);
  }

  fs.writeFileSync(path.join(__dirname, "audio-updates.json"), JSON.stringify(updates, null, 2));
  console.log(`\nFatto. ${updates.length} aggiornamenti audioUrl salvati in scripts/audio-updates.json`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
