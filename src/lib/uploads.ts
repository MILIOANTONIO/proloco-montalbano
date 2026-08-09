import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

const ROOT = path.resolve(process.env.UPLOADS_DIR || "./uploads");

const ALLOWED: Record<string, string[]> = {
  image: [".jpg", ".jpeg", ".png", ".webp"],
  audio: [".mp3", ".wav", ".m4a", ".ogg"],
  video: [".mp4", ".webm", ".mov"],
};

export function isAllowedExt(kind: keyof typeof ALLOWED, ext: string) {
  return ALLOWED[kind].includes(ext.toLowerCase());
}

export async function saveUpload(kind: "image" | "audio" | "video", file: File) {
  const ext = path.extname(file.name) || "";
  if (!isAllowedExt(kind, ext)) {
    throw new Error(`Formato file non consentito per ${kind}: ${ext}`);
  }

  const subdir = path.join(ROOT, kind);
  await mkdir(subdir, { recursive: true });

  const filename = `${crypto.randomUUID()}${ext.toLowerCase()}`;
  const filePath = path.join(subdir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return { url: `/api/uploads/${kind}/${filename}` };
}

export function resolveUploadPath(segments: string[]) {
  const filePath = path.join(ROOT, ...segments);
  if (!filePath.startsWith(ROOT)) throw new Error("Percorso non valido");
  return filePath;
}
