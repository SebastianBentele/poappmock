import { Calendar, MapPin, ChevronDown } from "lucide-react";
import { KpiCard } from "@/components/kpi-card";
import { AiCard } from "@/components/ai-card";
import { ChatInput } from "@/components/chat-input";
import { ProfitChart } from "@/components/charts";

const costs = [
  { label: "OTA-Provision", pct: "13,0%", width: "72%" },
  { label: "Reinigung", pct: "0,5%", width: "6%" },
];

export default function Profitability() {
  return (
    <div className="relative min-h-screen px-8 py-6 pb-32">
      <h1 className="text-[22px]">Profitabilität</h1>
      <p className="text-[15px] text-muted mt-1">
        Dein P&L aus echten Umsätzen und deinen Kosten
      </p>

      {/* Tabs + filters */}
      <div className="flex items-center gap-3 mt-5 mb-6 flex-wrap">
        <div className="flex items-center border border-line rounded-full p-1">
          <button className="bg-white border border-line shadow-[0_1px_3px_rgba(0,0,0,0.05)] rounded-full px-5 py-1.5 text-[15px]">
            Dashboard
          </button>
          <button className="px-4 py-1.5 text-[15px] text-muted">P&L Detailansicht</button>
          <button className="px-4 py-1.5 text-[15px] text-muted">Kosten</button>
        </div>
        <button className="flex items-center gap-2 border border-line rounded-full px-5 py-2.5 text-[15px]">
          <MapPin size={15} />
          Alle Einheiten
          <ChevronDown size={15} className="text-muted" />
        </button>
        <button className="flex items-center gap-2 border border-line rounded-full px-5 py-2.5 text-[15px]">
          <Calendar size={15} />
          Dieser Monat
          <ChevronDown size={15} className="text-muted" />
        </button>
      </div>

      {/* KPI grid + AI card */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.15fr] gap-4">
        <div className="grid grid-cols-2 gap-4">
          <KpiCard label="Bruttoumsatz (GBV)" value="€41,5k" delta="7,6% vs. Vorjahr" deltaDirection="up" />
          <KpiCard label="Nettoumsatz" value="€38,7k" subline="nach USt. + Beh.steuer" />
          <KpiCard label="Contribution Margin" value="86,0%" subline="vom Nettoumsatz" />
          <KpiCard label="Operativer Gewinn" value="€33,1k" subline="nach allen Kosten" />
        </div>
        <AiCard
          title="Arbio Zusammenfassung"
          rows={[
            {
              label: "Kostenentwicklung",
              text: "Die Gesamtkosten stiegen saisonal bedingt auf 5628 €, getrieben durch 5407 € OTA-Provisionen.",
            },
            {
              label: "Margenentwicklung",
              text: "Die operative Marge bleibt mit starken 85% auf einem hervorragenden Niveau.",
            },
            {
              label: "Weitere Hinweise",
              text: "Prüfen Sie die ungewöhnlich niedrigen Reinigungskosten von nur 221 € bei diesem hohen Buchungsvolumen.",
            },
          ]}
          chatHint="Details im Chat fragen"
        />
      </div>

      {/* Profit chart + cost structure */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-4 mt-5">
        <div className="bg-white border border-line rounded-[24px] p-7 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <div className="flex items-start justify-between">
            <h3 className="text-[16px]">Gewinn über Zeit</h3>
            <span className="flex items-center gap-2 text-[13px] text-muted">
              <span className="w-4 h-[3px] bg-accent inline-block rounded" /> Operativer Gewinn
            </span>
          </div>
          <div className="mt-4">
            <ProfitChart />
          </div>
        </div>
        <div className="bg-white border border-line rounded-[24px] p-7 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <div className="flex items-start justify-between">
            <h3 className="text-[16px]">Kostenstruktur</h3>
            <span className="text-[13px] text-muted">% vom GBV</span>
          </div>
          <div className="flex flex-col gap-5 mt-7">
            {costs.map(({ label, pct, width }) => (
              <div key={label} className="flex items-center gap-4">
                <span className="w-[130px] shrink-0 text-[15px]">{label}</span>
                <div className="flex-1 h-[6px] bg-panel rounded-full overflow-hidden">
                  <div className="h-full bg-[#c9c9c9] rounded-full" style={{ width }} />
                </div>
                <span className="w-[52px] text-right text-[15px]">{pct}</span>
              </div>
            ))}
            <div className="border-t border-line pt-4 flex items-center justify-between">
              <span className="text-[15px]">Gesamt</span>
              <span className="text-[15px]">
                <b>13,6%</b> <span className="text-muted">vom GBV</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating chat */}
      <div className="fixed bottom-6 left-[290px] right-0 flex justify-center px-8 pointer-events-none">
        <ChatInput
          placeholder="Frag alles über deine Profitabilität..."
          className="w-full max-w-[620px] pointer-events-auto"
        />
      </div>
    </div>
  );
}
