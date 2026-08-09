// Genera i podcast audio (ElevenLabs, generazione una tantum) per un punto di interesse.
// Uso: node scripts/gen-podcast.js <poiId> <cartellaOutput>
const fs = require("fs");
const path = require("path");

const envPath = path.join(__dirname, "..", ".env.local");
fs.readFileSync(envPath, "utf8").split("\n").forEach((l) => {
  const m = l.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
});

const VOICE_ID = "mcMi8FJDhg35bMpWHv2R"; // Paolo - Dynamic Italian Radio Voice
const [, , POI_ID, OUT_SUBDIR] = process.argv;
if (!POI_ID || !OUT_SUBDIR) {
  console.error("Uso: node scripts/gen-podcast.js <poiId> <cartellaOutput>");
  process.exit(1);
}
const OUT_DIR = path.join(__dirname, "..", "public", "brand", OUT_SUBDIR, "podcast");
fs.mkdirSync(OUT_DIR, { recursive: true });

function stripCredit(text) {
  return text.replace(/\n*\(Foto:[^)]*\)\s*$/i, "").trim();
}

async function synth(text, outFile) {
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: "POST",
    headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.55, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true },
    }),
  });
  if (!res.ok) throw new Error(`ElevenLabs error ${res.status} for ${outFile}: ${await res.text()}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(path.join(OUT_DIR, outFile), buf);
  console.log(`OK ${outFile} (${buf.length} bytes, ${text.length} chars)`);
}

async function main() {
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();

  const poi = await prisma.pointOfInterest.findUnique({
    where: { id: POI_ID },
    include: { translations: true, chapters: { orderBy: { order: "asc" }, include: { translations: true } } },
  });
  if (!poi) throw new Error("POI non trovato: " + POI_ID);

  const mainIt = poi.translations.find((t) => t.locale === "it");
  const jobs = [{ text: stripCredit(mainIt.description), file: "00-intro.mp3", label: "Introduzione" }];
  poi.chapters.forEach((ch, i) => {
    const trIt = ch.translations.find((t) => t.locale === "it");
    if (trIt && trIt.text.trim()) jobs.push({ text: stripCredit(trIt.text), file: `${String(i + 1).padStart(2, "0")}-capitolo.mp3`, label: trIt.heading });
  });

  for (const job of jobs) {
    console.log(`Generando: ${job.label}...`);
    await synth(job.text, job.file);
  }
  console.log("\nFatto. File in", OUT_DIR);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
