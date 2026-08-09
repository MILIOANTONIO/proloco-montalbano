// Genera le icone PWA e l'asset per l'animazione di apertura a partire dal logo reale
// della Pro Loco Montalbano Elicona (public/brand/logo-proloco-original.jpg).
const path = require("path");
const sharp = require("sharp");

const root = path.join(__dirname, "..", "public");
const src = path.join(root, "brand", "logo-proloco-original.jpg");

async function run() {
  await sharp(src).resize(192, 192).png().toFile(path.join(root, "icons", "icon-192.png"));
  await sharp(src).resize(512, 512).png().toFile(path.join(root, "icons", "icon-512.png"));
  await sharp(src).resize(180, 180).png().toFile(path.join(root, "icons", "apple-touch-icon.png"));
  await sharp(src).resize(600, 600).png().toFile(path.join(root, "brand", "logo-mark.png"));
  console.log("Icone e logo-mark generati dal logo reale della Pro Loco.");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
