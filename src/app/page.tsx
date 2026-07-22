"use client";

import { Calendar } from "lucide-react";
import { ChatInput } from "@/components/chat-input";
import { useArbioChat, requestIntroSeed } from "@/components/arbio-chat";
import { useLang } from "@/components/lang";

export default function Home() {
  const { openChat } = useArbioChat();
  const { t } = useLang();

  const kpis = [
    { label: t("Monatsumsatz", "Monthly revenue"), value: "41.451 €" },
    { label: t("Tagesrate", "Daily rate"), value: "241 €" },
    { label: t("Auslastung", "Occupancy"), value: "55 %" },
    { label: t("Operativer Gewinn", "Operating profit"), value: "33.111 €" },
  ];

  const chips = [
    t("Wöchentlicher Umsatz", "Weekly revenue"),
    t("Top-Performer", "Top performer"),
    t("Buchungstempo", "Booking pace"),
    t("Profitabilität", "Profitability"),
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-10 py-16">
      <h1 className="text-[48px] tracking-[-1px]">{t("Guten Tag, Sebastian.", "Good day, Sebastian.")}</h1>
      <p className="text-[20px] text-muted mt-2">
        {t("Frag uns alles zu Umsatz, Profitabilität oder Forecast.", "Ask us anything about revenue, profitability or forecast.")}
      </p>

      <div className="flex items-center gap-2 text-[15px] text-muted mt-12">
        <Calendar size={15} />
        <span>{t("Aktueller Monat · Juli 2026", "Current month · July 2026")}</span>
      </div>

      <div className="flex gap-4 mt-5 flex-wrap justify-center">
        {kpis.map(({ label, value }) => (
          <div
            key={label}
            className="bg-panel rounded-[24px] px-7 py-5 min-w-[180px]"
          >
            <div className="text-[15px]">{label}</div>
            <div className="text-[28px] tracking-[-0.5px] mt-1">{value}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-24 flex-wrap justify-center">
        {chips.map((c) => (
          <button
            key={c}
            className="border border-line rounded-full px-5 py-2.5 text-[15px] hover:bg-panel"
          >
            {c}
          </button>
        ))}
      </div>

      <ChatInput
        placeholder={t("Frag etwas zu deinem Portfolio...", "Ask anything about your portfolio...")}
        className="w-full max-w-[1060px] mt-5"
        onRequest={() => openChat(requestIntroSeed(t))}
      />
    </div>
  );
}
