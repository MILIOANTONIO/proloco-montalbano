type IconProps = { className?: string };
const base = "w-6 h-6";

export function MapIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  );
}

export function InfoIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="11" x2="12" y2="16.5" />
      <circle cx="12" cy="7.75" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function CalendarIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="16" rx="2" />
      <line x1="3.5" y1="9.5" x2="20.5" y2="9.5" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="16" y1="3" x2="16" y2="7" />
    </svg>
  );
}

export function NewspaperIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 5.5h12A2.5 2.5 0 0 1 18.5 8v11A2.5 2.5 0 0 0 21 16.5V8" />
      <path d="M4 5.5v13A2.5 2.5 0 0 0 6.5 21H19" />
      <line x1="7.5" y1="9" x2="14.5" y2="9" />
      <line x1="7.5" y1="12.5" x2="14.5" y2="12.5" />
      <line x1="7.5" y1="16" x2="12" y2="16" />
    </svg>
  );
}

export function PhoneIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M6.5 3.5h3L11 8l-2.3 1.5a11 11 0 0 0 5.8 5.8L16 13l4.5 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z" />
    </svg>
  );
}

export function PinIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 21s7-6.4 7-11.5A7 7 0 0 0 5 9.5C5 14.6 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.3" />
    </svg>
  );
}

export function LandmarkIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <line x1="3" y1="21" x2="21" y2="21" />
      <path d="M4 21V10M9 21V10M15 21V10M20 21V10" />
      <path d="M3 10 12 4l9 6" />
    </svg>
  );
}

export function CastleIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 21V9l2-2v3h3V7h3v3h3V7h3v3l2-2v12Z" />
      <line x1="4" y1="21" x2="20" y2="21" />
      <line x1="12" y1="14" x2="12" y2="21" />
    </svg>
  );
}

export function ChurchIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 3v3M10.5 4.5h3" />
      <path d="M12 6l7 5v10H5V11Z" />
      <line x1="12" y1="11" x2="12" y2="21" />
      <line x1="9" y1="21" x2="9" y2="15" />
      <line x1="15" y1="21" x2="15" y2="15" />
    </svg>
  );
}

export function TreeIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12 3 7 11h2.5L6 17h5.2V21h1.6v-4H18l-3.5-6H17Z" />
    </svg>
  );
}

export function ArtifactIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M6 3h12l-1 6a5 5 0 0 1-10 0Z" />
      <line x1="12" y1="9" x2="12" y2="17" />
      <path d="M8 21c0-2 1.8-3 4-3s4 1 4 3Z" />
    </svg>
  );
}

export function BuildingIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="5" y="4" width="10" height="17" rx="1" />
      <rect x="15" y="9" width="5" height="12" rx="1" />
      <line x1="8" y1="8" x2="8" y2="8.01" />
      <line x1="12" y1="8" x2="12" y2="8.01" />
      <line x1="8" y1="12" x2="8" y2="12.01" />
      <line x1="12" y1="12" x2="12" y2="12.01" />
    </svg>
  );
}

export function CrossIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

export function ContactIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" />
    </svg>
  );
}

export function BellIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M6 10a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function ChevronLeftIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <polyline points="15 5 8 12 15 19" />
    </svg>
  );
}

export function AwardIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="8.5" r="5.5" />
      <path d="M8.5 13 7 21l5-2.5L17 21l-1.5-8" />
    </svg>
  );
}

export function PlayIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8.5v7l6-3.5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function NavigationIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 11 20 4l-7 17-2.5-7.5L3 11Z" />
    </svg>
  );
}

export function QrIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3.5" y="3.5" width="6" height="6" rx="1" />
      <rect x="14.5" y="3.5" width="6" height="6" rx="1" />
      <rect x="3.5" y="14.5" width="6" height="6" rx="1" />
      <line x1="14.5" y1="14.5" x2="14.5" y2="20.5" />
      <line x1="20.5" y1="14.5" x2="20.5" y2="20.5" />
      <line x1="17.5" y1="14.5" x2="20.5" y2="14.5" />
      <line x1="14.5" y1="17.5" x2="20.5" y2="17.5" />
    </svg>
  );
}

