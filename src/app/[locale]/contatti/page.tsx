import { getDictionary } from "@/lib/i18n";
import { PinIcon, PhoneIcon } from "@/components/icons";

export default async function ContattiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="font-display text-3xl font-bold text-brand-900">{t.contatti.title}</h1>
      <div className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
        <p className="font-display text-lg font-semibold text-brand-900">Pro Loco Montalbano Elicona APS</p>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-brand-600">
          <PinIcon className="h-4 w-4" /> Piazza Maria SS. della Provvidenza, 1, 98065 Montalbano Elicona (ME)
        </p>
        <a href="tel:+390941679384" className="mt-1 flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-800">
          <PhoneIcon className="h-4 w-4" /> 0941 679384
        </a>
      </div>
    </div>
  );
}
