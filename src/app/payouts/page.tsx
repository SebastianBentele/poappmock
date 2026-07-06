import { Zap, Download, FileText, Calendar } from "lucide-react";
import { AiCard } from "@/components/ai-card";
import { ChatInput } from "@/components/chat-input";
import { PayoutChart } from "@/components/charts";

const statements = [
  { month: "Juni 2026", period: "01.06. – 30.06.2026", amount: "€34.900,00" },
  { month: "Mai 2026", period: "01.05. – 31.05.2026", amount: "€30.400,00" },
  { month: "April 2026", period: "01.04. – 30.04.2026", amount: "€26.800,00" },
  { month: "März 2026", period: "01.03. – 31.03.2026", amount: "€21.500,00" },
  { month: "Februar 2026", period: "01.02. – 28.02.2026", amount: "€11.600,00" },
  { month: "Januar 2026", period: "01.01. – 31.01.2026", amount: "€8.100,00" },
  { month: "Dezember 2025", period: "01.12. – 31.12.2025", amount: "€9.400,00" },
  { month: "November 2025", period: "01.11. – 30.11.2025", amount: "€8.200,00" },
];

export default function Payouts() {
  return (
    <div className="relative min-h-screen px-8 py-6 pb-32">
      <h1 className="text-[22px]">Auszahlungen</h1>
      <p className="text-[15px] text-muted mt-1">
        Deine Auszahlungen und Abrechnungen im Überblick
      </p>

      {/* Accumulated payout + AI card */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.15fr] gap-4 mt-6">
        <div className="bg-panel rounded-[24px] px-8 py-7 flex flex-col">
          <span className="text-[15px]">Aufgelaufene Auszahlung · Juli 2026</span>
          <span className="text-[52px] leading-none tracking-[-1px] mt-3">€18.450</span>
          <span className="flex items-center gap-2 text-[14px] text-muted mt-3">
            <Calendar size={14} />
            Reguläre Auszahlung am 05.08.2026 · kostenlos
          </span>
          <div className="mt-auto pt-6">
            <button className="w-full flex items-center justify-center gap-2.5 bg-[#2a2a2a] text-white rounded-full px-6 py-4 text-[16px] hover:bg-black transition-colors">
              <Zap size={17} />
              Sofort auszahlen · 2% Gebühr
            </button>
            <p className="text-[13px] text-muted text-center mt-2.5">
              Du erhältst €18.081,00 sofort auf dein Konto (Gebühr: €369,00)
            </p>
          </div>
        </div>
        <AiCard
          title="Deine Auszahlungen. Auf einen Blick."
          rows={[
            {
              label: "Signal",
              text: "Bereits 18.450 € für Juli aufgelaufen — 12 % über dem Vormonat zum gleichen Stichtag.",
            },
            {
              label: "Treiber",
              text: "Starke Sommerbelegung und eine höhere Durchschnittsrate treiben die Auszahlung.",
            },
            {
              label: "Empfehlung",
              text: "Die reguläre Auszahlung am 05.08. ist kostenlos — eine Sofortauszahlung kostet dich aktuell 369 €.",
            },
          ]}
          chatHint="Details im Chat fragen"
        />
      </div>

      {/* Payout history chart */}
      <div className="bg-white border border-line rounded-[24px] p-7 mt-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-[16px]">Auszahlungen der letzten Monate</h3>
            <p className="text-[13px] text-muted mt-0.5">Aug 2025 – Jul 2026</p>
          </div>
          <div className="flex gap-5 text-[13px] text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#b9d9ae] inline-block" /> Ausgezahlt
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" /> Aufgelaufen (Juli)
            </span>
          </div>
        </div>
        <div className="mt-4">
          <PayoutChart />
        </div>
      </div>

      {/* Owner statements */}
      <div className="bg-white border border-line rounded-[24px] p-7 mt-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="flex items-start justify-between">
          <h3 className="text-[16px]">Owner Statements</h3>
          <span className="text-[13px] text-muted">PDF-Download</span>
        </div>
        <div className="mt-4 flex flex-col">
          {statements.map(({ month, period, amount }, i) => (
            <div
              key={month}
              className={`flex items-center gap-4 py-3.5 ${
                i > 0 ? "border-t border-line" : ""
              }`}
            >
              <span className="w-10 h-10 rounded-full bg-panel flex items-center justify-center text-muted shrink-0">
                <FileText size={16} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[15px]">Owner Statement · {month}</div>
                <div className="text-[13px] text-muted">{period}</div>
              </div>
              <span className="text-[15px] w-[110px] text-right">{amount}</span>
              <button className="flex items-center gap-2 border border-line rounded-full px-4 py-2 text-[14px] hover:bg-panel">
                <Download size={14} />
                PDF
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Floating chat */}
      <div className="fixed bottom-6 left-[290px] right-0 flex justify-center px-8 pointer-events-none">
        <ChatInput
          placeholder="Frag alles über deine Auszahlungen..."
          className="w-full max-w-[620px] pointer-events-auto"
        />
      </div>
    </div>
  );
}
