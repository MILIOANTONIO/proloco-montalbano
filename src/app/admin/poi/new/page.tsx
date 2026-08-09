import PoiForm from "@/components/admin/PoiForm";

export default function NewPoiPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-gray-800">Nuovo punto di interesse</h1>
      <PoiForm />
    </div>
  );
}
