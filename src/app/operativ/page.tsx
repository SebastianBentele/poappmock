import { Calendar, MapPin, ChevronDown, Star, Wrench, Sparkles } from "lucide-react";
import { KpiCard } from "@/components/kpi-card";
import { AiCard } from "@/components/ai-card";
import { ChatInput } from "@/components/chat-input";
import { TicketsChart } from "@/components/charts";

const sentiments = [
  { label: "Sauberkeit", pct: "94%", width: "94%" },
  { label: "Check-in", pct: "91%", width: "91%" },
  { label: "Lage", pct: "96%", width: "96%" },
  { label: "Ausstattung", pct: "82%", width: "82%" },
  { label: "WLAN", pct: "68%", width: "68%" },
];

const reviews = [
  {
    platform: "Airbnb",
    score: "5,0",
    text: "Super unkomplizierter Check-in, die Wohnung war makellos sauber. Jederzeit wieder!",
    unit: "Altstadt Apartment · vor 2 Tagen",
  },
  {
    platform: "Booking.com",
    score: "8,0",
    text: "Tolle Lage, aber das WLAN war am zweiten Abend instabil.",
    unit: "Garten Apartment · vor 5 Tagen",
  },
];

const openTickets = [
  { title: "WLAN-Router austauschen", unit: "Garten Apartment", status: "In Arbeit", icon: Wrench },
  { title: "Spülmaschine macht Geräusche", unit: "Altstadt Apartment", status: "Offen", icon: Wrench },
  { title: "Zusatzreinigung nach Late-Checkout", unit: "Studio Universität", status: "Offen", icon: Sparkles },
];

const commTopics = [
  { label: "Check-in-Infos", pct: "34%", width: "34%" },
  { label: "Parken", pct: "18%", width: "18%" },
  { label: "WLAN-Zugang", pct: "15%", width: "15%" },
  { label: "Late-Checkout", pct: "12%", width: "12%" },
];

