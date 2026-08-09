import NewsForm from "@/components/admin/NewsForm";

export default function NewNewsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-800">Nuova news</h1>
      <NewsForm />
    </div>
  );
}
