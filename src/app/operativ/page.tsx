"use client";

import { useState } from "react";
import {
  Star,
  Wrench,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  BadgeEuro,
  Home,
  ChevronRight,
  X,
} from "lucide-react";
import { AiCard } from "@/components/ai-card";
import { ChatInput } from "@/components/chat-input";
import { FilterBar } from "@/components/filter-bar";
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
    platform: "Airbnb",
    score: "5,0",
    text: "Traumhafte Altbauwohnung — stilvoll eingerichtet und perfekt organisiert.",
    unit: "Altbau Suite Eppendorf · vor 3 Tagen",
  },
  {
    platform: "Booking.com",
    score: "8,0",
    text: "Tolle Lage, aber das WLAN war am zweiten Abend instabil.",
    unit: "Garten Apartment · vor 5 Tagen",
  },
];

const allReviews = [
  ...reviews,
  {
    platform: "Booking.com",
    score: "9,5",
    text: "Perfekte Kommunikation, alle Fragen wurden in Minuten beantwortet. Sehr professionell.",
    unit: "Kiez Apartment Prenzlauer Berg · vor 6 Tagen",
  },
  {
    platform: "Airbnb",
    score: "4,5",
    text: "Schöne Wohnung in ruhiger Lage. Die Kaffeemaschine könnte ein Upgrade vertragen.",
    unit: "Altbau Suite Eppendorf · vor 1 Woche",
  },
  {
    platform: "Airbnb",
    score: "5,0",
    text: "Der Garten ist ein Traum — perfekt für Familien. Check-in komplett reibungslos.",
    unit: "Garten Apartment · vor 1 Woche",
  },
  {
    platform: "Booking.com",
    score: "9,0",
    text: "Sehr sauber, top ausgestattet, tolle Betten. Gerne wieder in Hamburg!",
    unit: "Altstadt Apartment · vor 2 Wochen",
  },
  {
    platform: "Airbnb",
    score: "4,5",
    text: "Kompaktes, durchdachtes Studio — ideal für einen Städtetrip. Parken war etwas knifflig.",
    unit: "Studio Universität · vor 2 Wochen",
  },
  {
    platform: "Airbnb",
    score: "5,0",
    text: "Stilvoll, hell, ruhig. Die Empfehlungen fürs Viertel im Gäste-Guide waren Gold wert.",
    unit: "Kiez Apartment Prenzlauer Berg · vor 3 Wochen",
  },
  {
    platform: "Booking.com",
    score: "8,5",
    text: "Gutes Preis-Leistungs-Verhältnis, schnelle Antworten. Late-Checkout hat super geklappt.",
    unit: "Studio Universität · vor 3 Wochen",
  },
  {
    platform: "Airbnb",
    score: "5,0",
    text: "Eine der besten Ferienwohnungen, in denen wir je waren. Alles durchdacht bis ins Detail.",
    unit: "Altstadt Apartment · vor 4 Wochen",
  },
  {
    platform: "Booking.com",
    score: "9,2",
    text: "Blitzsauber und zentral. Die Anreise-Infos kamen genau zum richtigen Zeitpunkt.",
    unit: "Garten Apartment · vor 1 Monat",
  },
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

// Compact week summary (aggregated) + chat seed
const weekRows = [
  { icon: Sparkles, text: "12 Reinigungen", meta: "zuletzt heute 11:30 · Altstadt Apartment" },
  { icon: Wrench, text: "4 Tickets gelöst", meta: "Ø 1,6 Tage Lösungszeit" },
  { icon: MessageCircle, text: "19 Gästeanfragen beantwortet", meta: "Ø 4 Min Antwortzeit" },
  { icon: Home, text: "8 Check-ins begleitet", meta: "alle reibungslos" },
];

const weekSummarySeed: Msg[] = [
  { kind: "user", text: "Was hat Arbio diese Woche für mich erledigt?" },
  {
    kind: "bot",
    text: "Gern — hier ist deine Woche im Überblick. Insgesamt 43 erledigte Aufgaben über deine 5 Einheiten, alles ohne dein Zutun:",
  },
  {
    kind: "bars",
    title: "Diese Woche erledigt · 02.–08.07.",
    bars: [
      { label: "Gäste", value: "19 Anfragen", pct: 100 },
      { label: "Reinigung", value: "12 Turnovers", pct: 63 },
      { label: "Check-ins", value: "8 begleitet", pct: 42 },
      { label: "Tickets", value: "4 gelöst", pct: 21 },
    ],
  },
  {
    kind: "bot",
    text: "Highlights: Die Heizung im Garten Apartment war in 1,5 Tagen entlüftet, der Rauchmelder im Altstadt Apartment wurde beim Turnover direkt mit erledigt, und alle 8 Check-ins liefen ohne einen einzigen Anruf bei dir. Offen sind nur noch die Freigabe zur Duschglaswand und der Router-Termin am 14.07.",
  },
];

/* ---------- page ---------- */

export default function Operativ() {
  const { openChat } = useArbioChat();
  const [reviewsOpen, setReviewsOpen] = useState(false);

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

      {/* 2 — Ticket board with integrated KPIs */}
      <div className="bg-white border border-line rounded-[24px] p-7 mt-6 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="flex items-start justify-between flex-wrap gap-4">
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

      {/* 3 — Compact week summary */}
      <div className="bg-white border border-line rounded-[24px] p-7 mt-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="text-[16px]">Diese Woche erledigt</h3>
          <button
            onClick={() => openChat(weekSummarySeed)}
            className="flex items-center gap-2 border border-line rounded-full px-4 py-2 text-[14px] hover:bg-panel"
          >
            <MessageCircle size={14} className="text-muted" />
            Zusammenfassung im Chat
          </button>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-3 mt-4">
          {weekRows.map(({ icon: Icon, text, meta }) => (
            <div key={text} className="flex items-center gap-3 bg-panel rounded-[16px] px-4 py-3.5">
              <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-muted shrink-0">
                <Icon size={15} />
              </span>
              <div className="min-w-0">
                <div className="text-[15px] leading-tight flex items-center gap-1.5">
                  {text}
                  <CheckCircle2 size={13} className="text-accent-text shrink-0" />
                </div>
                <div className="text-[12px] text-muted mt-0.5 truncate">{meta}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 — Bewertungen (second half, focused) */}
      <div className="flex items-center gap-2 text-[12px] tracking-[1.5px] uppercase text-muted mt-8 mb-3">
        <Star size={12} />
        Bewertungen
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.15fr] gap-4">
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

        <AiCard
          title="Deine Bewertungen. Auf einen Blick."
          rows={[
            {
              label: "Ergebnis",
              text: "4,8 ★ auf Airbnb und 9,3 auf Booking.com — deine Immobilien gehören zu den bestbewerteten ihrer Viertel.",
            },
            {
              label: "Warum",
              text: "Sauberkeit und Check-in werden in 9 von 10 Bewertungen positiv erwähnt — das Ergebnis von 38 Reinigungen und 8 begleiteten Check-ins allein diesen Monat.",
            },
            {
              label: "Arbio kümmert sich",
              text: "Das WLAN-Thema aus zwei Bewertungen ist adressiert: Der Routertausch im Garten Apartment ist für den 14.07. terminiert.",
            },
          ]}
          chatHint="Details im Chat fragen"
        />
      </div>

      {/* Neueste Bewertungen — full width */}
      <div className="bg-white border border-line rounded-[24px] p-7 mt-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between">
          <h3 className="text-[16px]">Neueste Bewertungen</h3>
          <button
            onClick={() => setReviewsOpen(true)}
            className="flex items-center gap-2 border border-line rounded-full px-4 py-2 text-[14px] hover:bg-panel"
          >
            <Star size={14} className="text-muted" />
            Alle Bewertungen
          </button>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-5">
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

      {/* All reviews popup */}
      {reviewsOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center px-6"
          onClick={() => setReviewsOpen(false)}
        >
          <div
            className="bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] w-full max-w-[640px] h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-7 py-5 border-b border-line">
              <div>
                <div className="text-[16px]">Alle Bewertungen</div>
                <div className="text-[13px] text-muted mt-0.5">
                  {allReviews.length} Bewertungen · Ø 4,8 ★ Airbnb · 9,3 Booking.com
                </div>
              </div>
              <button
                onClick={() => setReviewsOpen(false)}
                className="w-9 h-9 rounded-full bg-panel flex items-center justify-center text-muted"
              >
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-7 py-5 flex flex-col gap-3">
              {allReviews.map(({ platform, score, text, unit }) => (
                <div key={unit + text.slice(0, 12)} className="shrink-0 bg-panel rounded-[18px] px-5 py-4">
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
      )}

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
