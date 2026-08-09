import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { saveUpload } from "@/lib/uploads";

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const formData = await req.formData();
  const kind = formData.get("kind");
  const file = formData.get("file");

  if (typeof kind !== "string" || !["image", "audio", "video"].includes(kind)) {
    return NextResponse.json({ error: "Tipo file non valido" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File mancante" }, { status: 400 });
  }

  try {
    const result = await saveUpload(kind as "image" | "audio" | "video", file);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
