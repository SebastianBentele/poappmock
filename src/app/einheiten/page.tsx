"use client";

import { useRef, useState } from "react";
import { useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Home,
  Plus,
  Minus,
  Star,
  Wrench,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { ChatInput } from "@/components/chat-input";

type Unit = {
  key: string;
  name: string;
  city: string;
  adr: string;
  occ: string;
  revenue: string;
  rating: string;
  status: "live" | "blocked";
  blockedNote?: string;
  image: string;
  map: { x: number; y: number };
  recommendations: { title: string; price: string; note: string }[];
  tickets: { id: string; title: string; status: string }[];
};

const units: Unit[] = [
  {
    key: "altstadt",
    name: "Altstadt Apartment",
    city: "München",
    adr: "265 €",
    occ: "82 %",
    revenue: "€15.400",
    rating: "4,9 ★",
    status: "live",
    image: "/units/altstadt.jpg",
    map: { x: 430, y: 300 },
    recommendations: [
      {
        title: "Neues Sofa",
        price: "€700",
        note: "Aktuelles Sofa wird in Bewertungen erwähnt — vsl. +€8/Nacht ADR nach Austausch",
      },
    ],
    tickets: [
      { id: "#1043", title: "Spülmaschine macht Geräusche", status: "Offen" },
      { id: "#1046", title: "Therme-Wartung 13.–14.07.", status: "Geplant" },
    ],
  },
  {
    key: "studio",
    name: "Studio Universität",
    city: "München",
    adr: "182 €",
    occ: "71 %",
    revenue: "€9.800",
    rating: "4,7 ★",
    status: "blocked",
    blockedNote: "Wasserschaden Bad · wieder live vsl. 11.07.",
    image: "/units/studio.jpg",
    map: { x: 720, y: 480 },
    recommendations: [
      { title: "Toaster ersetzen", price: "€35", note: "Von Gästen zweimal angefragt" },
    ],
    tickets: [
      { id: "#1038", title: "Wasserschaden Bad", status: "In Arbeit" },
      { id: "#1039", title: "Zusatzreinigung nach Late-Checkout", status: "Offen" },
    ],
  },
  {
    key: "garten",
    name: "Garten Apartment",
    city: "Berlin",
    adr: "221 €",
    occ: "76 %",
    revenue: "€12.900",
    rating: "4,8 ★",
    status: "live",
    image: "/units/garten.jpg",
    map: { x: 1030, y: 250 },
    recommendations: [
      {
        title: "Verdunkelungsvorhänge",
        price: "€180",
        note: "Häufiges Bewertungsthema im Sommer — bessere Schlafqualität, bessere Reviews",
      },
    ],
    tickets: [{ id: "#1041", title: "WLAN-Router austauschen", status: "In Arbeit" }],
  },
  {
    key: "eppendorf",
    name: "Altbau Suite Eppendorf",
    city: "Hamburg",
    adr: "198 €",
    occ: "79 %",
    revenue: "€11.600",
    rating: "4,8 ★",
    status: "live",
    image: "/units/eppendorf.jpg",
    map: { x: 260, y: 640 },
    recommendations: [
      {
        title: "Kaffeemaschine upgraden",
        price: "€120",
        note: "Häufigster Gästewunsch in den Bewertungen — kleiner Invest, spürbarer Review-Effekt",
      },
    ],
    tickets: [],
  },
  {
    key: "prenzlauer",
    name: "Kiez Apartment Prenzlauer Berg",
    city: "Berlin",
    adr: "174 €",
    occ: "84 %",
    revenue: "€10.200",
    rating: "4,6 ★",
    status: "live",
    image: "/units/prenzlauer.jpg",
    map: { x: 1180, y: 560 },
    recommendations: [
      {
        title: "Schallschutz-Vorhänge",
        price: "€150",
        note: "Straßenlärm wird in 3 Bewertungen erwähnt — Vorhänge heben vsl. die Schlaf-Scores",
      },
    ],
    tickets: [{ id: "#1047", title: "Abfluss Küche läuft langsam ab", status: "Offen" }],
  },
];

type Popup = { unit: Unit; x: number; y: number };

function UnitPopup({ p, onClose }: { p: Popup; onClose: () => void }) {
  const width = 360;
  const height = 580;
  const left = Math.max(12, Math.min(p.x + 14, (typeof window !== "undefined" ? window.innerWidth : 1400) - width - 16));
  const top = Math.max(12, Math.min(p.y - 60, (typeof window !== "undefined" ? window.innerHeight : 900) - height - 12));
  const u = p.unit;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed z-50 bg-white border border-line rounded-[22px] shadow-[0_20px_60px_rgba(0,0,0,0.18)] p-6"
        style={{ left, top, width }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={u.image}
          alt={u.name}
          className="w-full h-[130px] object-cover rounded-[14px] mb-4"
          draggable={false}
        />
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[16px]">{u.name}</div>
            <div className="text-[13px] text-muted mt-0.5">{u.city}</div>
          </div>
          <div className="flex items-center gap-2">
            {u.status === "live" ? (
              <span className="flex items-center gap-1.5 bg-[#eef5eb] text-accent-text rounded-full px-3 py-1 text-[13px]">
                <span className="w-2 h-2 rounded-full bg-accent inline-block" />
                Live
              </span>
            ) : (
              <span className="flex items-center gap-1.5 bg-[#fdecea] text-negative rounded-full px-3 py-1 text-[13px]">
                <span className="w-2 h-2 rounded-full bg-negative inline-block" />
                Blockiert
              </span>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-panel flex items-center justify-center text-muted"
            >
              <X size={14} />
            </button>
          </div>
        </div>
        {u.blockedNote && (
          <div className="text-[13px] text-negative mt-2">{u.blockedNote}</div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-2.5 mt-4">
          {[
            { label: "Umsatz Juli", value: u.revenue },
            { label: "Auslastung", value: u.occ },
            { label: "Ø Tagesrate", value: u.adr },
            { label: "Bewertung", value: u.rating },
          ].map(({ label, value }) => (
            <div key={label} className="bg-panel rounded-[14px] px-4 py-3">
              <div className="text-[12px] text-muted">{label}</div>
              <div className="text-[18px] tracking-[-0.3px] mt-0.5">{value}</div>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        <div className="mt-4">
          <div className="flex items-center gap-1.5 text-[12px] tracking-[1.5px] uppercase text-muted">
            <Sparkles size={12} />
            Empfehlungen von Arbio
          </div>
          <div className="flex flex-col mt-1">
            {u.recommendations.map(({ title, price, note }) => (
              <div key={title} className="py-2.5 border-b border-line last:border-b-0">
                <div className="flex items-center justify-between text-[14px]">
                  <span>{title}</span>
                  <span>{price}</span>
                </div>
                <p className="text-[13px] text-muted leading-snug mt-0.5">{note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tickets */}
        <div className="mt-4">
          <div className="flex items-center gap-1.5 text-[12px] tracking-[1.5px] uppercase text-muted">
            <Wrench size={12} />
            Tickets
          </div>
          {u.tickets.length === 0 ? (
            <div className="flex items-center gap-2 text-[14px] text-muted mt-2">
              <CheckCircle2 size={14} className="text-accent-text" />
              Keine offenen Tickets
            </div>
          ) : (
            <div className="flex flex-col mt-1">
              {u.tickets.map(({ id, title, status }) => (
                <div
                  key={id}
                  className="flex items-center gap-3 py-2.5 border-b border-line last:border-b-0"
                >
                  <span className="text-[13px] text-muted shrink-0">{id}</span>
                  <span className="flex-1 text-[14px] truncate">{title}</span>
                  <span
                    className={`text-[12px] rounded-full px-2.5 py-0.5 shrink-0 ${
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
          )}
        </div>
      </div>
    </>
  );
}

export default function Einheiten() {
  const [popup, setPopup] = useState<Popup | null>(null);
  const [active, setActive] = useState(1);
  const [pan, setPan] = useState({ x: -180, y: -70 });
  const [zoom, setZoom] = useState(1);
  const drag = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null);
  const moved = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackRef.current
      ?.querySelector(`[data-card="${active}"]`)
      ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  const openPopup = (unit: Unit, e: { clientX: number; clientY: number }) => {
    if (moved.current) return;
    setPopup({ unit, x: e.clientX, y: e.clientY });
  };

  const clampPan = (x: number, y: number) => ({
    x: Math.max(-820, Math.min(60, x)),
    y: Math.max(-480, Math.min(60, y)),
  });

  return (
    <div className="relative min-h-screen px-8 py-6 pb-32">
      <h1 className="text-[22px]">Portfolio</h1>
      <p className="text-[15px] text-muted mt-1">
        Deine Einheiten auf der Karte und im Überblick
      </p>

      {/* Map */}
      <div className="bg-white border border-line rounded-[24px] p-2 mt-6 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div
          className="relative h-[420px] rounded-[18px] overflow-hidden cursor-grab active:cursor-grabbing select-none"
          style={{ background: "#eef1ec" }}
          onPointerDown={(e) => {
            drag.current = { startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y };
            moved.current = false;
          }}
          onPointerMove={(e) => {
            if (!drag.current) return;
            const dx = e.clientX - drag.current.startX;
            const dy = e.clientY - drag.current.startY;
            if (Math.abs(dx) + Math.abs(dy) > 6) moved.current = true;
            setPan(clampPan(drag.current.panX + dx, drag.current.panY + dy));
          }}
          onPointerUp={() => {
            drag.current = null;
            // click events fire synchronously after pointerup — clear the
            // drag flag afterwards so only the drag-release click is suppressed
            setTimeout(() => (moved.current = false), 0);
          }}
          onPointerLeave={() => {
            drag.current = null;
            setTimeout(() => (moved.current = false), 0);
          }}
        >
          <div
            className="absolute"
            style={{
              width: 1400,
              height: 900,
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "center",
            }}
          >
            {/* Stylized city map */}
            <svg width="1400" height="900" className="absolute inset-0">
              {/* river */}
              <path
                d="M 900 -20 C 850 200, 950 350, 880 520 C 830 650, 900 780, 860 920"
                stroke="#d7e6ee"
                strokeWidth="56"
                fill="none"
              />
              {/* parks */}
              <ellipse cx="330" cy="520" rx="150" ry="95" fill="#dcebd4" opacity="0.8" />
              <ellipse cx="1120" cy="600" rx="180" ry="110" fill="#dcebd4" opacity="0.8" />
              <ellipse cx="580" cy="150" rx="110" ry="70" fill="#dcebd4" opacity="0.6" />
              {/* street grid */}
              {[120, 250, 380, 520, 660, 790].map((y) => (
                <line key={`h${y}`} x1="0" y1={y} x2="1400" y2={y} stroke="#ffffff" strokeWidth="10" />
              ))}
              {[160, 340, 540, 760, 980, 1200].map((x) => (
                <line key={`v${x}`} x1={x} y1="0" x2={x} y2="900" stroke="#ffffff" strokeWidth="10" />
              ))}
              {/* diagonal avenue */}
              <line x1="80" y1="820" x2="1320" y2="120" stroke="#ffffff" strokeWidth="14" />
              {/* district labels */}
              <text x="270" y="240" fill="#9aa39a" fontSize="15" letterSpacing="2">ALTSTADT</text>
              <text x="640" y="600" fill="#9aa39a" fontSize="15" letterSpacing="2">UNIVIERTEL</text>
              <text x="1010" y="420" fill="#9aa39a" fontSize="15" letterSpacing="2">GARTENSTADT</text>
              <text x="895" y="90" fill="#b3c6d1" fontSize="14" letterSpacing="2" transform="rotate(75 895 90)">ISAR</text>
            </svg>

            {/* Unit markers */}
            {units.map((u) => (
              <button
                key={u.key}
                onClick={(e) => openPopup(u, e)}
                className="absolute flex flex-col items-center"
                style={{ left: u.map.x - 22, top: u.map.y - 22 }}
              >
                <span className="relative w-11 h-11 rounded-full bg-white border border-line shadow-[0_4px_14px_rgba(0,0,0,0.14)] flex items-center justify-center hover:scale-110 transition-transform">
                  <Home size={18} />
                  <span
                    className={`absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      u.status === "live" ? "bg-accent" : "bg-negative"
                    }`}
                  />
                </span>
                <span className="mt-1.5 bg-white border border-line rounded-full px-3 py-1 text-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.08)] whitespace-nowrap">
                  {u.name}
                </span>
              </button>
            ))}
          </div>

          {/* Zoom controls */}
          <div className="absolute right-4 top-4 flex flex-col gap-1.5">
            <button
              onClick={() => setZoom((z) => Math.min(1.5, z + 0.15))}
              className="w-9 h-9 rounded-full bg-white border border-line shadow flex items-center justify-center text-muted hover:bg-panel"
            >
              <Plus size={15} />
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))}
              className="w-9 h-9 rounded-full bg-white border border-line shadow flex items-center justify-center text-muted hover:bg-panel"
            >
              <Minus size={15} />
            </button>
          </div>

          {/* Legend */}
          <div className="absolute left-4 bottom-4 flex gap-4 bg-white/90 border border-line rounded-full px-4 py-2 text-[12px] text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" /> Live
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-negative inline-block" /> Blockiert
            </span>
            <span>Karte ziehen zum Bewegen</span>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] tracking-[3px] uppercase">Übersicht deiner Apartments</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setActive((a) => Math.max(0, a - 1))}
              className="w-10 h-10 rounded-full border border-line bg-white flex items-center justify-center text-muted hover:bg-panel"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setActive((a) => Math.min(units.length - 1, a + 1))}
              className="w-10 h-10 rounded-full border border-line bg-white flex items-center justify-center text-muted hover:bg-panel"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="flex items-center gap-6 mt-8 min-h-[440px] overflow-x-auto px-[calc(50%-170px)] [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {units.map((u, i) => {
            const isActive = i === active;
            return (
              <button
                key={u.key}
                data-card={i}
                onClick={(e) => (isActive ? openPopup(u, e) : setActive(i))}
                className={`text-left bg-white border border-line rounded-[24px] overflow-hidden shrink-0 transition-all duration-300 ${
                  isActive
                    ? "w-[340px] shadow-[0_16px_50px_rgba(0,0,0,0.12)]"
                    : "w-[290px] opacity-80 scale-[0.94] shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
                }`}
              >
                <div className="relative h-[220px] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={u.image}
                    alt={u.name}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                  {u.status === "blocked" && (
                    <span className="absolute top-3 right-3 bg-white/90 text-negative rounded-full px-3 py-1 text-[12px]">
                      Blockiert
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <span className="bg-[#d3f2a3] text-[#3c5f33] rounded-md px-2 py-0.5 text-[11px] tracking-[1.5px] uppercase">
                    {u.city}
                  </span>
                  <div className={`mt-2.5 ${isActive ? "text-[21px]" : "text-[18px]"}`}>
                    {u.name}
                  </div>
                  <div className="mt-3 flex flex-col gap-1">
                    <div className="text-[15px]">
                      {u.adr} <span className="text-muted">ADR</span>
                    </div>
                    <div className="text-[15px]">
                      {u.occ} <span className="text-muted">occupancy</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[13px] text-muted mt-3">
                    <Star size={13} className="text-accent-text" />
                    {u.rating} · Details anzeigen
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Progress line */}
        <div className="max-w-[640px] mx-auto mt-6 h-[3px] bg-line rounded-full overflow-hidden">
          <div
            className="h-full bg-[#2a2a2a] rounded-full transition-all duration-300"
            style={{
              width: `${100 / units.length}%`,
              marginLeft: `${(active * 100) / units.length}%`,
            }}
          />
        </div>
      </div>

      {popup && <UnitPopup p={popup} onClose={() => setPopup(null)} />}

      {/* Floating chat */}
      <div className="fixed bottom-6 left-[290px] right-0 flex justify-center px-8 pointer-events-none">
        <ChatInput
          placeholder="Frag alles über deine Einheiten..."
          className="w-full max-w-[620px] pointer-events-auto"
        />
      </div>
    </div>
  );
}