export default function Operativ() {
  return (
    <div className="relative min-h-screen px-8 py-6 pb-32">
      <h1 className="text-[22px]">Operations</h1>
      <p className="text-[15px] text-muted mt-1">
        Bewertungen, Tickets und Gästekommunikation im Überblick
      </p>

      {/* Filters */}
      <div className="flex items-center gap-3 mt-5 mb-6 flex-wrap">
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
          <KpiCard label="Ø Bewertung" value="4,8 ★" delta="0,1 vs. Vormonat" deltaDirection="up" />
          <KpiCard label="Gelöste Tickets" value="41" subline="diesen Monat" />
          <KpiCard label="Offene Tickets" value="3" subline="davon 1 in Arbeit" />
          <KpiCard label="Ø Antwortzeit" value="4 Min" subline="Antwortrate 98%" />
        </div>
        <AiCard
          title="Dein Betrieb. Auf einen Blick."
          rows={[
            {
              label: "Signal",
              text: "Bewertungen steigen auf 4,8 ★ — 41 Tickets wurden diesen Monat gelöst, nur 3 sind offen.",
            },
            {
              label: "Treiber",
              text: "Sauberkeit und Check-in werden in 9 von 10 Bewertungen positiv erwähnt.",
            },
            {
              label: "Empfehlung",
              text: "WLAN ist das häufigste Negativthema — der Routertausch im Garten Apartment ist bereits in Arbeit.",
            },
          ]}
          chatHint="Details im Chat fragen"
        />
      </div>

      {/* Guest review insights */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.15fr] gap-4 mt-5">
        <div className="bg-white border border-line rounded-[24px] p-7 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <div className="flex items-start justify-between">
            <h3 className="text-[16px]">Bewertungs-Insights</h3>
            <span className="text-[13px] text-muted">% positiv erwähnt</span>
          </div>
          <div className="flex gap-6 mt-5">
            <div className="flex-1 bg-panel rounded-[18px] px-5 py-4">
              <div className="text-[13px] text-muted">Airbnb</div>
              <div className="text-[26px] tracking-[-0.5px] mt-0.5">4,8 ★</div>
            </div>
            <div className="flex-1 bg-panel rounded-[18px] px-5 py-4">
              <div className="text-[13px] text-muted">Booking.com</div>
              <div className="text-[26px] tracking-[-0.5px] mt-0.5">9,3</div>
            </div>
            <div className="flex-1 bg-panel rounded-[18px] px-5 py-4">
              <div className="text-[13px] text-muted">NPS</div>
              <div className="text-[26px] tracking-[-0.5px] mt-0.5">68</div>
            </div>
          </div>
          <div className="flex flex-col gap-4 mt-6">
            {sentiments.map(({ label, pct, width }) => (
              <div key={label} className="flex items-center gap-4">
                <span className="w-[110px] shrink-0 text-[15px]">{label}</span>
                <div className="flex-1 h-[6px] bg-panel rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width }} />
                </div>
                <span className="w-[46px] text-right text-[15px]">{pct}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-line rounded-[24px] p-7 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <h3 className="text-[16px]">Neueste Bewertungen</h3>
          <div className="flex flex-col gap-4 mt-5">
            {reviews.map(({ platform, score, text, unit }) => (
              <div key={unit} className="bg-panel rounded-[18px] px-5 py-4">
                <div className="flex items-center gap-2 text-[13px] text-muted">
                  <Star size={13} className="text-accent-text" />
                  <span>
                    {platform} · {score}
                  </span>
                </div>
                <p className="text-[15px] mt-2 leading-snug">„{text}"</p>
                <p className="text-[13px] text-muted mt-2">{unit}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tickets */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-4 mt-5">
        <div className="bg-white border border-line rounded-[24px] p-7 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[16px]">Operative Tickets</h3>
              <p className="text-[13px] text-muted mt-0.5">Feb – Jul 2026</p>
            </div>
            <div className="flex gap-5 text-[13px] text-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#b9d9ae] inline-block" /> Gelöst
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d3d3d3] inline-block" /> Offen
              </span>
            </div>
          </div>
          <div className="mt-4">
            <TicketsChart />
          </div>
        </div>
        <div className="bg-white border border-line rounded-[24px] p-7 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <h3 className="text-[16px]">Offene Tickets</h3>
          <div className="flex flex-col mt-2">
            {openTickets.map(({ title, unit, status, icon: Icon }, i) => (
              <div
                key={title}
                className={`flex items-center gap-4 py-3.5 ${i > 0 ? "border-t border-line" : ""}`}
              >
                <span className="w-10 h-10 rounded-full bg-panel flex items-center justify-center text-muted shrink-0">
                  <Icon size={16} />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] leading-tight">{title}</div>
                  <div className="text-[13px] text-muted mt-0.5">{unit}</div>
                </div>
                <span
                  className={`text-[13px] rounded-full px-3 py-1 ${
                    status === "In Arbeit"
                      ? "bg-[#eef5eb] text-accent-text"
                      : "bg-panel text-muted"
                  }`}
                >
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Guest comms insights */}
      <div className="bg-white border border-line rounded-[24px] p-7 mt-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="flex items-start justify-between">
          <h3 className="text-[16px]">Guest-Comms-Insights</h3>
          <span className="text-[13px] text-muted">Anteil aller Gästeanfragen</span>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.4fr] gap-8 mt-5">
          <div className="flex gap-6">
            <div className="flex-1 bg-panel rounded-[18px] px-5 py-4">
              <div className="text-[13px] text-muted">Antwortrate</div>
              <div className="text-[26px] tracking-[-0.5px] mt-0.5">98%</div>
            </div>
            <div className="flex-1 bg-panel rounded-[18px] px-5 py-4">
              <div className="text-[13px] text-muted">Ø Antwortzeit</div>
              <div className="text-[26px] tracking-[-0.5px] mt-0.5">4 Min</div>
            </div>
            <div className="flex-1 bg-panel rounded-[18px] px-5 py-4">
              <div className="text-[13px] text-muted">Offene Threads</div>
              <div className="text-[26px] tracking-[-0.5px] mt-0.5">2</div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {commTopics.map(({ label, pct, width }) => (
              <div key={label} className="flex items-center gap-4">
                <span className="w-[130px] shrink-0 text-[15px]">{label}</span>
                <div className="flex-1 h-[6px] bg-panel rounded-full overflow-hidden">
                  <div className="h-full bg-[#c9c9c9] rounded-full" style={{ width }} />
                </div>
                <span className="w-[46px] text-right text-[15px]">{pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating chat */}
      <div className="fixed bottom-6 left-[290px] right-0 flex justify-center px-8 pointer-events-none">
        <ChatInput
          placeholder="Frag alles über deinen Betrieb..."
          className="w-full max-w-[620px] pointer-events-auto"
        />
      </div>
    </div>
  );
}
