import { Info } from "lucide-react";
import { KpiCard } from "@/components/kpi-card";
import { AiCard } from "@/components/ai-card";
import { ChatInput } from "@/components/chat-input";
import { FilterBar } from "@/components/filter-bar";
import {
  RollingRevenueChart,
  DailyRevenueChart,
  DailyOccupancyChart,
  DailyRateChart,
  ChannelDonut,
  GrowthChart,
  LosChart,
} from "@/components/charts";
import { Info as InfoIcon } from "lucide-react";

const growthStats = [
  { label: "Umsatz p.a.", then: "€198k", now: "€337k", delta: "+70 %" },
  { label: "Ø Tagesrate (ADR)", then: "€180", now: "€241", delta: "+34 %" },
  { label: "Auslastung", then: "61 %", now: "72 %", delta: "+11 Pp." },
];

const channelRows = [
  { color: "#f5455c", name: "Booking.com", marge: "85% Marge", share: "71,1%", value: "€29.475", width: "71%" },
  { color: "#1e3a75", name: "Airbnb", marge: "97% Marge", share: "17,0%", value: "€7.040", width: "17%" },
  { color: "#2fbf4f", name: "Direct", marge: "100% Marge", share: "11,9%", value: "€4.936", width: "12%" },
];

const bookingWindows = [
  { label: "90 Tage vorher", value: "39%", delta: "-12,5%", vj: "Gleicher Zeitraum VJ: 52%" },
  { label: "60 Tage vorher", value: "51%", delta: "-8,2%", vj: "Gleicher Zeitraum VJ: 59%" },
  { label: "30 Tage vorher", value: "56%", delta: "-9,7%", vj: "Gleicher Zeitraum VJ: 65%" },
];

function DjVjLegend() {
  return (
    <div className="flex gap-5 text-[13px] text-muted">
      <span className="flex items-center gap-2">
        <span className="w-4 h-[2.5px] bg-accent inline-block rounded" /> DJ
      </span>
      <span className="flex items-center gap-2">
        <span className="w-4 h-[2px] inline-block rounded border-t-2 border-dashed border-[#b5b5b5]" /> VJ
      </span>
    </div>
  );
}

