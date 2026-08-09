"use client";

import { useState } from "react";

export default function FileUploadField({
  kind,
  label,
  value,
  onChange,
}: {
  kind: "image" | "audio" | "video";
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("kind", kind);
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    setUploading(false);
    if (res.ok) {
      const data = await res.json();
      onChange(data.url);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Upload fallito");
    }
    e.target.value = "";
  }

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {value && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="truncate">{value}</span>
          <button type="button" onClick={() => onChange("")} className="text-red-600 hover:underline">
            rimuovi
          </button>
        </div>
      )}
      <input
        type="file"
        accept={kind === "image" ? "image/*" : kind === "audio" ? "audio/*" : "video/*"}
        onChange={handleFile}
        disabled={uploading}
        className="block w-full text-sm text-gray-600"
      />
      {uploading && <p className="text-xs text-gray-400">Caricamento…</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
