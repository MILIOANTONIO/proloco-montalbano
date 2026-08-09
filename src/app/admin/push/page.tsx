"use client";

import { useState } from "react";

export default function AdminPushPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("/it");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!confirm("Inviare questa notifica a tutti gli utenti iscritti?")) return;
    setSending(true);
    setError(null);
    setResult(null);
    const res = await fetch("/api/admin/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body: message, url }),
    });
    setSending(false);
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setResult(`Inviata a ${data.sent}/${data.total} iscritti.`);
      setTitle("");
      setMessage("");
    } else {
      setError(data.error || "Errore durante l'invio");
    }
  }

  return (
    <div className="max-w-lg space-y-4">
      <h1 className="text-xl font-bold text-gray-800">Notifiche push</h1>
      <p className="text-sm text-gray-500">Invia una notifica a tutti gli utenti che hanno installato l&apos;app e attivato le notifiche.</p>

      {result && <p className="rounded bg-green-50 px-3 py-2 text-sm text-green-700">{result}</p>}
      {error && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Titolo</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Testo</label>
          <textarea required value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="w-full rounded border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Link (opzionale)</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)} className="w-full rounded border border-gray-300 px-3 py-2" placeholder="/it/eventi" />
        </div>
        <button type="submit" disabled={sending} className="rounded bg-gray-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
          {sending ? "Invio…" : "Invia notifica"}
        </button>
      </form>
    </div>
  );
}
