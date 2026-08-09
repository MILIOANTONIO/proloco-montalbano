"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type InfoItem = {
  id: string;
  category: string;
  name: string;
  phone: string | null;
  address: string | null;
  notes: string | null;
  order: number;
};

const CATEGORIES = [
  { value: "emergenza", label: "Numero di emergenza" },
  { value: "farmacia", label: "Farmacia / servizio sanitario" },
  { value: "ufficio", label: "Ufficio / servizio pubblico" },
  { value: "altro", label: "Altro contatto utile" },
];

const emptyForm = { category: "emergenza", name: "", phone: "", address: "", notes: "", order: 0 };

export default function InfoManager({ items }: { items: InfoItem[] }) {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function startEdit(item: InfoItem) {
    setEditingId(item.id);
    setForm({
      category: item.category,
      name: item.name,
      phone: item.phone || "",
      address: item.address || "",
      notes: item.notes || "",
      order: item.order,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch(editingId ? `/api/admin/info/${editingId}` : "/api/admin/info", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      resetForm();
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Errore durante il salvataggio");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Confermi l'eliminazione?")) return;
    await fetch(`/api/admin/info/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-3 py-2">Categoria</th>
              <th className="px-3 py-2">Nome</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-gray-100">
                <td className="px-3 py-2 text-gray-500">{CATEGORIES.find((c) => c.value === item.category)?.label || item.category}</td>
                <td className="px-3 py-2 font-medium text-gray-800">{item.name}</td>
                <td className="px-3 py-2 text-right">
                  <button onClick={() => startEdit(item)} className="mr-3 text-gray-600 hover:underline">
                    Modifica
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline">
                    Elimina
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={3} className="px-3 py-6 text-center text-gray-400">
                  Nessun contatto inserito.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="font-semibold text-gray-800">{editingId ? "Modifica contatto" : "Nuovo contatto"}</h2>
        {error && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Categoria</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full rounded border border-gray-300 px-3 py-2"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Nome</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Telefono</label>
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Indirizzo</label>
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Note</label>
          <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full rounded border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Ordine</label>
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="rounded bg-gray-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
            {saving ? "Salvataggio…" : editingId ? "Aggiorna" : "Aggiungi"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-600">
              Annulla
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
