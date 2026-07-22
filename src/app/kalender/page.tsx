"use client";

import { useState } from "react";
import {
  Plus,
  X,
  CheckCircle2,
  ChevronDown,
  Home,
  Wrench,
  MessageCircle,
} from "lucide-react";
import { ChatInput } from "@/components/chat-input";
import { FilterBar } from "@/components/filter-bar";
import { useArbioChat, type Msg, type Tr } from "@/components/arbio-chat";
import { useLang } from "@/components/lang";

const DAYS = 31;

type Kind = "guest" | "owner" | "maintenance";

type Booking = {
  start: number;
  end: number; // inclusive
  label: string;
  kind?: Kind;
  price?: string;
  profit?: string;
  // maintenance
  ticket?: string;
  lostRevenue?: string;
  note?: string;
  seed?: Msg[];
};

const wasserschadenSeed = (t: Tr): Msg[] => [
  { kind: "user", text: t("Wie ist der Status beim Wasserschaden im Studio Universität?", "What's the status of the water damage in Studio University?") },
  {
    kind: "bot",
    text: t(
      "Das Studio Universität ist seit dem 04.07. wegen eines Wasserschadens im Bad blockiert (Ticket #1038, undichte Silikonfuge an der Dusche). Der Zeitraum ist auf allen Kanälen gesperrt, damit keine Gäste betroffen sind — die Freigabe ist für den 11.07. geplant.",
      "Studio University has been blocked since 04 Jul due to water damage in the bathroom (ticket #1038, a leaking silicone joint in the shower). The period is blocked across all channels so no guests are affected — it's scheduled to go live again on 11 Jul."
    ),
  },
  {
    kind: "timeline",
    title: t("Ticket #1038 · Wasserschaden Bad · Studio Universität", "Ticket #1038 · Bathroom water damage · Studio University"),
    steps: [
      { label: t("Schaden festgestellt & blockiert", "Damage detected & blocked"), meta: "04.07.", state: "done" },
      { label: t("Trocknung läuft", "Drying in progress"), meta: "05.–09.07.", state: "current" },
      { label: t("Reparatur & Endkontrolle", "Repair & final check"), meta: "10.07.", state: "pending" },
      { label: t("Einheit wieder live", "Unit live again"), meta: t("vsl. 11.07.", "est. 11 Jul"), state: "pending" },
    ],
  },
  {
    kind: "bot",
    text: t(
      "Volle Transparenz: Entgangener Umsatz bisher ca. €610 (5 blockierte Nächte à ~€122). Das Team erneuert im Zuge der Reparatur direkt alle Silikonfugen im Bad — so senken wir das Risiko eines erneuten Ausfalls. Du musst nichts tun, wir halten dich auf dem Laufenden.",
      "Full transparency: lost revenue so far is approx. €610 (5 blocked nights at ~€122). While repairing, the team is renewing all silicone joints in the bathroom — reducing the risk of another outage. You don't need to do anything, we'll keep you posted."
    ),
  },
];

const thermeSeed = (t: Tr): Msg[] => [
  { kind: "user", text: t("Was ist zur Therme-Wartung im Altstadt Apartment geplant?", "What's planned for the boiler service in Altstadt Apartment?") },
  {
    kind: "bot",
    text: t(
      "Die jährliche Thermenwartung im Altstadt Apartment ist für den 13.–14.07. eingeplant (Ticket #1046, Drittanbieter). Der Zeitraum liegt in einer Buchungslücke — kein Gast ist betroffen. Der Zugang erfolgt über die Schlüsselbox.",
      "The annual boiler service in Altstadt Apartment is scheduled for 13–14 Jul (ticket #1046, third-party provider). It falls within a booking gap — no guest is affected. Access is via the key box."
    ),
  },
  {
    kind: "timeline",
    title: t("Ticket #1046 · Therme-Wartung · Altstadt Apartment", "Ticket #1046 · Boiler service · Altstadt Apartment"),
    steps: [
      { label: t("Termin vereinbart", "Appointment arranged"), meta: "01.07.", state: "done" },
      { label: t("Zeitraum blockiert", "Period blocked"), meta: "13.–14.07.", state: "current" },
      { label: t("Wartung durchgeführt", "Service completed"), state: "pending" },
    ],
  },
  {
    kind: "bot",
    text: t(
      "Kosten: ca. €140 (Drittanbieter) — erscheint danach als Position in deiner Juli-P&L. Ich melde mich, sobald die Wartung abgeschlossen ist.",
      "Cost: approx. €140 (third-party) — it'll appear afterwards as a line item in your July P&L. I'll let you know once the service is done."
    ),
  },
];

