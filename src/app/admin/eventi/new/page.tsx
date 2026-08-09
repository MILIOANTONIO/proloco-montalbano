import EventForm from "@/components/admin/EventForm";

export default function NewEventPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-800">Nuovo evento</h1>
      <EventForm />
    </div>
  );
}
