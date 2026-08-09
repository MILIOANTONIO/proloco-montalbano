import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PoiForm from "@/components/admin/PoiForm";

export const dynamic = "force-dynamic";

export default async function EditPoiPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const poi = await prisma.pointOfInterest.findUnique({
    where: { id },
    include: { translations: true, chapters: { orderBy: { order: "asc" }, include: { translations: true } } },
  });
  if (!poi) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-800">Modifica punto di interesse</h1>
      <PoiForm poiId={poi.id} initial={poi} />
    </div>
  );
}