const abflussSeed = (t: Tr): Msg[] => [
  { kind: "user", text: t("Was ist zum Abfluss im Kiez Apartment geplant?", "What's planned for the drain in Kiez Apartment?") },
  {
    kind: "bot",
    text: t(
      "Zu Ticket #1047 (Abfluss Küche läuft langsam ab, Kiez Apartment Prenzlauer Berg): Die Meldung kam über die Reinigungskraft. Unser Hausmeister prüft es beim Turnover am 12.07. — die kurze Buchungslücke reicht dafür aus, kein Gast ist betroffen.",
      "On ticket #1047 (kitchen drain draining slowly, Kiez Apartment Prenzlauer Berg): the report came in via the cleaner. Our caretaker will check it during turnover on 12 Jul — the short booking gap is enough for that, no guest is affected."
    ),
  },
  {
    kind: "timeline",
    title: t("Ticket #1047 · Abfluss Küche · Kiez Apartment", "Ticket #1047 · Kitchen drain · Kiez Apartment"),
    steps: [
      { label: t("Gemeldet", "Reported"), meta: t("heute", "today"), state: "done" },
      { label: t("Diagnose beim Turnover", "Diagnosis at turnover"), meta: "12.07.", state: "current" },
      { label: t("Erledigt", "Resolved"), state: "pending" },
    ],
  },
  {
    kind: "bot",
    text: t(
      "Falls es mehr als eine Reinigung des Siphons ist, holen wir dir vorab ein Angebot ein — du entscheidest, bevor Kosten entstehen.",
      "If it's more than cleaning the trap, we'll get you a quote first — you decide before any costs arise."
    ),
  },
];

const buildUnits = (t: Tr): { name: string; bookings: Booking[] }[] => [
  {
    name: "Altstadt Apartment",
    bookings: [
      { start: 1, end: 5, label: "Anna Weber", price: "€820", profit: "€590" },
      { start: 6, end: 12, label: "M. Rossi", price: "€1.240", profit: "€900" },
      {
        start: 13,
        end: 14,
        label: t("Therme-Wartung", "Boiler service"),
        kind: "maintenance",
        ticket: "#1046",
        note: t("Jährliche Thermenwartung (Drittanbieter). Kein Gast betroffen.", "Annual boiler service (third-party). No guest affected."),
        seed: thermeSeed(t),
      },
      { start: 15, end: 22, label: "J. Karlsson", price: "€1.610", profit: "€1.180" },
      { start: 27, end: 31, label: "T. Becker", price: "€760", profit: "€550" },
    ],
  },
  {
    name: "Studio Universität",
    bookings: [
      { start: 1, end: 3, label: "L. Nguyen", price: "€410", profit: "€300" },
      {
        start: 4,
        end: 11,
        label: t("Wasserschaden Bad", "Bathroom water damage"),
        kind: "maintenance",
        ticket: "#1038",
        lostRevenue: t("ca. €610", "approx. €610"),
        note: t("Trocknung & Reparatur. Zeitraum auf allen Kanälen gesperrt.", "Drying & repair. Period blocked across all channels."),
        seed: wasserschadenSeed(t),
      },
      { start: 13, end: 16, label: "S. Meier", price: "€560", profit: "€400" },
      { start: 18, end: 31, label: "F. Dubois", price: "€1.890", profit: "€1.400" },
    ],
  },
  {
    name: "Garten Apartment",
    bookings: [
      { start: 3, end: 6, label: "P. Novak", price: "€510", profit: "€370" },
      { start: 8, end: 16, label: t("Familie Krüger", "Krüger family"), price: "€1.320", profit: "€960" },
      { start: 20, end: 24, label: t("Eigenbelegung", "Owner stay"), kind: "owner" },
      { start: 26, end: 30, label: "R. Silva", price: "€830", profit: "€600" },
    ],
  },
  {
    name: "Altbau Suite Eppendorf",
    bookings: [
      { start: 1, end: 4, label: "H. Lindqvist", price: "€780", profit: "€560" },
      { start: 6, end: 13, label: t("Familie Conti", "Conti family"), price: "€1.560", profit: "€1.150" },
      { start: 15, end: 19, label: "A. Popović", price: "€1.010", profit: "€740" },
      { start: 22, end: 31, label: "Whitfield", price: "€1.980", profit: "€1.460" },
    ],
  },
  {
    name: "Kiez Apartment Prenzlauer Berg",
    bookings: [
      { start: 2, end: 8, label: "E. Fischer", price: "€1.180", profit: "€860" },
      { start: 10, end: 11, label: "M. Larsson", price: "€360", profit: "€260" },
      {
        start: 12,
        end: 12,
        label: t("Abfluss-Diagnose", "Drain diagnosis"),
        kind: "maintenance",
        ticket: "#1047",
        note: t("Hausmeister prüft den Küchenabfluss beim Turnover. Kein Gast betroffen.", "Caretaker checks the kitchen drain at turnover. No guest affected."),
        seed: abflussSeed(t),
      },
      { start: 14, end: 20, label: "D. Yılmaz", price: "€1.240", profit: "€910" },
      { start: 23, end: 28, label: "S. Andersson", price: "€1.040", profit: "€760" },
    ],
  },
];

