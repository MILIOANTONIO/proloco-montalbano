"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({ url, label = "Elimina" }: { url: string; label?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!confirm("Confermi l'eliminazione? L'operazione non è reversibile.")) return;
    setBusy(true);
    await fetch(url, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  return (
    <button onClick={handleDelete} disabled={busy} className="text-red-600 hover:underline disabled:opacity-50">
      {busy ? "…" : label}
    </button>
  );
}
