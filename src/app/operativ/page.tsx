"use client";

import { useEffect, useState } from "react";
import {
  Star,
  Wrench,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  BadgeEuro,
  Shirt,
  ChevronRight,
} from "lucide-react";
import { KpiCard } from "@/components/kpi-card";
import { AiCard } from "@/components/ai-card";
import { ChatInput } from "@/components/chat-input";
import { FilterBar } from "@/components/filter-bar";
import { TicketsChart } from "@/components/charts";
import { useArbioChat, waterDamageApprovalSeed, type Msg } from "@/components/arbio-chat";

/* ---------- data ---------- */

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

const commTopics = [
  { label: "Check-in-Infos", pct: "34%", width: "34%" },
  { label: "Parken", pct: "18%", width: "18%" },
  { label: "WLAN-Zugang", pct: "15%", width: "15%" },
  { label: "Late-Checkout", pct: "12%", width: "12%" },
];

const blockedSeed: Msg[] = [
  { kind: "user", text: "Warum ist das Studio Universität blockiert?" },
  {
    kind: "bot",
    text: "Das Studio Universität ist seit dem 04.07. blockiert: Ein Wasserschaden im Bad (undichte Silikonfuge an der Dusche) muss getrocknet und repariert werden. Die Freigabe ist für den 11.07. geplant — der Zeitraum ist auf allen Kanälen gesperrt, damit keine Gäste betroffen sind.",
  },
  {
    kind: "timeline",
    title: "Ticket #1038 · Wasserschaden Bad · Studio Universität",
    steps: [
      { label: "Schaden festgestellt & blockiert", meta: "04.07.", state: "done" },
      { label: "Trocknung läuft", meta: "05.–09.07.", state: "current" },
      { label: "Reparatur & Endkontrolle", meta: "10.07.", state: "pending" },
      { label: "Einheit wieder live", meta: "vsl. 11.07.", state: "pending" },
    ],
  },
  {
    kind: "bot",
    text: "Volle Transparenz: Entgangener Umsatz bisher ca. €610 (5 blockierte Nächte à ~€122). Das Team erneuert im Zuge der Reparatur direkt alle Silikonfugen im Bad — so senken wir das Risiko eines erneuten Ausfalls. Du musst nichts tun, wir halten dich auf dem Laufenden.",
  },
];

const doneTimeline = (
  id: string,
  title: string,
  unit: string,
  days: string,
  extra: string
): Msg[] => [
  {
    kind: "bot",
    text: `Ticket ${id} (${title}, ${unit}) wurde diese Woche gelöst — in ${days}. ${extra}`,
  },
  {
    kind: "timeline",
    title: `Ticket ${id} · ${title}`,
    steps: [
      { label: "Gemeldet", state: "done" },
      { label: "Techniker vor Ort", state: "done" },
      { label: "Erledigt", meta: `in ${days}`, state: "done" },
    ],
  },
];

type BoardTicket = { id: string; title: string; unit: string; note: string; seed: Msg[] };

