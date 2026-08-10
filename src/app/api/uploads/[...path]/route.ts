import { NextRequest, NextResponse } from "next/server";
import { createReadStream } from "fs";
import { stat } from "fs/promises";
import { Readable } from "stream";
import { resolveUploadPath } from "@/lib/uploads";

// Senza questo, Next.js mette in cache la risposta di questa route (inclusi i 404) al momento
// della build, quando la cartella upload è ancora vuota: i file caricati dopo il deploy
// risulterebbero sempre "non trovati" anche se presenti sul disco.
export const dynamic = "force-dynamic";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".mp3": "audio/mpeg",
  ".wav": "audio/wav",
  ".m4a": "audio/mp4",
  ".ogg": "audio/ogg",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

// I file audio/video vanno serviti con supporto alle richieste Range: senza,
// il browser può bloccarsi a metà riproduzione quando prova a fare seek/buffering.
export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;
  try {
    const filePath = resolveUploadPath(segments);
    const { size } = await stat(filePath);
    const ext = "." + (filePath.split(".").pop() || "");
    const contentType = CONTENT_TYPES[ext.toLowerCase()] || "application/octet-stream";

    const range = req.headers.get("range");
    if (range) {
      const match = /bytes=(\d*)-(\d*)/.exec(range);
      const start = match?.[1] ? parseInt(match[1], 10) : 0;
      const end = match?.[2] ? parseInt(match[2], 10) : size - 1;
      const chunkEnd = Math.min(end, size - 1);

      const stream = createReadStream(filePath, { start, end: chunkEnd });
      return new NextResponse(Readable.toWeb(stream) as unknown as BodyInit, {
        status: 206,
        headers: {
          "Content-Type": contentType,
          "Content-Range": `bytes ${start}-${chunkEnd}/${size}`,
          "Accept-Ranges": "bytes",
          "Content-Length": String(chunkEnd - start + 1),
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    const stream = createReadStream(filePath);
    return new NextResponse(Readable.toWeb(stream) as unknown as BodyInit, {
      headers: {
        "Content-Type": contentType,
        "Accept-Ranges": "bytes",
        "Content-Length": String(size),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "File non trovato" }, { status: 404 });
  }
}