export default function Portfolio() {
  return (
    <div className="relative min-h-screen px-8 py-6 pb-32">
      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <FilterBar />
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
              label: "Ergebnis",
              text: "Dein Umsatz steigt auf 41.451 € — 7,6 % über dem Vorjahr. Dein Portfolio läuft großartig.",
            },
            {
              label: "Warum",
              text: "Arbio hat die Durchschnittsrate auf 241 € optimiert — das gleicht die saisonal geringere Auslastung bei stabilen 6,5 Nächten mehr als aus.",
            },
            {
              label: "Arbio kümmert sich",
              text: "Preise und Verfügbarkeiten werden täglich vom Revenue-Team überprüft — du musst nichts tun.",
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

      {/* Growth with Arbio (YoY, accented) */}
      <div className="bg-white border border-line rounded-[24px] p-7 mt-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.3fr] gap-8">
          <div>
            <h3 className="text-[16px]">Dein Wachstum mit Arbio</h3>
            <p className="text-[13px] text-muted mt-0.5">Seit Beginn 2024 · über alle Einheiten</p>
            <div className="flex flex-col gap-3 mt-5">
              {growthStats.map(({ label, then, now, delta }) => (
                <div
                  key={label}
                  className="flex items-center justify-between bg-panel rounded-[16px] px-5 py-4"
                >
                  <div>
                    <div className="text-[14px]">{label}</div>
                    <div className="text-[13px] text-muted mt-0.5">
                      {then} → <span className="text-foreground">{now}</span>
                    </div>
                  </div>
                  <span className="text-[22px] tracking-[-0.5px] text-accent-text">{delta}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-start justify-between">
              <span className="text-[15px] text-muted">Portfolio-Umsatz pro Jahr</span>
              <span className="text-[13px] text-muted">seit Beginn +70 %</span>
            </div>
            <div className="mt-2">
              <GrowthChart />
            </div>
          </div>
        </div>
      </div>

      {/* Length-of-stay optimization */}
      <div className="bg-white border border-line rounded-[24px] p-7 mt-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-8">
          <div>
            <h3 className="text-[16px]">Aufenthaltsdauer-Optimierung</h3>
            <p className="text-[13px] text-muted mt-0.5">
              Verteilung der Buchungen nach Aufenthaltsdauer · Juli
            </p>
            <div className="mt-4">
              <LosChart />
            </div>
          </div>
          <div className="flex flex-col justify-center gap-4">
            <div className="flex gap-6">
              <div className="flex-1 bg-panel rounded-[16px] px-5 py-4">
                <div className="text-[13px] text-muted">Ø Aufenthaltsdauer</div>
                <div className="text-[26px] tracking-[-0.5px] mt-0.5">6,5 Nächte</div>
              </div>
              <div className="flex-1 bg-panel rounded-[16px] px-5 py-4">
                <div className="text-[13px] text-muted">1-Nacht-Anteil</div>
                <div className="text-[26px] tracking-[-0.5px] mt-0.5">8 %</div>
              </div>
            </div>
            <div className="bg-[#f1f6ee] rounded-[16px] px-5 py-4">
              <div className="flex items-center gap-2 text-[13px] text-accent-text">
                <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[11px]">
                  A
                </span>
                Was Arbio hier tut
              </div>
              <p className="text-[14px] leading-snug mt-2">
                Arbio steuert deine Mindestaufenthaltsdauer dynamisch: kurze Lücken werden für
                1–2-Nächte-Buchungen geöffnet, Hochsaison-Wochenenden für längere Aufenthalte
                geschützt. So sinken deine Reinigungs- und Turnover-Kosten pro Nacht, während die
                Auslastung hoch bleibt.
              </p>
            </div>
          </div>
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

      {/* Daily occupancy + daily rate */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-5">
        {[
          { title: "Tägliche Auslastung", chart: <DailyOccupancyChart /> },
          { title: "Tägliche Tagesrate", chart: <DailyRateChart /> },
        ].map(({ title, chart }) => (
          <div
            key={title}
            className="bg-white border border-line rounded-[24px] p-7 shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-[13px] tracking-[1.5px] uppercase text-muted">{title}</h3>
              <DjVjLegend />
            </div>
            <div className="mt-4">{chart}</div>
            <p className="text-[12px] text-muted mt-3">* DJ = Dieses Jahr · VJ = Vorjahr</p>
          </div>
        ))}
      </div>

      {/* Kanal-Mix + Buchungstempo */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.5fr] gap-4 mt-5">
        <div className="bg-white border border-line rounded-[24px] p-7 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <div className="flex items-start justify-between">
            <h3 className="text-[17px]">Kanal-Mix</h3>
            <div className="text-right">
              <span className="flex items-center gap-1.5 text-[15px] text-muted justify-end">
                Ø Netto-Marge <InfoIcon size={13} />
              </span>
              <div className="text-[24px] tracking-[-0.5px] mt-1">88,8%</div>
            </div>
          </div>
          <div className="mt-4">
            <ChannelDonut />
          </div>
          <div className="flex flex-col mt-6">
            {channelRows.map(({ color, name, marge, share, value, width }, i) => (
              <div key={name} className={`py-4 ${i > 0 ? "border-t border-line" : ""}`}>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-[16px]">{name}</span>
                    <span className="flex items-center gap-1 text-[14px] text-muted">
                      {marge} <InfoIcon size={12} />
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="block text-[16px]">{share}</span>
                    <span className="block text-[15px] text-muted">{value}</span>
                  </span>
                </div>
                <div className="h-[5px] bg-panel rounded-full overflow-hidden mt-3 max-w-[75%]">
                  <div
                    className="h-full rounded-full"
                    style={{ width, backgroundColor: color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-line rounded-[24px] p-7 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <h3 className="text-[17px]">Buchungstempo</h3>
          <p className="text-[14px] text-muted mt-1">
            Zeigt, wie stark der Zeitraum heute und in den 30/60/90-Tage-Buchungsfenstern
            gebucht ist.
          </p>

          <div className="flex items-end justify-between mt-7">
            <div>
              <div className="text-[44px] leading-none tracking-[-1px]">55,5%</div>
              <div className="text-[16px] mt-1.5">der Nächte bisher gebucht</div>
            </div>
            <div className="text-right">
              <div className="text-[14px] text-muted">Gleicher Zeitpunkt im Vorjahr</div>
              <div className="text-[30px] tracking-[-0.5px]">61,0%</div>
              <div className="text-[14px] text-accent-text">-5,5% ggü. gleichem Zeitraum VJ</div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-[16px] bg-panel rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: "55.5%" }} />
              </div>
              <span className="text-[13px] text-muted w-[70px]">DJ 55,5%</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-[16px] bg-panel rounded-full overflow-hidden">
                <div className="h-full bg-[#c9c9c9] rounded-full" style={{ width: "61%" }} />
              </div>
              <span className="text-[13px] text-muted w-[70px]">VJ 61,0%</span>
            </div>
          </div>

          <h4 className="text-[17px] mt-8">Buchungsfenster</h4>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {bookingWindows.map(({ label, value, delta, vj }) => (
              <div key={label} className="border border-line rounded-[18px] px-5 py-4">
                <div className="text-[14px] text-muted">{label}</div>
                <div className="text-[34px] tracking-[-0.5px] mt-2">{value}</div>
                <div className="text-[14px] text-accent-text mt-1">{delta}</div>
                <div className="text-[13px] text-muted mt-1">{vj}</div>
              </div>
            ))}
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