const board: { column: "Offen" | "In Arbeit" | "Diese Woche gelöst"; tickets: BoardTicket[] }[] = [
  {
    column: "Offen",
    tickets: [
      {
        id: "#1043",
        title: "Spülmaschine macht Geräusche",
        unit: "Altstadt Apartment",
        note: "seit gestern · Techniker-Termin wird vereinbart",
        seed: [
          {
            kind: "bot",
            text: "Zu Ticket #1043 (Spülmaschine macht Geräusche, Altstadt Apartment): Unser Techniker war vor Ort — die Umwälzpumpe ist defekt. Das Ersatzteil ist bestellt, der Einbau ist für den 16.07. geplant.",
          },
          {
            kind: "timeline",
            title: "Ticket #1043 · Spülmaschine macht Geräusche",
            steps: [
              { label: "Gemeldet", meta: "gestern", state: "done" },
              { label: "Techniker vor Ort", meta: "heute", state: "done" },
              { label: "Ersatzteil bestellt", meta: "Einbau vsl. 16.07.", state: "current" },
              { label: "Erledigt", state: "pending" },
            ],
          },
          {
            kind: "bot",
            text: "Kosten: €140 Material + Anfahrt — taucht danach als Position in deiner Juli-P&L auf. Die Maschine ist bis zum Einbau eingeschränkt nutzbar, die Gäste sind informiert.",
          },
        ],
      },
      {
        id: "#1047",
        title: "Abfluss Küche läuft langsam ab",
        unit: "Kiez Apartment Prenzlauer Berg",
        note: "seit heute · Diagnose eingeplant",
        seed: [
          {
            kind: "bot",
            text: "Zu Ticket #1047 (Abfluss Küche läuft langsam ab, Kiez Apartment Prenzlauer Berg): Die Meldung kam heute über die Reinigungskraft. Unser Hausmeister schaut es sich beim nächsten Turnover am 12.07. an — kein Gast ist beeinträchtigt.",
          },
          {
            kind: "timeline",
            title: "Ticket #1047 · Abfluss Küche",
            steps: [
              { label: "Gemeldet", meta: "heute", state: "done" },
              { label: "Diagnose", meta: "12.07.", state: "current" },
              { label: "Erledigt", state: "pending" },
            ],
          },
        ],
      },
    ],
  },
  {
    column: "In Arbeit",
    tickets: [
      {
        id: "#1041",
        title: "WLAN-Router austauschen",
        unit: "Garten Apartment",
        note: "Termin bestätigt: 14.07., 9–12 Uhr",
        seed: [
          {
            kind: "bot",
            text: "Zu Ticket #1041 (WLAN-Router austauschen, Garten Apartment): Der Techniker hat den Termin bestätigt — Dienstag, 14.07., zwischen 9 und 12 Uhr. Der Zugang erfolgt über die Schlüsselbox, im Zeitraum ist kein Gast eingebucht.",
          },
          {
            kind: "timeline",
            title: "Ticket #1041 · WLAN-Router austauschen",
            steps: [
              { label: "Gemeldet", meta: "03.07.", state: "done" },
              { label: "Techniker beauftragt", meta: "04.07.", state: "done" },
              { label: "Termin bestätigt", meta: "14.07., 9–12 Uhr", state: "current" },
              { label: "Erledigt", state: "pending" },
            ],
          },
        ],
      },
      {
        id: "#1038",
        title: "Wasserschaden Bad",
        unit: "Studio Universität",
        note: "Trocknung läuft · Freigabe vsl. 11.07.",
        seed: blockedSeed,
      },
      {
        id: "#1039",
        title: "Zusatzreinigung nach Late-Checkout",
        unit: "Studio Universität",
        note: "Eingeplant: 09.07., 14 Uhr",
        seed: [
          {
            kind: "bot",
            text: "Zu Ticket #1039 (Zusatzreinigung nach Late-Checkout, Studio Universität): Die Reinigung ist für den 09.07. um 14 Uhr eingeplant — rechtzeitig vor dem nächsten Check-in um 18 Uhr. Kosten: €68, erscheint als Reinigungsposition in deiner Juli-P&L.",
          },
          {
            kind: "timeline",
            title: "Ticket #1039 · Zusatzreinigung",
            steps: [
              { label: "Gemeldet", meta: "gestern", state: "done" },
              { label: "Eingeplant", meta: "09.07., 14 Uhr", state: "current" },
              { label: "Erledigt", state: "pending" },
            ],
          },
        ],
      },
    ],
  },
  {
    column: "Diese Woche gelöst",
    tickets: [
      {
        id: "#1042",
        title: "Heizung entlüftet",
        unit: "Garten Apartment",
        note: "gelöst in 1,5 Tagen",
        seed: doneTimeline(
          "#1042",
          "Heizung entlüftet",
          "Garten Apartment",
          "1,5 Tagen",
          "Der Gast hatte kalte Heizkörper gemeldet — unser Hausmeister hat entlüftet und den Druck angepasst. Keine Kosten für dich."
        ),
      },
      {
        id: "#1040",
        title: "Rauchmelder-Batterie getauscht",
        unit: "Altstadt Apartment",
        note: "gelöst in 0,5 Tagen",
        seed: doneTimeline(
          "#1040",
          "Rauchmelder-Batterie",
          "Altstadt Apartment",
          "0,5 Tagen",
          "Beim Turnover aufgefallen, direkt getauscht. Kosten: €8."
        ),
      },
      {
        id: "#1037",
        title: "Fenstergriff repariert",
        unit: "Altbau Suite Eppendorf",
        note: "gelöst in 2 Tagen",
        seed: doneTimeline(
          "#1037",
          "Fenstergriff repariert",
          "Altbau Suite Eppendorf",
          "2 Tagen",
          "Ersatzteil bestellt und montiert. Kosten: €24 Material."
        ),
      },
    ],
  },
];

