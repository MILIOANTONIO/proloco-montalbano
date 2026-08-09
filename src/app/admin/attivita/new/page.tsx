import ActivityForm from "@/components/admin/ActivityForm";

export default function NewActivityPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-800">Nuova attività</h1>
      <ActivityForm />
    </div>
  );
}