type Hovered = { b: Booking; left: number; top: number; bottom: number };

function BookingBar({
  b,
  onHover,
  onClick,
}: {
  b: Booking;
  onHover: (h: Hovered | null) => void;
  onClick: (b: Booking) => void;
}) {
  const kind = b.kind ?? "guest";
  const clickable = kind === "maintenance" && !!b.seed;
  const style =
    kind === "guest"
      ? "bg-[#dcebd4] text-[#3c5f33] hover:bg-[#cfe3c4]"
      : kind === "owner"
        ? "bg-[#eceff1] text-muted border border-line"
        : "bg-[#fbe4c2] text-[#8a5a1a] hover:bg-[#f6d8a9]";

  const hatch =
    kind !== "guest"
      ? {
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(0,0,0,0.05) 6px, rgba(0,0,0,0.05) 12px)",
        }
      : undefined;

  return (
    <div className="h-9 flex items-center" style={{ gridColumn: `${b.start} / ${b.end + 1}` }}>
      <div
        onMouseEnter={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          onHover({ b, left: r.left, top: r.top, bottom: r.bottom });
        }}
        onMouseLeave={() => onHover(null)}
        onClick={() => clickable && onClick(b)}
        className={`w-full h-full rounded-full flex items-center gap-1.5 px-3 text-[13px] truncate ${style} ${
          clickable ? "cursor-pointer" : "cursor-default"
        }`}
        style={hatch}
      >
        {kind === "maintenance" && <Wrench size={12} className="shrink-0" />}
        <span className="truncate">{b.label}</span>
      </div>
    </div>
  );
}