type FeedCat = "Reinigung" | "Tickets" | "Gäste";

const feed: {
  day: string;
  items: { cat: FeedCat; icon: typeof Sparkles; text: string; meta: string; seed?: Msg[] }[];
}[] = [
  {
    day: "Heute",
    items: [
      {
        cat: "Reinigung",
        icon: Sparkles,
        text: "Wechselreinigung Altstadt Apartment",
        meta: "nach Check-out M. Rossi · 11:30",
      },
      {
        cat: "Gäste",
        icon: MessageCircle,
        text: "Gästeanfrage beantwortet (Parken)",
        meta: "Kiez Apartment Prenzlauer Berg · Antwortzeit 3 Min",
      },
    ],
  },
  {
    day: "Gestern",
    items: [
      {
        cat: "Tickets",
        icon: Wrench,
        text: "Ticket #1042 gelöst — Heizung entlüftet",
        meta: "Garten Apartment · in 1,5 Tagen gelöst",
        seed: board[2].tickets[0].seed,
      },
      {
        cat: "Reinigung",
        icon: Sparkles,
        text: "Wechselreinigung Studio Universität",
        meta: "Grundreinigung nach Trocknungsphase",
      },
      {
        cat: "Gäste",
        icon: MessageCircle,
        text: "2 Check-ins begleitet",
        meta: "Altstadt Apartment & Altbau Suite Eppendorf · reibungslos",
      },
    ],
  },
  {
    day: "Dienstag, 07.07.",
    items: [
      {
        cat: "Tickets",
        icon: Wrench,
        text: "Zusatzreinigung eingeplant (#1039)",
        meta: "Studio Universität · 09.07., 14 Uhr",
        seed: board[1].tickets[2].seed,
      },
      {
        cat: "Reinigung",
        icon: Sparkles,
        text: "Wechselreinigung Garten Apartment",
        meta: "nach Check-out Familie Krüger",
      },
      {
        cat: "Gäste",
        icon: MessageCircle,
        text: "12 Gästeanfragen beantwortet",
        meta: "Ø 4 Min Antwortzeit · alle Einheiten",
      },
    ],
  },
  {
    day: "Montag, 06.07.",
    items: [
      {
        cat: "Tickets",
        icon: Wrench,
        text: "Ticket #1040 gelöst — Rauchmelder-Batterie",
        meta: "Altstadt Apartment · in 0,5 Tagen gelöst",
        seed: board[2].tickets[1].seed,
      },
      {
        cat: "Reinigung",
        icon: Shirt,
        text: "Frische Wäsche geliefert",
        meta: "3 Einheiten · Sets für 9 Betten",
      },
      {
        cat: "Tickets",
        icon: Wrench,
        text: "Techniker beauftragt (#1041 WLAN-Router)",
        meta: "Garten Apartment",
        seed: board[1].tickets[0].seed,
      },
    ],
  },
];

/* ---------- helpers ---------- */

