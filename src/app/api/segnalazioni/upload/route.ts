import { NextRequest, NextResponse } from "next/server";
import { saveUpload } from "@/lib/uploads";

const MAX_SIZE = 8 * 1024 * 1024; // 8MB

// Endpoint pubblico (nessun login) usato dal modulo di segnalazione in /attivita:
// consente solo immagini, con un limite di dimensione, per ridurre il rischio di abuso.
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File mancante" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Immagine troppo grande (max 8MB)" }, { status: 400 });
  }

  try {
    const result = await saveUpload("image", file);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
