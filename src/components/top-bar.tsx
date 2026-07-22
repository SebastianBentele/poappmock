"use client";

import { usePathname } from "next/navigation";
import { useLang } from "@/components/lang";

// Route → page header. Home ("/") and any unlisted route render no bar,
// so the chat hero keeps its bespoke layout.
const TITLES: Record<string, { de: string; en: string; subDe?: string; subEn?: string }> = {
  "/einheiten": {
    de: "Portfolio",
    en: "Portfolio",
    subDe: "Deine Einheiten auf der Karte und im Überblick",
    subEn: "Your units on the map and at a glance",
  },
  "/portfolio": {
    de: "Umsatz",
    en: "Revenue",
    subDe: "Umsatz, Auslastung und Buchungstempo im Überblick",
    subEn: "Revenue, occupancy and booking pace at a glance",
  },
  "/finanzen": {
    de: "Finanzen",
    en: "Finance",
    subDe: "Dein P&L, deine Auszahlungen und Abrechnungen im Überblick",
    subEn: "Your P&L, payouts and statements at a glance",
  },
  "/operativ": {
    de: "Operations",
    en: "Operations",
    subDe: "Was gerade passiert — und was Arbio für dich erledigt",
    subEn: "What's happening right now — and what Arbio gets done for you",
  },
  "/kalender": {
    de: "Kalender",
    en: "Calendar",
    subDe: "Alle Einheiten, Buchungen und Wartungen im Überblick",
    subEn: "All units, bookings and maintenance at a glance",
  },
  "/profil": { de: "Profil", en: "Profile" },
};

export function TopBar() {
  const pathname = usePathname();
  const { t } = useLang();
  const entry = TITLES[pathname];
  if (!entry) return null;

  const sub = entry.subDe ? t(entry.subDe, entry.subEn ?? entry.subDe) : null;

  return (
    <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-line">
      {/* right padding keeps the title clear of the language toggle + bell */}
      <div className="px-8 py-4 pr-[190px]">
        <h1 className="text-[20px] leading-tight">{t(entry.de, entry.en)}</h1>
        {sub && <p className="text-[13px] text-muted mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