function CountUp({
  target,
  decimals = 0,
  suffix = "",
}: {
  target: number;
  decimals?: number;
  suffix?: string;
}) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 1200;
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return (
    <>
      {v.toLocaleString("de-DE", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </>
  );
}

/* ---------- page ---------- */

export default function Operativ() {
  const { openChat } = useArbioChat();
  const [feedFilter, setFeedFilter] = useState<"Alle" | FeedCat>("Alle");

  const filteredFeed = feed
    .map((d) => ({
      ...d,
      items: d.items.filter((it) => feedFilter === "Alle" || it.cat === feedFilter),
    }))
    .filter((d) => d.items.length > 0);

  return (
    <div className="relative min-h-screen px-8 py-6 pb-32">
      <h1 className="text-[22px]">Operations</h1>
      <p className="text-[15px] text-muted mt-1">
        Was gerade passiert — und was Arbio für dich erledigt
      </p>

      {/* Filters */}
      <div className="flex items-center gap-3 mt-5 mb-6 flex-wrap">
        <FilterBar showStepper={false} />
      </div>

      {/* 1 — Braucht deine Aufmerksamkeit */}
      <div className="flex items-center gap-2 text-[12px] tracking-[1.5px] uppercase text-muted mb-3">
        <AlertTriangle size={12} />
        Braucht deine Aufmerksamkeit
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Approval card */}
        <button
          onClick={() => openChat(waterDamageApprovalSeed)}
          className="text-left bg-[#fbf6ee] border border-[#f0e2c8] rounded-[24px] p-6 hover:bg-[#f8f0e2] transition-colors"
        >
          <div className="flex items-start justify-between">
            <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#8a5a1a]">
              <BadgeEuro size={17} />
            </span>
            <span className="bg-white text-[#8a5a1a] rounded-full px-3 py-1 text-[13px]">
              Freigabe offen
            </span>
          </div>
          <div className="text-[17px] mt-4">Duschglaswand-Austausch · €780</div>
          <div className="text-[14px] text-muted mt-1">
            Studio Universität · Ticket #1038 · externer Handwerker (Festpreis)
          </div>
          <div className="flex items-center gap-1.5 text-[14px] text-[#8a5a1a] mt-4">
            Prüfen & freigeben
            <ChevronRight size={15} />
          </div>
        </button>

        {/* Blocked unit card with recovery progress */}
        <button
          onClick={() => openChat(blockedSeed)}
          className="text-left bg-[#fdf0ee] border border-[#f2d8d3] rounded-[24px] p-6 hover:bg-[#fbe7e4] transition-colors"
        >
          <div className="flex items-start justify-between">
            <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-negative">
              <AlertTriangle size={16} />
            </span>
            <span className="bg-white text-negative rounded-full px-3 py-1 text-[13px]">
              Blockiert
            </span>
          </div>
          <div className="text-[17px] mt-4">Studio Universität · Wasserschaden Bad</div>
          <div className="text-[14px] text-muted mt-1">
            Entgangener Umsatz bisher ca. €610 · Ticket #1038
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-[13px] mb-1.5">
              <span className="text-muted">Trocknung läuft</span>
              <span className="text-accent-text">Wieder live in 2 Tagen · vsl. 11.07.</span>
            </div>
            <div className="h-[8px] bg-white rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full" style={{ width: "60%" }} />
            </div>
          </div>
        </button>
      </div>

      {/* 2 — Ticket board */}
      <div className="bg-white border border-line rounded-[24px] p-7 mt-6 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="flex items-start justify-between">
          <h3 className="text-[16px]">Tickets</h3>
          <span className="flex items-center gap-1.5 text-[13px] text-muted">
            <MessageCircle size={13} />
            Klick öffnet Details im Chat
          </span>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-5">
          {board.map(({ column, tickets }) => (
            <div key={column} className="bg-panel rounded-[18px] p-4">
              <div className="flex items-center justify-between px-1 mb-3">
                <span
                  className={`text-[13px] tracking-[1px] uppercase ${
                    column === "Diese Woche gelöst" ? "text-accent-text" : "text-muted"
                  }`}
                >
                  {column}
                </span>
                <span className="text-[13px] text-muted">{tickets.length}</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {tickets.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => openChat(t.seed)}
                    className={`text-left rounded-[14px] px-4 py-3.5 border transition-colors ${
                      column === "Diese Woche gelöst"
                        ? "bg-[#f1f6ee] border-[#dcebd4] hover:bg-[#eaf2e5]"
                        : "bg-white border-line hover:bg-[#fbfbfa]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {column === "Diese Woche gelöst" && (
                        <CheckCircle2 size={14} className="text-accent-text shrink-0" />
                      )}
                      <span className="text-[14px] leading-tight flex-1">{t.title}</span>
                    </div>
                    <div className="text-[12px] text-muted mt-1.5">
                      {t.id} · {t.unit}
                    </div>
                    <div
                      className={`text-[12px] mt-1 ${
                        column === "Diese Woche gelöst" ? "text-accent-text" : "text-muted"
                      }`}
                    >
                      {t.note}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3 — Activity feed */}
      <div className="bg-white border border-line rounded-[24px] p-7 mt-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <h3 className="text-[16px]">Das hat Arbio diese Woche erledigt</h3>
          <div className="flex items-center border border-line rounded-full p-1">
            {(["Alle", "Reinigung", "Tickets", "Gäste"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFeedFilter(f)}
                className={`rounded-full px-4 py-1.5 text-[14px] ${
                  feedFilter === f ? "bg-[#2a2a2a] text-white" : "text-muted"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-6">
          {filteredFeed.map(({ day, items }) => (
            <div key={day}>
              <div className="text-[12px] tracking-[1.5px] uppercase text-muted mb-2">{day}</div>
              <div className="flex flex-col">
                {items.map((it, i) => {
                  const Icon = it.icon;
                  const row = (
                    <>
                      <span className="w-9 h-9 rounded-full bg-panel flex items-center justify-center text-muted shrink-0">
                        <Icon size={15} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[15px] leading-tight flex items-center gap-2">
                          {it.text}
                          <CheckCircle2 size={13} className="text-accent-text shrink-0" />
                        </div>
                        <div className="text-[13px] text-muted mt-0.5">{it.meta}</div>
                      </div>
                    </>
                  );
                  return it.seed ? (
                    <button
                      key={`${day}-${i}`}
                      onClick={() => openChat(it.seed!)}
                      className={`flex items-center gap-3.5 py-2.5 px-2 -mx-2 rounded-[14px] text-left hover:bg-panel transition-colors ${
                        i > 0 ? "border-t border-line" : ""
                      }`}
                    >
                      {row}
                      <ChevronRight size={15} className="text-muted shrink-0" />
                    </button>
                  ) : (
                    <div
                      key={`${day}-${i}`}
                      className={`flex items-center gap-3.5 py-2.5 px-2 -mx-2 ${
                        i > 0 ? "border-t border-line" : ""
                      }`}
                    >
                      {row}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 — Success strip with count-up */}
      <div className="bg-white border border-line rounded-[24px] p-7 mt-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.2fr] gap-8 items-center">
          <div>
            <h3 className="text-[16px]">Dein Juli in Zahlen</h3>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-panel rounded-[18px] px-5 py-4">
                <div className="text-[32px] tracking-[-0.5px]">
                  <CountUp target={38} />
                </div>
                <div className="text-[13px] text-muted mt-0.5">Reinigungen</div>
              </div>
              <div className="bg-panel rounded-[18px] px-5 py-4">
                <div className="text-[32px] tracking-[-0.5px]">
                  <CountUp target={41} />
                </div>
                <div className="text-[13px] text-muted mt-0.5">Tickets gelöst</div>
              </div>
              <div className="bg-panel rounded-[18px] px-5 py-4">
                <div className="text-[32px] tracking-[-0.5px]">
                  <CountUp target={1.8} decimals={1} />
                </div>
                <div className="text-[13px] text-muted mt-0.5">Ø Tage Lösungszeit</div>
              </div>
              <div className="bg-panel rounded-[18px] px-5 py-4">
                <div className="text-[32px] tracking-[-0.5px]">
                  <CountUp target={100} suffix=" %" />
                </div>
                <div className="text-[13px] text-muted mt-0.5">pünktliche Turnovers</div>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-start justify-between">
              <span className="text-[15px] text-muted">Tickets gelöst vs. offen · Feb – Jul</span>
              <div className="flex gap-5 text-[13px] text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#b9d9ae] inline-block" /> Gelöst
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#d3d3d3] inline-block" /> Offen
                </span>
              </div>
            </div>
            <div className="mt-3">
              <TicketsChart />
            </div>
          </div>
        </div>
      </div>

      {/* 5 — KPIs + AI card */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.15fr] gap-4 mt-5">
        <div className="grid grid-cols-2 gap-4">
          <KpiCard label="Ø Bewertung" value="4,8 ★" delta="0,1 vs. Vormonat" deltaDirection="up" />
          <KpiCard label="Reinigungen" value="38" subline="diesen Monat · 2 Zusatzreinigungen" />
          <KpiCard label="Offene Tickets" value="5" subline="davon 3 in Arbeit" />
          <KpiCard label="Ø Antwortzeit" value="4 Min" subline="Antwortrate 98%" />
        </div>
        <AiCard
          title="Dein Betrieb. Auf einen Blick."
          rows={[
            {
              label: "Ergebnis",
              text: "Deine Immobilien laufen großartig: 4,8 ★, 38 Reinigungen und 11 Check-ins liefen diesen Monat reibungslos.",
            },
            {
              label: "Warum",
              text: "Sauberkeit und Check-in werden in 9 von 10 Bewertungen positiv erwähnt — 41 Tickets wurden gelöst, nur 5 sind in Bearbeitung.",
            },
            {
              label: "Arbio kümmert sich",
              text: "Das Team behebt den Wasserschaden im Studio Universität — Freigabe vsl. 11.07., du musst nichts tun.",
            },
          ]}
          chatHint="Details im Chat fragen"
        />
      </div>

      {/* 6 — Guest review insights */}
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

      {/* 7 — Guest comms insights */}
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
