import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import UsersManager from "@/components/admin/UsersManager";

export const dynamic = "force-dynamic";

export default async function AdminUtentiPage() {
  const session = await getSession();
  const users = await prisma.adminUser.findMany({
    select: { id: true, email: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Utenti amministratori</h1>
        <p className="text-sm text-gray-500">Chi può accedere a questo pannello di gestione.</p>
      </div>
      <UsersManager users={users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() }))} myEmail={session?.email || ""} />
    </div>
  );
}
