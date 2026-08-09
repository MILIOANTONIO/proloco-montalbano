import { prisma } from "@/lib/prisma";
import InfoManager from "@/components/admin/InfoManager";

export const dynamic = "force-dynamic";

export default async function AdminInfoPage() {
  const items = await prisma.infoContact.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-800">Informazioni utili</h1>
      <InfoManager items={items} />
    </div>
  );
}
