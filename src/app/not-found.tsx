export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-cream px-6 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/stemma.png" alt="Comune di Montalbano Elicona" className="h-28 w-28 object-contain" />
      <div className="space-y-2">
        <h1 className="font-display text-2xl text-brand-800">Pagina non trovata</h1>
        <p className="text-brand-600">Il contenuto che cerchi non esiste o è stato spostato.</p>
      </div>
      <a
        href="/it"
        className="rounded-full bg-brand-700 px-6 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-brand-800"
      >
        Torna alla home
      </a>
    </div>
  );
}
