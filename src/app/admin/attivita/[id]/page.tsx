import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ActivityForm from "@/components/admin/ActivityForm";

export const dynamic = "force-dynamic";

export default async function EditActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const activity = await prisma.activity.findUnique({ where: { id }, include: { translations: true } });
  if (!activity) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-800">Modifica attività</h1>
      <ActivityForm activityId={activity.id} initial={activity} />
    </div>
  );
}
