"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  CheckCircle2,
  ChevronDown,
  Home,
  Wrench,
} from "lucide-react";
import { ChatInput } from "@/components/chat-input";

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
};

const units: { name: string; bookings: Booking[] }[] = [
  {
    name: "Altstadt Apartment",
    bookings: [
      { start: 1, end: 5, label: "Anna Weber", price: "€820", profit: "€590" },
      { start: 6, end: 12, label: "M. Rossi", price: "€1.240", profit: "€900" },
      {
        start: 13,
        end: 14,
        label: "Therme-Wartung",
        kind: "maintenance",
        note: "Jährliche Thermenwartung (Drittanbieter). Kein Gast betroffen.",
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
        label: "Wasserschaden Bad",
        kind: "maintenance",
        ticket: "#1038",
        lostRevenue: "ca. €610",
        note: "Trocknung & Reparatur. Zeitraum auf allen Kanälen gesperrt.",
      },
      { start: 13, end: 16, label: "S. Meier", price: "€560", profit: "€400" },
      { start: 18, end: 31, label: "F. Dubois", price: "€1.890", profit: "€1.400" },
    ],
  },
  {
    name: "Garten Apartment",
    bookings: [
      { start: 3, end: 6, label: "P. Novak", price: "€510", profit: "€370" },
      { start: 8, end: 16, label: "Familie Krüger", price: "€1.320", profit: "€960" },
      { start: 20, end: 24, label: "Eigenbelegung", kind: "owner" },
      { start: 26, end: 30, label: "R. Silva", price: "€830", profit: "€600" },
    ],
  },
];

