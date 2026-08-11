"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HandledToggle({ id, handled }: { id: string; handled: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    await fetch(`/api/admin/segnalazioni/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handled: !handled }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`rounded-full px-2.5 py-1 text-xs font-medium disabled:opacity-50 ${
        handled ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
      }`}
    >
      {handled ? "Gestita ✓" : "Da gestire"}
    </button>
  );
}
