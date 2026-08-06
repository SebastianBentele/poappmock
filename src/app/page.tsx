"use client";

import { Calendar } from "lucide-react";
import { ChatInput } from "@/components/chat-input";
import { useArbioChat, requestIntroSeed } from "@/components/arbio-chat";
import { useLang } from "@/components/lang";
import { AskAi } from "@/components/ask-ai";
import { metricSeed } from "@/components/metric-insights";

export default function Home() {
  const { openChat } = useArbioChat();
  const { t } = useLang();

  const kpis = [
    { metric: "revenue", label: t("Monatsumsatz", "Monthly revenue"), value: "41.451 €" },
    { metric: "adr", label: t("Tagesrate", "Daily rate"), value: "241 €" },
    { metric: "occupancy", label: t("Auslastung", "Occupancy"), value: "55 %" },
    { metric: "profit", label: t("Operativer Gewinn", "Operating profit"), value: "33.111 €" },
  ];

  const chips = [
    { metric: "weekly-revenue", label: t("Wöchentlicher Umsatz", "Weekly revenue") },
    { metric: "top-performer", label: t("Top-Performer", "Top performer") },
    { metric: "booking-pace", label: t("Buchungstempo", "Booking pace") },
    { metric: "profitability", label: t("Profitabilität", "Profitability") },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-10 py-16">
      <h1 className="text-[48px] tracking-[-1px]">{t("Guten Tag, Testnutzer.", "Good day, test user.")}</h1>
      <p className="text-[20px] text-muted mt-2">
        {t("Frag uns alles zu Umsatz, Profitabilität oder Forecast.", "Ask us anything about revenue, profitability or forecast.")}
      </p>

      <div className="flex items-center gap-2 text-[15px] text-muted mt-12">
        <Calendar size={15} />
        <span>{t("Aktueller Monat · Juli 2026", "Current month · July 2026")}</span>
      </div>

      <div className="flex gap-4 mt-5 flex-wrap justify-center">
        {kpis.map(({ metric, label, value }) => (
          <div
            key={label}
            className="group relative bg-panel rounded-[24px] px-7 py-5 min-w-[180px]"
          >
            <AskAi metric={metric} />
            <div className="text-[15px]">{label}</div>
            <div className="text-[28px] tracking-[-0.5px] mt-1">{value}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-24 flex-wrap justify-center">
        {chips.map(({ metric, label }) => (
          <button
            key={metric}
            onClick={() => openChat(metricSeed(metric, t))}
            className="border border-line rounded-full px-5 py-2.5 text-[15px] hover:bg-panel"
          >
            {label}
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
