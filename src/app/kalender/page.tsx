"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";
import { ChatInput } from "@/components/chat-input";

const DAYS = 31;

type Booking = {
  start: number;
  end: number; // inclusive
  guest: string;
  price?: string;
  profit?: string;
  owner?: boolean;
};

const units: { name: string; bookings: Booking[] }[] = [
  {
    name: "Altstadt Apartment",
    bookings: [
      { start: 1, end: 5, guest: "Anna Weber", price: "€820", profit: "€590" },
      { start: 6, end: 12, guest: "M. Rossi", price: "€1.240", profit: "€900" },
      { start: 15, end: 22, guest: "J. Karlsson", price: "€1.610", profit: "€1.180" },
      { start: 27, end: 31, guest: "T. Becker", price: "€760", profit: "€550" },
    ],
  },
  {
    name: "Studio Universität",
    bookings: [
      { start: 2, end: 9, guest: "L. Nguyen", price: "€980", profit: "€710" },
      { start: 11, end: 14, guest: "S. Meier", price: "€420", profit: "€300" },
      { start: 18, end: 31, guest: "F. Dubois", price: "€1.890", profit: "€1.400" },
    ],
  },
  {
    name: "Garten Apartment",
    bookings: [
      { start: 3, end: 6, guest: "P. Novak", price: "€510", profit: "€370" },
      { start: 8, end: 16, guest: "Familie Krüger", price: "€1.320", profit: "€960" },
      { start: 20, end: 24, guest: "Eigenbelegung", owner: true },
      { start: 26, end: 30, guest: "R. Silva", price: "€830", profit: "€600" },
    ],
  },
];

function BookingBar({ b }: { b: Booking }) {
  return (
    <div
      className="group relative h-9 flex items-center"
      style={{ gridColumn: `${b.start} / ${b.end + 1}` }}
    >
      <div
        className={`w-full h-full rounded-full flex items-center px-3 text-[13px] truncate cursor-default ${
          b.owner
            ? "bg-[#eceff1] text-muted border border-line"
            : "bg-[#dcebd4] text-[#3c5f33] hover:bg-[#cfe3c4]"
        }`}
        style={
          b.owner
            ? {
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(0,0,0,0.04) 6px, rgba(0,0,0,0.04) 12px)",
              }
            : undefined
        }
      >
        <span className="truncate">{b.guest}</span>
      </div>

      {/* Hover tooltip */}
      <div className="hidden group-hover:block absolute bottom-full left-0 mb-2 z-20 pointer-events-none">
        <div className="bg-white border border-line rounded-[18px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] px-5 py-4 w-[240px]">
          <div className="text-[15px]">{b.guest}</div>
          <div className="text-[13px] text-muted mt-0.5">
            {String(b.start).padStart(2, "0")}. – {String(b.end).padStart(2, "0")}. Juli 2026
          </div>
          {b.owner ? (
            <div className="text-[13px] text-muted mt-3">
              Eigenbelegung · Zeitraum für Gäste blockiert
            </div>
          ) : (
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
        </div>
      </div>
    </div>
  );
}

export default function Kalender() {
  const [modalOpen, setModalOpen] = useState(false);
  const [booked, setBooked] = useState(false);

  return (
    <div className="relative min-h-screen px-8 py-6 pb-32">
      <h1 className="text-[22px]">Kalender</h1>
      <p className="text-[15px] text-muted mt-1">
        Alle Einheiten und Buchungen im Überblick
      </p>

      {/* Month nav + own stay button */}
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
          onClick={() => {
            setBooked(false);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 bg-[#2a2a2a] text-white rounded-full px-6 py-3 text-[15px] hover:bg-black transition-colors"
        >
          <Plus size={16} />
          Eigenen Aufenthalt buchen
        </button>
      </div>

      {/* Calendar */}
      <div className="bg-white border border-line rounded-[24px] p-7 shadow-[0_1px_4px_rgba(0,0,0,0.03)] overflow-x-auto">
        <div className="min-w-[980px]">
          {/* Day header */}
          <div className="grid" style={{ gridTemplateColumns: `180px repeat(${DAYS}, 1fr)` }}>
            <div />
            {Array.from({ length: DAYS }, (_, i) => {
              // 1 Jul 2026 is a Wednesday; weekend = Sa (4,11,...), So (5,12,...)
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
        </div>
      </div>

      {/* Own stay modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center px-6">
          <div className="bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] w-full max-w-[460px] p-7">
            {booked ? (
              <div className="flex flex-col items-center text-center py-6">
                <CheckCircle2 size={40} className="text-accent-text" />
                <div className="text-[19px] mt-4">Aufenthalt eingetragen</div>
                <p className="text-[14px] text-muted mt-2 leading-snug">
                  Garten Apartment · 07. – 10. August 2026
                  <br />
                  Der Zeitraum ist ab sofort für Gästebuchungen blockiert.
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
                  <div>
                    <div className="text-[19px]">Eigenen Aufenthalt buchen</div>
                    <p className="text-[14px] text-muted mt-1">
                      Kostenlos · blockiert den Zeitraum für Gäste
                    </p>
                  </div>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="w-9 h-9 rounded-full bg-panel flex items-center justify-center text-muted"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="flex flex-col gap-3 mt-6">
                  <button className="flex items-center justify-between border border-line rounded-[18px] px-5 py-3.5 text-[15px]">
                    Garten Apartment
                    <ChevronDown size={16} className="text-muted" />
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border border-line rounded-[18px] px-5 py-3.5">
                      <div className="text-[12px] text-muted">Anreise</div>
                      <div className="text-[15px] mt-0.5">07.08.2026</div>
                    </div>
                    <div className="border border-line rounded-[18px] px-5 py-3.5">
                      <div className="text-[12px] text-muted">Abreise</div>
                      <div className="text-[15px] mt-0.5">10.08.2026</div>
                    </div>
                  </div>
                  <p className="text-[13px] text-muted leading-snug">
                    Entgangener Buchungswert im Zeitraum: ca. €480. Reinigung
                    nach Abreise wird automatisch eingeplant.
                  </p>
                </div>

                <button
                  onClick={() => setBooked(true)}
                  className="w-full mt-5 bg-[#2a2a2a] text-white rounded-full px-6 py-3.5 text-[15px] hover:bg-black transition-colors"
                >
                  Aufenthalt buchen
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
