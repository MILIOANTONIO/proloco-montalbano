"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type UserItem = { id: string; email: string; createdAt: string };

export default function UsersManager({ users, myEmail }: { users: UserItem[]; myEmail: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changing, setChanging] = useState(false);
  const [changeError, setChangeError] = useState<string | null>(null);
  const [changeOk, setChangeOk] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setCreating(false);
    if (res.ok) {
      setEmail("");
      setPassword("");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setCreateError(data.error || "Errore durante la creazione");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Confermi l'eliminazione di questo utente?")) return;
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    router.refresh();
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setChanging(true);
    setChangeError(null);
    setChangeOk(false);
    const res = await fetch("/api/admin/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    setChanging(false);
    if (res.ok) {
      setCurrentPassword("");
      setNewPassword("");
      setChangeOk(true);
    } else {
      const data = await res.json().catch(() => ({}));
      setChangeError(data.error || "Errore durante il cambio password");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-500">
              <tr>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Da</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-gray-100">
                  <td className="px-3 py-2 font-medium text-gray-800">
                    {u.email}
                    {u.email === myEmail && <span className="ml-2 text-xs text-gray-400">(tu)</span>}
                  </td>
                  <td className="px-3 py-2 text-gray-500">{new Date(u.createdAt).toLocaleDateString("it-IT")}</td>
                  <td className="px-3 py-2 text-right">
                    {users.length > 1 && (
                      <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:underline">
                        Elimina
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form onSubmit={handleCreate} className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="font-semibold text-gray-800">Nuovo utente amministratore</h2>
          {createError && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{createError}</p>}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Password (almeno 8 caratteri)</label>
            <input
              required
              type="password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <button type="submit" disabled={creating} className="rounded bg-gray-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
            {creating ? "Creazione…" : "Crea utente"}
          </button>
        </form>
      </div>

      <form onSubmit={handleChangePassword} className="h-fit space-y-3 rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="font-semibold text-gray-800">Cambia la tua password</h2>
        {changeError && <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{changeError}</p>}
        {changeOk && <p className="rounded bg-green-50 px-3 py-2 text-sm text-green-700">Password aggiornata.</p>}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Password attuale</label>
          <input
            required
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Nuova password (almeno 8 caratteri)</label>
          <input
            required
            type="password"
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded border border-gray-300 px-3 py-2"
          />
        </div>
        <button type="submit" disabled={changing} className="rounded bg-gray-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
          {changing ? "Salvataggio…" : "Aggiorna password"}
        </button>
      </form>
    </div>
  );
}
