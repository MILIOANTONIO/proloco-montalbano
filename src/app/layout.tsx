import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";

// Font autoospitato (nessuna richiesta al momento della visita verso i server Google, che
// trasferirebbe l'IP del visitatore fuori UE) — il Garante Privacy italiano ha sanzionato
// piu' siti per il caricamento diretto di Google Fonts via CDN senza consenso.
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: "Montalbano Elicona",
  description: "Guida turistica e informativa di Montalbano Elicona",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1A452F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning className={manrope.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark");}catch(e){}})();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
