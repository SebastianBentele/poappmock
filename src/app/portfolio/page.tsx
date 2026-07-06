import { Calendar, MapPin, ChevronDown, Info } from "lucide-react";
import { KpiCard } from "@/components/kpi-card";
import { AiCard } from "@/components/ai-card";
import { ChatInput } from "@/components/chat-input";
import { RollingRevenueChart, DailyRevenueChart } from "@/components/charts";

export default function Portfolio() {
  return (
    <div className="relative min-h-screen px-8 py-6 pb-32">
      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <button className="flex items-center gap-2 border border-line rounded-full px-5 py-2.5 text-[15px]">
          <Calendar size={15} />
          Dieser Monat
          <ChevronDown size={15} className="text-muted" />
        </button>
        <button className="flex items-center gap-2 border border-line rounded-full px-5 py-2.5 text-[15px]">
          <MapPin size={15} />
          Alle Einheiten
          <ChevronDown size={15} className="text-muted" />
        </button>
        <div className="flex items-center border border-line rounded-full p-1">
          <button className="bg-[#2a2a2a] text-white rounded-full px-5 py-1.5 text-[15px]">
            Alle
          </button>
          <button className="px-4 py-1.5 text-[15px] text-muted">L2L</button>
          <button className="px-4 py-1.5 text-[15px] text-muted">Neue</button>
        </div>
        <button className="w-10 h-10 border border-line rounded-full flex items-center justify-center text-muted">
          <Info size={15} />
        </button>
      </div>

      {/* KPI grid + AI card */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.15fr] gap-4">
        <div className="grid grid-cols-2 gap-4">
          <KpiCard label="Umsatz" value="€41.451" delta="7,6%" deltaDirection="up" />
          <KpiCard label="Auslastung" value="55,5%" delta="9,0%" deltaDirection="down" />
          <KpiCard label="Ø Tagesrate" value="€241" delta="€37" deltaDirection="up" />
          <KpiCard label="Ø Aufenthaltsdauer" value="6,5 Nächte" delta="0,0 Nächte" deltaDirection="up" />
        </div>
        <AiCard
          title="Dein Portfolio. Auf einen Blick."
          rows={[
            {
              label: "Signal",
              text: "Umsatz steigt auf 41451 € trotz eines Rückgangs der Portfolio-Auslastung auf 55 %",
            },
            {
              label: "Treiber",
              text: "Eine starke Durchschnittsrate von 241 € kompensiert die geringere Belegung bei stabilen 6.5 Nächten",
            },
            {
              label: "Empfehlung",
              text: "Senken Sie die Mindestaufenthaltsdauer für freie Lücken, um die Auslastung und Marge zu maximieren",
            },
          ]}
          chatHint="Details im Chat fragen"
        />
      </div>

      {/* Rolling revenue */}
      <div className="bg-white border border-line rounded-[24px] p-7 mt-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-[16px]">Rollierender Umsatz</h3>
            <p className="text-[13px] text-muted mt-0.5">Apr 2026 - Mar 2027</p>
          </div>
          <div className="text-right">
            <div className="text-[15px] text-muted">Ist-Wert bis heute</div>
            <div className="text-[30px] tracking-[-0.5px]">€117.856</div>
          </div>
        </div>
        <RollingRevenueChart />
        <div className="flex gap-7 mt-3 text-[13px] text-muted">
          <span className="flex items-center gap-2">
            <span className="w-4 h-[2.5px] bg-accent inline-block rounded" /> Dieses Jahr
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-[2.5px] inline-block rounded border-t-[2.5px] border-dashed border-accent" /> Forecast
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-[2px] bg-[#9a9a9a] inline-block rounded" /> Letztes Jahr
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-[2px] inline-block rounded border-t-2 border-dashed border-[#9a9a9a]" /> Vorjahr
          </span>
        </div>
      </div>

      {/* Daily revenue + side stats */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-4 mt-5">
        <div className="bg-white border border-line rounded-[24px] p-7 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[16px]">Täglicher Umsatz</h3>
              <p className="text-[14px] text-muted mt-0.5">
                Dieses Jahr im Vergleich zum gleichen Zeitraum Vorjahr
              </p>
            </div>
            <div className="flex gap-4 text-[13px] text-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" /> DJ
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#b9d9ae] inline-block" /> VJ
              </span>
            </div>
          </div>
          <div className="mt-4">
            <DailyRevenueChart />
          </div>
        </div>
        <div className="bg-white border border-line rounded-[24px] p-7 shadow-[0_1px_4px_rgba(0,0,0,0.03)] flex flex-col justify-end gap-6">
          <div>
            <div className="text-[15px] text-muted">Umsatz gleicher Zeitraum VJ</div>
            <div className="text-[32px] tracking-[-0.5px] mt-1">€38.534</div>
          </div>
          <div>
            <div className="text-[15px] text-muted">Zuwachs</div>
            <div className="text-[32px] tracking-[-0.5px] mt-1 text-accent-text">€39.903</div>
          </div>
        </div>
      </div>

      {/* Floating chat */}
      <div className="fixed bottom-6 left-[290px] right-0 flex justify-center px-8 pointer-events-none">
        <ChatInput
          placeholder="Frag alles über deinen Umsatz..."
          className="w-full max-w-[620px] pointer-events-auto"
        />
      </div>
    </div>
  );
}
