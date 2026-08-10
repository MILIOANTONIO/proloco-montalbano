import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

const DEEPL_TARGET: Record<string, string> = { en: "EN-GB", es: "ES", fr: "FR" };

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });

  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "DEEPL_API_KEY non configurata" }, { status: 500 });

  const body = await req.json().catch(() => null);
  const texts: string[] = Array.isArray(body?.texts) ? body.texts : [];
  const targetLocale: string = body?.targetLocale;
  const targetLang = DEEPL_TARGET[targetLocale];
  if (!texts.length || !targetLang) {
    return NextResponse.json({ error: "Parametri mancanti (texts, targetLocale)" }, { status: 400 });
  }

  const host = apiKey.endsWith(":fx") ? "api-free.deepl.com" : "api.deepl.com";
  const params = new URLSearchParams();
  for (const t of texts) params.append("text", t || "");
  params.append("target_lang", targetLang);
  params.append("source_lang", "IT");
  params.append("tag_handling", "html");

  const res = await fetch(`https://${host}/v2/translate`, {
    method: "POST",
    headers: { Authorization: `DeepL-Auth-Key ${apiKey}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return NextResponse.json({ error: `Errore DeepL (${res.status})`, detail }, { status: 502 });
  }

  const data = await res.json();
  const translations: string[] = (data.translations || []).map((t: { text: string }) => t.text);
  return NextResponse.json({ translations });
}
