import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sendPushToAll } from "@/lib/push";

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const title = body?.title?.trim();
  const message = body?.body?.trim();
  const url = body?.url?.trim() || "/it";
  const image = body?.image?.trim() || undefined;
  if (!title || !message) {
    return NextResponse.json({ error: "Titolo e testo obbligatori" }, { status: 400 });
  }

  const result = await sendPushToAll({ title, body: message, url, image });
  if (result.skipped) {
    return NextResponse.json({ error: "Chiavi VAPID non configurate" }, { status: 500 });
  }
  return NextResponse.json(result);
}
