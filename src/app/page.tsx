"use client";

import { Calendar, LifeBuoy } from "lucide-react";
import { ChatInput } from "@/components/chat-input";
import { useArbioChat, requestIntroSeed } from "@/components/arbio-chat";

const kpis = [
  { label: "Monatsumsatz", value: "41.451 €" },
  { label: "Tagesrate", value: "241 €" },
  { label: "Auslastung", value: "55 %" },
  { label: "Operativer Gewinn", value: "33.111 €" },
];

const chips = ["Wöchentlicher Umsatz", "Top-Performer", "Buchungstempo", "Profitabilität"];

export default function Home() {
  const { openChat } = useArbioChat();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-10 py-16">
      <h1 className="text-[48px] tracking-[-1px]">Guten Tag, Sebastian.</h1>
      <p className="text-[20px] text-muted mt-2">
        Frag uns alles zu Umsatz, Profitabilität oder Forecast.
      </p>

      <div className="flex items-center gap-2 text-[15px] text-muted mt-12">
        <Calendar size={15} />
        <span>Aktueller Monat · Juli 2026</span>
      </div>

      <div className="flex gap-4 mt-5 flex-wrap justify-center">
        {kpis.map(({ label, value }) => (
          <div
            key={label}
            className="bg-white border border-line rounded-[24px] px-7 py-4 min-w-[180px] shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
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
        placeholder="Frag etwas zu deinem Portfolio..."
        className="w-full max-w-[1060px] mt-5"
      />

      <button
        onClick={() => openChat(requestIntroSeed)}
        className="flex items-center gap-2.5 bg-[#2a2a2a] text-white rounded-full px-8 py-4 text-[16px] mt-8 hover:bg-black transition-colors"
      >
        <LifeBuoy size={17} />
        Anfrage stellen
      </button>
    </div>
  );
}