export function SpeakerIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 9.5h3.2L12 5.5v13L7.2 14.5H4Z" />
      <path d="M16.2 9a4.2 4.2 0 0 1 0 6" />
      <path d="M18.6 6.8a7.6 7.6 0 0 1 0 10.4" />
    </svg>
  );
}

export function VideoIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="3.5" y="6" width="12" height="12" rx="2" />
      <path d="M15.5 10.2 20.5 7v10l-5-3.2Z" />
    </svg>
  );
}

export function StoreIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M4 9V6l1.5-2.5h13L20 6v3" />
      <path d="M4 9a2.2 2.2 0 0 0 4.4 0 2.2 2.2 0 0 0 4.4 0 2.2 2.2 0 0 0 4.4 0 2.2 2.2 0 0 0 4.4 0" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h5v-6h2v6h5a1 1 0 0 0 1-1V9.5" />
    </svg>
  );
}

export function UtensilsIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M7 3v6a2 2 0 1 1-4 0V3" />
      <line x1="5" y1="9" x2="5" y2="21" />
      <path d="M17 3c-1.4 0-2.5 1.8-2.5 5s1.1 4 2.5 4v9" />
    </svg>
  );
}

export function BreadIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 13c0-5.2 4-9 9-9s9 3.8 9 9-4.2 4-9 4-9 1.2-9-4Z" />
      <path d="M8 9.5v3M12 8.5v4.5M16 9.5v3" />
    </svg>
  );
}

export function CheeseIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 18.5 12 4l9 14.5Z" />
      <circle cx="9.2" cy="15" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="13.2" cy="12" r="0.9" fill="currentColor" stroke="none" />
      <circle cx="11" cy="17.2" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BedIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="5" y="11" width="6.5" height="4" rx="1" />
      <path d="M3 20v-6a2 2 0 0 1 2-2h6.5a2 2 0 0 1 2 2v1h4.5a2.5 2.5 0 0 1 2.5 2.5V20" />
      <line x1="3" y1="16.5" x2="21" y2="16.5" />
      <line x1="3" y1="20" x2="3" y2="17.5" />
      <line x1="21" y1="20" x2="21" y2="17.5" />
    </svg>
  );
}

export function WineIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M7.5 3h9l-1.2 8a4.3 4.3 0 0 1-6.6 0Z" />
      <line x1="12" y1="12.8" x2="12" y2="20" />
      <line x1="8" y1="21" x2="16" y2="21" />
    </svg>
  );
}

export function CoffeeIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 8h11v6a5 5 0 0 1-5 5H9a4 4 0 0 1-4-4Z" />
      <path d="M16 9.5h1.2a2.3 2.3 0 0 1 0 4.5H16" />
      <path d="M8 3c0 1-1 1-1 2M12 3c0 1-1 1-1 2" />
    </svg>
  );
}

export function GiftIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="4" y="9" width="16" height="11" rx="1" />
      <line x1="4" y1="13.2" x2="20" y2="13.2" />
      <line x1="12" y1="9" x2="12" y2="20" />
      <path d="M12 9C9.3 9 8 7.4 8 6.2a2 2 0 1 1 4 0Zm0 0c2.7 0 4-1.6 4-2.8a2 2 0 1 0-4 0Z" />
    </svg>
  );
}

export const categoryIcons: Record<string, (props: IconProps) => React.JSX.Element> = {
  monumento: LandmarkIcon,
  sala_castello: CastleIcon,
  chiesa: ChurchIcon,
  museo: LandmarkIcon,
  piazza: PinIcon,
  natura: TreeIcon,
  archeologico: ArtifactIcon,
};

export const infoCategoryIcons: Record<string, (props: IconProps) => React.JSX.Element> = {
  emergenza: CrossIcon,
  farmacia: CrossIcon,
  ufficio: BuildingIcon,
  altro: ContactIcon,
};

export const activityCategoryIcons: Record<string, (props: IconProps) => React.JSX.Element> = {
  ristorazione: UtensilsIcon,
  panificio: BreadIcon,
  formaggi: CheeseIcon,
  macelleria: StoreIcon,
  bnb: BedIcon,
  affittacamere: BedIcon,
  cantina: WineIcon,
  bar: CoffeeIcon,
  souvenir: GiftIcon,
  altro: StoreIcon,
};
