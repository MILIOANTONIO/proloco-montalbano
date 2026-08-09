import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EventForm from "@/components/admin/EventForm";

export const dynamic = "force-dynamic";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await prisma.eventItem.findUnique({ where: { id }, include: { translations: true } });
  if (!event) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-800">Modifica evento</h1>
      <EventForm eventId={event.id} initial={event} />
    </div>
  );
}
