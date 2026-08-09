import { NavigationIcon } from "./icons";

export default function DirectionsButton({
  label,
  title,
  lat,
  lng,
}: {
  label: string;
  title: string;
  lat: number | null;
  lng: number | null;
}) {
  const destination = lat != null && lng != null ? `${lat},${lng}` : `${title}, Montalbano Elicona, Italia`;

  const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=walking`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-4 py-2.5 text-sm font-medium text-cream shadow-sm transition-colors duration-200 hover:bg-brand-800"
    >
      <NavigationIcon className="h-4 w-4" />
      {label}
    </a>
  );
}
