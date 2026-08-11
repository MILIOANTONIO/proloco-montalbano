import { readFile } from "fs/promises";
import QRCode from "qrcode";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";
import { resolveUploadPath } from "./uploads";

const A4_WIDTH_PT = 595.28;
const A4_HEIGHT_PT = 841.89;

type Box = { left: number; top: number; width: number; height: number };

async function loadImageBuffer(urlOrPath: string): Promise<Buffer> {
  if (urlOrPath.startsWith("/api/uploads/")) {
    const segments = urlOrPath.replace("/api/uploads/", "").split("/");
    return readFile(resolveUploadPath(segments));
  }
  // Asset statico servito da /public (es. /brand/...)
  const path = await import("path");
  return readFile(path.join(process.cwd(), "public", urlOrPath));
}

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function splitTwoLines(text: string): [string, string] {
  const words = text.split(" ");
  if (words.length < 2) return [text, ""];
  let bestIdx = 1;
  let bestDiff = Infinity;
  let acc = words[0].length;
  for (let i = 1; i < words.length; i++) {
    acc += 1 + words[i].length;
    const line1 = words.slice(0, i + 1).join(" ").length;
    const line2 = text.length - line1;
    const diff = Math.abs(line1 - line2);
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = i + 1;
    }
  }
  return [words.slice(0, bestIdx).join(" "), words.slice(bestIdx).join(" ")];
}

/** Etichetta col nome del punto di interesse, per chi stampa e installa il cartello sul posto.
 * Il font si restringe in base alla lunghezza del testo, e va su due righe se necessario. */
async function labelBuffer(text: string, widthPx: number, heightPx: number): Promise<Buffer> {
  const usableWidth = widthPx * 0.94;
  const CHAR_WIDTH_RATIO = 0.56; // stima larghezza media carattere per un bold sans-serif
  const MIN_FONT = 11;
  const MAX_FONT = Math.round(heightPx * 0.42);

  const oneLineFont = Math.min(MAX_FONT, Math.floor(usableWidth / (text.length * CHAR_WIDTH_RATIO)));

  let svgBody: string;
  if (oneLineFont >= MIN_FONT || text.length < 18) {
    const fontSize = Math.max(MIN_FONT, oneLineFont);
    svgBody = `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
      font-family="Arial, sans-serif" font-weight="700" font-size="${fontSize}" fill="#1A452F">${escapeXml(text)}</text>`;
  } else {
    const [line1, line2] = splitTwoLines(text);
    const longest = Math.max(line1.length, line2.length);
    const fontSize = Math.max(MIN_FONT, Math.min(MAX_FONT * 0.8, Math.floor(usableWidth / (longest * CHAR_WIDTH_RATIO))));
    const lineGap = fontSize * 1.05;
    svgBody = `
      <text x="50%" y="${heightPx / 2 - lineGap / 2}" dominant-baseline="middle" text-anchor="middle"
        font-family="Arial, sans-serif" font-weight="700" font-size="${fontSize}" fill="#1A452F">${escapeXml(line1)}</text>
      <text x="50%" y="${heightPx / 2 + lineGap / 2}" dominant-baseline="middle" text-anchor="middle"
        font-family="Arial, sans-serif" font-weight="700" font-size="${fontSize}" fill="#1A452F">${escapeXml(line2)}</text>`;
  }

  const svg = `<svg width="${widthPx}" height="${heightPx}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#ffffff"/>
    ${svgBody}
  </svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

export async function renderPosterPng(templateUrl: string, box: Box, targetUrl: string, label?: string): Promise<Buffer> {
  const templateBuffer = await loadImageBuffer(templateUrl);
  const meta = await sharp(templateBuffer).metadata();
  const width = meta.width || 1054;
  const height = meta.height || 1492;

  const boxLeftPx = Math.round((box.left / 100) * width);
  const boxTopPx = Math.round((box.top / 100) * height);
  const boxWidthPx = Math.round((box.width / 100) * width);
  const boxHeightPx = Math.round((box.height / 100) * height);

  const composites: { input: Buffer; left: number; top: number }[] = [];

  if (label && label.trim()) {
    const labelHeightPx = Math.round(boxHeightPx * 0.18);
    const qrAreaHeightPx = boxHeightPx - labelHeightPx;
    const qrSize = Math.max(32, Math.min(boxWidthPx, qrAreaHeightPx));
    const qrBuffer = await QRCode.toBuffer(targetUrl, { width: qrSize, margin: 1 });
    const qrLeft = boxLeftPx + Math.round((boxWidthPx - qrSize) / 2);
    const qrTop = boxTopPx + Math.round((qrAreaHeightPx - qrSize) / 2);
    composites.push({ input: qrBuffer, left: qrLeft, top: qrTop });

    const labelImg = await labelBuffer(label, boxWidthPx, labelHeightPx);
    composites.push({ input: labelImg, left: boxLeftPx, top: boxTopPx + qrAreaHeightPx });
  } else {
    const qrSize = Math.max(32, Math.min(boxWidthPx, boxHeightPx));
    const qrBuffer = await QRCode.toBuffer(targetUrl, { width: qrSize, margin: 1 });
    const qrLeft = boxLeftPx + Math.round((boxWidthPx - qrSize) / 2);
    const qrTop = boxTopPx + Math.round((boxHeightPx - qrSize) / 2);
    composites.push({ input: qrBuffer, left: qrLeft, top: qrTop });
  }

  return sharp(templateBuffer).composite(composites).png().toBuffer();
}

export async function pngToA4Pdf(pngBuffer: Buffer): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const image = await pdfDoc.embedPng(pngBuffer);
  const page = pdfDoc.addPage([A4_WIDTH_PT, A4_HEIGHT_PT]);
  page.drawImage(image, { x: 0, y: 0, width: A4_WIDTH_PT, height: A4_HEIGHT_PT });
  const bytes = await pdfDoc.save();
  return Buffer.from(bytes);
}