function Tooltip({ h }: { h: Hovered }) {
  const { t } = useLang();
  const b = h.b;
  const kind = b.kind ?? "guest";
  const width = 260;
  const placeBelow = h.top < 260;
  const left = Math.max(
    12,
    Math.min(h.left, (typeof window !== "undefined" ? window.innerWidth : 1280) - width - 12)
  );
  const positionStyle = placeBelow
    ? { top: h.bottom + 8 }
    : { top: h.top - 8, transform: "translateY(-100%)" };

  return (
    <div
      className="fixed z-[60] pointer-events-none"
      style={{ left, width, ...positionStyle }}
    >
      <div className="bg-white border border-line rounded-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.14)] px-5 py-4">
        <div className="text-[15px]">{b.label}</div>
        <div className="text-[13px] text-muted mt-0.5">
          {String(b.start).padStart(2, "0")}. – {String(b.end).padStart(2, "0")}. {t("Juli", "July")} 2026
        </div>
        {kind === "guest" && (
          <div className="flex flex-col gap-1.5 mt-3">
            <div className="flex justify-between text-[14px]">
              <span className="text-muted">{t("Buchungswert", "Booking value")}</span>
              <span>{b.price}</span>
            </div>
            <div className="flex justify-between text-[14px]">
              <span className="text-muted">{t("Geschätzter Profit", "Estimated profit")}</span>
              <span className="text-accent-text">{b.profit}</span>
            </div>
          </div>
        )}
        {kind === "owner" && (
          <div className="text-[13px] text-muted mt-3">
            {t("Eigenbelegung · Zeitraum für Gäste blockiert", "Owner stay · period blocked for guests")}
          </div>
        )}
        {kind === "maintenance" && (
          <div className="mt-3 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-[13px] text-[#8a5a1a]">
              <Wrench size={12} />
              {t("Wartung · für Gäste blockiert", "Maintenance · blocked for guests")}
            </div>
            {b.note && <p className="text-[13px] text-muted leading-snug">{b.note}</p>}
            {b.ticket && (
              <div className="flex justify-between text-[14px] mt-1">
                <span className="text-muted">Ticket</span>
                <span>{b.ticket}</span>
              </div>
            )}
            {b.lostRevenue && (
              <div className="flex justify-between text-[14px]">
                <span className="text-muted">{t("Entgangener Umsatz", "Lost revenue")}</span>
                <span className="text-negative">{b.lostRevenue}</span>
              </div>
            )}
            {b.seed && (
              <div className="flex items-center gap-1.5 text-[13px] text-muted mt-2 pt-2 border-t border-line">
                <MessageCircle size={12} />
                {t("Klicken für Status im Chat", "Click for status in chat")}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

type Mode = "aufenthalt" | "wartung";

export default function Kalender() {
  const { openChat } = useArbioChat();
  const { t } = useLang();
  const units = buildUnits(t);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("aufenthalt");
  const [done, setDone] = useState(false);
  const [hovered, setHovered] = useState<Hovered | null>(null);

  const open = () => {
    setDone(false);
    setMode("aufenthalt");
    setModalOpen(true);
  };

  return (
    <div className="relative min-h-screen px-8 py-6 pb-32">
      {/* Filters + entry button */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <FilterBar />
        <div className="flex-1" />
        <button
          onClick={open}
          className="flex items-center gap-2 bg-[#2a2a2a] text-white rounded-full px-6 py-3 text-[15px] hover:bg-black transition-colors"
        >
          <Plus size={16} />
          {t("Eintragen", "Add entry")}
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-white border border-line rounded-[24px] p-7 shadow-[0_1px_4px_rgba(0,0,0,0.03)] overflow-x-auto">
        <div className="min-w-[980px]">
          {/* Day header */}
          <div className="grid" style={{ gridTemplateColumns: `180px repeat(${DAYS}, 1fr)` }}>
            <div />
            {Array.from({ length: DAYS }, (_, i) => {
              const day = i + 1;
              const weekday = (day + 2) % 7; // 0=Mo ... 5=Sa 6=So
              const weekend = weekday >= 5;
              return (
                <div
                  key={day}
                  className={`text-center text-[12px] pb-3 ${
                    weekend ? "text-foreground" : "text-muted"
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {/* Unit rows */}
          {units.map(({ name, bookings }) => (
            <div
              key={name}
              className="grid items-center border-t border-line py-2.5"
              style={{ gridTemplateColumns: `180px repeat(${DAYS}, 1fr)` }}
            >
              <div className="text-[14px] pr-4 truncate">{name}</div>
              <div
                className="grid col-span-31 gap-y-1"
                style={{
                  gridColumn: `2 / ${DAYS + 2}`,
                  gridTemplateColumns: `repeat(${DAYS}, 1fr)`,
                }}
              >
                {bookings.map((b) => (
                  <BookingBar
                    key={`${name}-${b.start}`}
                    b={b}
                    onHover={setHovered}
                    onClick={(bk) => bk.seed && openChat(bk.seed)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-6 mt-5 pt-4 border-t border-line text-[13px] text-muted">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#dcebd4] inline-block" /> {t("Gastbuchung", "Guest booking")}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#eceff1] border border-line inline-block" /> {t("Eigenbelegung", "Owner stay")}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#fbe4c2] inline-block" /> {t("Wartung", "Maintenance")}
          </span>
        </div>
      </div>

      {/* Hover tooltip (rendered fixed so it is never clipped) */}
      {hovered && <Tooltip h={hovered} />}

      {/* Entry modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center px-6">
          <div className="bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] w-full max-w-[460px] p-7">
            {done ? (
              <div className="flex flex-col items-center text-center py-6">
                <CheckCircle2 size={40} className="text-accent-text" />
                <div className="text-[19px] mt-4">
                  {mode === "aufenthalt" ? t("Aufenthalt eingetragen", "Stay added") : t("Wartung eingetragen", "Maintenance added")}
                </div>
                <p className="text-[14px] text-muted mt-2 leading-snug">
                  {mode === "aufenthalt" ? (
                    <>
                      Garten Apartment · 07. – 10. {t("August", "August")} 2026
                      <br />
                      {t("Der Zeitraum ist ab sofort für Gästebuchungen blockiert.", "The period is now blocked for guest bookings.")}
                    </>
                  ) : (
                    <>
                      Altstadt Apartment · 12. {t("August", "August")} 2026 · {t("Rauchfangkehrer", "Chimney sweep")}
                      <br />
                      {t("Der Zeitraum ist für Gäste blockiert und unser Team ist informiert.", "The period is blocked for guests and our team has been notified.")}
                    </>
                  )}
                </p>
                <button
                  onClick={() => setModalOpen(false)}
                  className="mt-6 bg-[#2a2a2a] text-white rounded-full px-8 py-3 text-[15px]"
                >
                  {t("Fertig", "Done")}
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div className="text-[19px]">{t("Kalender-Eintrag", "Calendar entry")}</div>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="w-9 h-9 rounded-full bg-panel flex items-center justify-center text-muted"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Mode toggle */}
                <div className="flex items-center gap-1 border border-line rounded-full p-1 mt-4">
                  <button
                    onClick={() => setMode("aufenthalt")}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-full py-2 text-[14px] ${
                      mode === "aufenthalt" ? "bg-[#2a2a2a] text-white" : "text-muted"
                    }`}
                  >
                    <Home size={14} />
                    {t("Eigener Aufenthalt", "Own stay")}
                  </button>
                  <button
                    onClick={() => setMode("wartung")}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-full py-2 text-[14px] ${
                      mode === "wartung" ? "bg-[#2a2a2a] text-white" : "text-muted"
                    }`}
                  >
                    <Wrench size={14} />
                    {t("Wartung / Termin", "Maintenance / appointment")}
                  </button>
                </div>

                <p className="text-[13px] text-muted mt-3">
                  {mode === "aufenthalt"
                    ? t("Kostenlos · blockiert den Zeitraum für Gäste.", "Free · blocks the period for guests.")
                    : t("Blockiert den Zeitraum für Gäste und informiert das Arbio-Team — keine Fake-Buchung, deine Auslastungszahlen bleiben sauber.", "Blocks the period for guests and notifies the Arbio team — no fake booking, your occupancy figures stay clean.")}
                </p>

                <div className="flex flex-col gap-3 mt-5">
                  <button className="flex items-center justify-between border border-line rounded-[18px] px-5 py-3.5 text-[15px]">
                    {mode === "aufenthalt" ? "Garten Apartment" : "Altstadt Apartment"}
                    <ChevronDown size={16} className="text-muted" />
                  </button>

                  {mode === "wartung" && (
                    <button className="flex items-center justify-between border border-line rounded-[18px] px-5 py-3.5 text-[15px]">
                      <span className="text-muted">{t("Art der Wartung", "Type of maintenance")}</span>
                      {t("Rauchfangkehrer", "Chimney sweep")}
                      <ChevronDown size={16} className="text-muted" />
                    </button>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-line rounded-[18px] px-5 py-3.5">
                      <div className="text-[12px] text-muted">
                        {mode === "aufenthalt" ? t("Anreise", "Check-in") : t("Von", "From")}
                      </div>
                      <div className="text-[15px] mt-0.5">
                        {mode === "aufenthalt" ? "07.08.2026" : "12.08.2026"}
                      </div>
                    </div>
                    <div className="border border-line rounded-[18px] px-5 py-3.5">
                      <div className="text-[12px] text-muted">
                        {mode === "aufenthalt" ? t("Abreise", "Check-out") : t("Bis", "To")}
                      </div>
                      <div className="text-[15px] mt-0.5">
                        {mode === "aufenthalt" ? "10.08.2026" : "12.08.2026"}
                      </div>
                    </div>
                  </div>

                  <p className="text-[13px] text-muted leading-snug">
                    {mode === "aufenthalt"
                      ? t("Entgangener Buchungswert im Zeitraum: ca. €480. Reinigung nach Abreise wird automatisch eingeplant.", "Lost booking value for the period: approx. €480. Cleaning after check-out is scheduled automatically.")
                      : t("Am gewählten Tag ist keine Buchung betroffen. Fällt eine Wartung in einen gebuchten Zeitraum, meldet sich das Team zur Abstimmung.", "No booking is affected on the selected day. If maintenance falls within a booked period, the team will reach out to coordinate.")}
                  </p>
                </div>

                <button
                  onClick={() => setDone(true)}
                  className="w-full mt-5 bg-[#2a2a2a] text-white rounded-full px-6 py-3.5 text-[15px] hover:bg-black transition-colors"
                >
                  {mode === "aufenthalt" ? t("Aufenthalt buchen", "Book stay") : t("Wartung eintragen", "Add maintenance")}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating chat */}
      <div className="fixed bottom-6 left-[var(--sidebar-w)] right-0 flex justify-center px-8 pointer-events-none transition-[left] duration-200 ease-out">
        <ChatInput
          placeholder={t("Frag alles über deine Buchungen...", "Ask anything about your bookings...")}
          className="w-full max-w-[620px] pointer-events-auto"
        />
      </div>
    </div>
  );
}