function BookingBar({ b }: { b: Booking }) {
  const kind = b.kind ?? "guest";
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
    <div
      className="group relative h-9 flex items-center"
      style={{ gridColumn: `${b.start} / ${b.end + 1}` }}
    >
      <div
        className={`w-full h-full rounded-full flex items-center gap-1.5 px-3 text-[13px] truncate cursor-default ${style}`}
        style={hatch}
      >
        {kind === "maintenance" && <Wrench size={12} className="shrink-0" />}
        <span className="truncate">{b.label}</span>
      </div>

      {/* Hover tooltip */}
      <div className="hidden group-hover:block absolute bottom-full left-0 mb-2 z-20 pointer-events-none">
        <div className="bg-white border border-line rounded-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] px-5 py-4 w-[250px]">
          <div className="text-[15px]">{b.label}</div>
          <div className="text-[13px] text-muted mt-0.5">
            {String(b.start).padStart(2, "0")}. – {String(b.end).padStart(2, "0")}. Juli 2026
          </div>
          {kind === "guest" && (
            <div className="flex flex-col gap-1.5 mt-3">
              <div className="flex justify-between text-[14px]">
                <span className="text-muted">Buchungswert</span>
                <span>{b.price}</span>
              </div>
              <div className="flex justify-between text-[14px]">
                <span className="text-muted">Geschätzter Profit</span>
                <span className="text-accent-text">{b.profit}</span>
              </div>
            </div>
          )}
          {kind === "owner" && (
            <div className="text-[13px] text-muted mt-3">
              Eigenbelegung · Zeitraum für Gäste blockiert
            </div>
          )}
          {kind === "maintenance" && (
            <div className="mt-3 flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-[13px] text-[#8a5a1a]">
                <Wrench size={12} />
                Wartung · für Gäste blockiert
              </div>
              {b.note && <p className="text-[13px] text-muted leading-snug">{b.note}</p>}
              <div className="flex flex-col gap-1 mt-1">
                {b.ticket && (
                  <div className="flex justify-between text-[14px]">
                    <span className="text-muted">Ticket</span>
                    <span>{b.ticket}</span>
                  </div>
                )}
                {b.lostRevenue && (
                  <div className="flex justify-between text-[14px]">
                    <span className="text-muted">Entgangener Umsatz</span>
                    <span className="text-negative">{b.lostRevenue}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type Mode = "aufenthalt" | "wartung";

export default function Kalender() {
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("aufenthalt");
  const [done, setDone] = useState(false);

  const open = () => {
    setDone(false);
    setMode("aufenthalt");
    setModalOpen(true);
  };

  return (
    <div className="relative min-h-screen px-8 py-6 pb-32">
      <h1 className="text-[22px]">Kalender</h1>
      <p className="text-[15px] text-muted mt-1">
        Alle Einheiten, Buchungen und Wartungen im Überblick
      </p>

      {/* Month nav + entry button */}
      <div className="flex items-center gap-3 mt-5 mb-6 flex-wrap">
        <div className="flex items-center gap-1 border border-line rounded-full px-2 py-1.5">
          <button className="w-8 h-8 rounded-full hover:bg-panel flex items-center justify-center text-muted">
            <ChevronLeft size={16} />
          </button>
          <span className="text-[15px] px-3">Juli 2026</span>
          <button className="w-8 h-8 rounded-full hover:bg-panel flex items-center justify-center text-muted">
            <ChevronRight size={16} />
          </button>
        </div>
        <div className="flex-1" />
        <button
          onClick={open}
          className="flex items-center gap-2 bg-[#2a2a2a] text-white rounded-full px-6 py-3 text-[15px] hover:bg-black transition-colors"
        >
          <Plus size={16} />
          Eintragen
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
                  <BookingBar key={`${name}-${b.start}`} b={b} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-6 mt-5 pt-4 border-t border-line text-[13px] text-muted">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#dcebd4] inline-block" /> Gastbuchung
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#eceff1] border border-line inline-block" /> Eigenbelegung
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#fbe4c2] inline-block" /> Wartung
          </span>
        </div>
      </div>

      {/* Entry modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center px-6">
          <div className="bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] w-full max-w-[460px] p-7">
            {done ? (
              <div className="flex flex-col items-center text-center py-6">
                <CheckCircle2 size={40} className="text-accent-text" />
                <div className="text-[19px] mt-4">
                  {mode === "aufenthalt" ? "Aufenthalt eingetragen" : "Wartung eingetragen"}
                </div>
                <p className="text-[14px] text-muted mt-2 leading-snug">
                  {mode === "aufenthalt" ? (
                    <>
                      Garten Apartment · 07. – 10. August 2026
                      <br />
                      Der Zeitraum ist ab sofort für Gästebuchungen blockiert.
                    </>
                  ) : (
                    <>
                      Altstadt Apartment · 12. August 2026 · Rauchfangkehrer
                      <br />
                      Der Zeitraum ist für Gäste blockiert und unser Team ist informiert.
                    </>
                  )}
                </p>
                <button
                  onClick={() => setModalOpen(false)}
                  className="mt-6 bg-[#2a2a2a] text-white rounded-full px-8 py-3 text-[15px]"
                >
                  Fertig
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div className="text-[19px]">Kalender-Eintrag</div>
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
                    Eigener Aufenthalt
                  </button>
                  <button
                    onClick={() => setMode("wartung")}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-full py-2 text-[14px] ${
                      mode === "wartung" ? "bg-[#2a2a2a] text-white" : "text-muted"
                    }`}
                  >
                    <Wrench size={14} />
                    Wartung / Termin
                  </button>
                </div>

                <p className="text-[13px] text-muted mt-3">
                  {mode === "aufenthalt"
                    ? "Kostenlos · blockiert den Zeitraum für Gäste."
                    : "Blockiert den Zeitraum für Gäste und informiert das Arbio-Team — keine Fake-Buchung, deine Auslastungszahlen bleiben sauber."}
                </p>

                <div className="flex flex-col gap-3 mt-5">
                  <button className="flex items-center justify-between border border-line rounded-[18px] px-5 py-3.5 text-[15px]">
                    {mode === "aufenthalt" ? "Garten Apartment" : "Altstadt Apartment"}
                    <ChevronDown size={16} className="text-muted" />
                  </button>

                  {mode === "wartung" && (
                    <button className="flex items-center justify-between border border-line rounded-[18px] px-5 py-3.5 text-[15px]">
                      <span className="text-muted">Art der Wartung</span>
                      Rauchfangkehrer
                      <ChevronDown size={16} className="text-muted" />
                    </button>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-line rounded-[18px] px-5 py-3.5">
                      <div className="text-[12px] text-muted">
                        {mode === "aufenthalt" ? "Anreise" : "Von"}
                      </div>
                      <div className="text-[15px] mt-0.5">
                        {mode === "aufenthalt" ? "07.08.2026" : "12.08.2026"}
                      </div>
                    </div>
                    <div className="border border-line rounded-[18px] px-5 py-3.5">
                      <div className="text-[12px] text-muted">
                        {mode === "aufenthalt" ? "Abreise" : "Bis"}
                      </div>
                      <div className="text-[15px] mt-0.5">
                        {mode === "aufenthalt" ? "10.08.2026" : "12.08.2026"}
                      </div>
                    </div>
                  </div>

                  <p className="text-[13px] text-muted leading-snug">
                    {mode === "aufenthalt"
                      ? "Entgangener Buchungswert im Zeitraum: ca. €480. Reinigung nach Abreise wird automatisch eingeplant."
                      : "Am gewählten Tag ist keine Buchung betroffen. Fällt eine Wartung in einen gebuchten Zeitraum, meldet sich das Team zur Abstimmung."}
                  </p>
                </div>

                <button
                  onClick={() => setDone(true)}
                  className="w-full mt-5 bg-[#2a2a2a] text-white rounded-full px-6 py-3.5 text-[15px] hover:bg-black transition-colors"
                >
                  {mode === "aufenthalt" ? "Aufenthalt buchen" : "Wartung eintragen"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating chat */}
      <div className="fixed bottom-6 left-[290px] right-0 flex justify-center px-8 pointer-events-none">
        <ChatInput
          placeholder="Frag alles über deine Buchungen..."
          className="w-full max-w-[620px] pointer-events-auto"
        />
      </div>
    </div>
  );
}
