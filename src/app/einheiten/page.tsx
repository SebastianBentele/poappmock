"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  Map as MapIcon,
  LayoutGrid,
  MessageCircle,
} from "lucide-react";
import { ChatInput } from "@/components/chat-input";
import { useArbioChat, type Msg } from "@/components/arbio-chat";

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
  monthly: { label: string; value: string; pct: number }[];
  recommendations: { title: string; price: string; note: string }[];
  tickets: { id: string; title: string; status: string }[];
};

const units: Unit[] = [
  {
    key: "altstadt",
    name: "Altstadt Apartment",
    city: "Hamburg",
    adr: "265 €",
    occ: "82 %",
    revenue: "€15.400",
    rating: "4,9 ★",
    status: "live",
    image: "/units/altstadt.jpg",
    map: { x: 560, y: 380 },
    monthly: [
      { label: "Mai", value: "€11.900", pct: 77 },
      { label: "Juni", value: "€13.800", pct: 90 },
      { label: "Juli", value: "€15.400", pct: 100 },
    ],
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
    city: "Hamburg",
    adr: "182 €",
    occ: "71 %",
    revenue: "€9.800",
    rating: "4,7 ★",
    status: "blocked",
    blockedNote: "Wasserschaden Bad · wieder live vsl. 11.07.",
    image: "/units/studio.jpg",
    map: { x: 880, y: 620 },
    monthly: [
      { label: "Mai", value: "€8.100", pct: 83 },
      { label: "Juni", value: "€9.200", pct: 94 },
      { label: "Juli", value: "€9.800", pct: 100 },
    ],
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
    city: "Hamburg",
    adr: "221 €",
    occ: "76 %",
    revenue: "€12.900",
    rating: "4,8 ★",
    status: "live",
    image: "/units/garten.jpg",
    map: { x: 1230, y: 330 },
    monthly: [
      { label: "Mai", value: "€9.700", pct: 75 },
      { label: "Juni", value: "€11.400", pct: 88 },
      { label: "Juli", value: "€12.900", pct: 100 },
    ],
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
    map: { x: 330, y: 780 },
    monthly: [
      { label: "Mai", value: "€9.100", pct: 78 },
      { label: "Juni", value: "€10.500", pct: 91 },
      { label: "Juli", value: "€11.600", pct: 100 },
    ],
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
    city: "Hamburg",
    adr: "174 €",
    occ: "84 %",
    revenue: "€10.200",
    rating: "4,6 ★",
    status: "live",
    image: "/units/prenzlauer.jpg",
    map: { x: 1420, y: 700 },
    monthly: [
      { label: "Mai", value: "€8.400", pct: 82 },
      { label: "Juni", value: "€9.300", pct: 91 },
      { label: "Juli", value: "€10.200", pct: 100 },
    ],
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

// Chat seed for "Mehr Einblicke": same info as the popup, richer detail,
// plus interactive follow-ups (bars, timeline, approval) via inline chips.
function insightSeed(u: Unit): Msg[] {
  const rec = u.recommendations[0];
  const ticket = u.tickets[0];
  const chips: { label: string; answer: Msg[] }[] = [
    {
      label: "Umsatz-Verlauf anzeigen",
      answer: [
        { kind: "bars", title: `Umsatz ${u.name} · Mai – Juli 2026`, bars: u.monthly },
        {
          kind: "bot",
          text: `Der Trend zeigt klar nach oben: Juli ist mit ${u.revenue} der stärkste Monat — getragen von der Sommernachfrage und einer Rate von ${u.adr}. Die vollständige Historie findest du unter Umsatz.`,
        },
      ],
    },
    {
      label: "Auslastung einordnen",
      answer: [
        {
          kind: "bot",
          text:
            u.status === "blocked"
              ? `Die ${u.occ} Auslastung sind durch die Blockierung gedrückt — ohne die gesperrten Nächte läge die Einheit bei rund 85 %. Sobald sie wieder live ist, holt Arbio die Nachfrage über dynamische Preise und Min-Stay-Regeln direkt wieder rein.`
              : `${u.occ} Auslastung bei ${u.adr} Durchschnittsrate ist ein bewusst gewählter Sweet Spot: Arbio verramscht keine Restnächte, sondern hält die Rate hoch — das maximiert deinen Ertrag pro Nacht. Kurzfristige Lücken öffnen wir gezielt für Kurzaufenthalte.`,
        },
      ],
    },
  ];
  if (ticket) {
    chips.push({
      label: "Ticket-Status anzeigen",
      answer: [
        {
          kind: "timeline",
          title: `Ticket ${ticket.id} · ${ticket.title}`,
          steps: [
            { label: "Gemeldet", state: "done" },
            {
              label: ticket.status === "Geplant" ? "Termin geplant" : "In Bearbeitung",
              meta: ticket.status,
              state: "current",
            },
            { label: "Erledigt", state: "pending" },
          ],
        },
        {
          kind: "bot",
          text: "Das Team kümmert sich — du musst nichts tun. Alle Details und weitere Tickets findest du unter Operations.",
        },
      ],
    });
  }
  if (rec) {
    chips.push({
      label: `Empfehlung freigeben: ${rec.title}`,
      answer: [
        { kind: "bot", text: "Hier sind die Details — du kannst die Empfehlung direkt freigeben:" },
        {
          kind: "approval",
          title: rec.title,
          unit: u.name,
          report: rec.note,
          photos: 1,
          cost: rec.price,
          status: "pending",
          approveText: `Danke für die Freigabe! Wir kümmern uns um „${rec.title}“ (${rec.price}) — die Kosten erscheinen transparent in deiner P&L, und ich melde mich, sobald es umgesetzt ist.`,
          declineText:
            "Alles klar — die Empfehlung bleibt gespeichert, du kannst sie jederzeit hier oder über deinen KAM freigeben.",
        },
      ],
    });
  }
  return [
    {
      kind: "unitcard",
      image: u.image,
      name: u.name,
      city: u.city,
      status: u.status,
      blockedNote: u.blockedNote,
      kpis: [
        { label: "Umsatz Juli", value: u.revenue },
        { label: "Auslastung", value: u.occ },
        { label: "Ø Tagesrate", value: u.adr },
        { label: "Bewertung", value: u.rating },
      ],
      recommendations: u.recommendations,
      tickets: u.tickets,
    },
    {
      kind: "bot",
      text:
        u.status === "blocked"
          ? `Kurz eingeordnet: Die Einheit ist aktuell blockiert (${u.blockedNote}), das Team arbeitet an der Freigabe. Davon abgesehen steht sie stark da — ${u.rating} Bewertung und ${u.revenue} Juli-Umsatz. Tipp unten auf ein Thema oder frag frei drauflos.`
          : `Kurz eingeordnet: Die Einheit läuft großartig — ${u.rating} Bewertung, ${u.occ} Auslastung und ${u.revenue} Umsatz im Juli. Arbio prüft Preise und Verfügbarkeiten täglich. Tipp unten auf ein Thema oder frag frei drauflos.`,
    },
    { kind: "chips", options: chips },
  ];
}

function UnitPopup({
  p,
  onClose,
  onMore,
}: {
  p: Popup;
  onClose: () => void;
  onMore: (u: Unit) => void;
}) {
  const width = 360;
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const u = p.unit;

  // Position after render using the popup's real height so it always
  // stays fully inside the viewport (image header makes height dynamic).
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { width: w, height: h } = el.getBoundingClientRect();
    setPos({
      left: Math.max(12, Math.min(p.x + 14, window.innerWidth - w - 16)),
      top: Math.max(12, Math.min(p.y - 60, window.innerHeight - h - 12)),
    });
  }, [p]);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        ref={ref}
        className="fixed z-50 bg-white border border-line rounded-[22px] shadow-[0_20px_60px_rgba(0,0,0,0.18)] p-6 overflow-y-auto"
        style={{
          left: pos?.left ?? p.x,
          top: pos?.top ?? 12,
          width,
          maxHeight: "calc(100vh - 24px)",
          visibility: pos ? "visible" : "hidden",
        }}
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

        {/* More insights → chat */}
        <button
          onClick={() => onMore(u)}
          className="w-full flex items-center justify-center gap-2 bg-[#2a2a2a] text-white rounded-full px-5 py-3 text-[15px] mt-5 hover:bg-black transition-colors"
        >
          <MessageCircle size={15} />
          Mehr Einblicke
        </button>
      </div>
    </>
  );
}

function CityMapSvg() {
  return (
    <svg width="1700" height="1100" className="absolute inset-0">
      {/* base block texture: subtle darker districts */}
      <rect x="380" y="240" width="360" height="300" rx="26" fill="#e9ece5" />
      <rect x="820" y="480" width="330" height="280" rx="26" fill="#e9ece5" />
      <rect x="1180" y="200" width="320" height="260" rx="26" fill="#ece9e1" />
      <rect x="180" y="640" width="340" height="300" rx="26" fill="#e9ece5" />
      <rect x="1280" y="560" width="300" height="300" rx="26" fill="#e9ece5" />
      <rect x="620" y="60" width="300" height="220" rx="26" fill="#ece9e1" />

      {/* lake + river with fork */}
      <ellipse cx="1080" cy="120" rx="130" ry="80" fill="#d7e6ee" />
      <path
        d="M 1060 180 C 1010 320, 1090 440, 1020 580 C 960 700, 1030 850, 990 1110"
        stroke="#d7e6ee"
        strokeWidth="52"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 1035 500 C 900 560, 760 540, 600 640 C 480 715, 380 700, 240 780"
        stroke="#d7e6ee"
        strokeWidth="34"
        fill="none"
        strokeLinecap="round"
      />

      {/* parks (organic blobs) */}
      <path
        d="M 320 380 C 280 300, 420 260, 500 300 C 580 340, 560 460, 470 490 C 380 520, 350 460, 320 380 Z"
        fill="#dcebd4"
      />
      <path
        d="M 1220 820 C 1180 740, 1300 690, 1400 730 C 1500 770, 1490 890, 1380 920 C 1280 950, 1250 890, 1220 820 Z"
        fill="#dcebd4"
      />
      <ellipse cx="700" cy="930" rx="150" ry="90" fill="#dcebd4" opacity="0.85" />
      <ellipse cx="1450" cy="180" rx="120" ry="75" fill="#dcebd4" opacity="0.7" />
      {/* park paths */}
      <path d="M 340 420 C 400 390, 460 400, 500 430" stroke="#f4f6f1" strokeWidth="6" fill="none" />
      <path d="M 1260 830 C 1330 800, 1400 810, 1450 850" stroke="#f4f6f1" strokeWidth="6" fill="none" />

      {/* ring road */}
      <rect x="330" y="250" width="1040" height="620" rx="180" fill="none" stroke="#ffffff" strokeWidth="18" />

      {/* main avenues */}
      <line x1="0" y1="440" x2="1700" y2="400" stroke="#ffffff" strokeWidth="14" />
      <line x1="0" y1="700" x2="1700" y2="740" stroke="#ffffff" strokeWidth="14" />
      <line x1="480" y1="0" x2="520" y2="1100" stroke="#ffffff" strokeWidth="14" />
      <line x1="1240" y1="0" x2="1200" y2="1100" stroke="#ffffff" strokeWidth="14" />
      <line x1="120" y1="1020" x2="1600" y2="140" stroke="#ffffff" strokeWidth="16" />

      {/* secondary streets (slightly irregular) */}
      {[
        "M 260 0 L 300 1100",
        "M 700 0 L 690 1100",
        "M 900 0 L 930 1100",
        "M 1440 0 L 1430 1100",
        "M 0 240 L 1700 220",
        "M 0 560 L 1700 590",
        "M 0 860 L 1700 900",
      ].map((d) => (
        <path key={d} d={d} stroke="#ffffff" strokeWidth="8" fill="none" />
      ))}
      {/* small side streets */}
      {[
        "M 380 300 L 740 290",
        "M 560 440 L 560 720",
        "M 1240 480 L 1560 470",
        "M 820 560 L 820 860",
        "M 200 700 L 460 690",
        "M 1300 640 L 1300 900",
        "M 640 120 L 900 130",
      ].map((d) => (
        <path key={d} d={d} stroke="#ffffff" strokeWidth="5" fill="none" opacity="0.9" />
      ))}

      {/* bridges over the river */}
      <line x1="1005" y1="435" x2="1075" y2="430" stroke="#ffffff" strokeWidth="12" />
      <line x1="985" y1="705" x2="1060" y2="712" stroke="#ffffff" strokeWidth="12" />
      <line x1="560" y1="610" x2="640" y2="650" stroke="#ffffff" strokeWidth="10" />

      {/* railway */}
      <path
        d="M 60 160 C 480 200, 980 240, 1660 300"
        stroke="#c9cdc6"
        strokeWidth="7"
        strokeDasharray="16 10"
        fill="none"
      />
      <rect x="760" y="212" width="64" height="26" rx="9" fill="#ffffff" stroke="#d9ddd6" />
      <text x="792" y="230" textAnchor="middle" fill="#9aa39a" fontSize="12">HBF</text>

      {/* plaza */}
      <circle cx="860" cy="420" r="34" fill="#ffffff" />
      <circle cx="860" cy="420" r="14" fill="#e9ece5" />

      {/* labels */}
      <text x="430" y="230" fill="#9aa39a" fontSize="15" letterSpacing="2">ALTSTADT</text>
      <text x="760" y="600" fill="#9aa39a" fontSize="15" letterSpacing="2">UNIVIERTEL</text>
      <text x="1240" y="290" fill="#9aa39a" fontSize="15" letterSpacing="2">GARTENSTADT</text>
      <text x="230" y="720" fill="#9aa39a" fontSize="15" letterSpacing="2">EPPENDORF</text>
      <text x="1330" y="640" fill="#9aa39a" fontSize="15" letterSpacing="2">KIEZ</text>
      <text x="360" y="345" fill="#a8b8a0" fontSize="13" letterSpacing="2">STADTPARK</text>
      <text x="1265" y="790" fill="#a8b8a0" fontSize="13" letterSpacing="2">VOLKSPARK</text>
      <text x="1035" y="105" fill="#b3c6d1" fontSize="13" letterSpacing="2">ALSTER</text>
      <text x="1042" y="330" fill="#b3c6d1" fontSize="13" letterSpacing="2" transform="rotate(78 1042 330)">ELBE</text>
    </svg>
  );
}

type View = "karte" | "uebersicht";

export default function Einheiten() {
  const { openChat } = useArbioChat();
  const [view, setView] = useState<View>("karte");
  const [popup, setPopup] = useState<Popup | null>(null);
  const [active, setActive] = useState(1);
  const [pan, setPan] = useState({ x: -220, y: -160 });
  const [zoom, setZoom] = useState(1);
  const drag = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null);
  const moved = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const cDrag = useRef<{ startX: number; scroll: number } | null>(null);

  useEffect(() => {
    trackRef.current
      ?.querySelector(`[data-card="${active}"]`)
      ?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active, view]);

  const openPopup = (unit: Unit, e: { clientX: number; clientY: number }) => {
    if (moved.current) return;
    setPopup({ unit, x: e.clientX, y: e.clientY });
  };

  const clampPan = (x: number, y: number) => ({
    x: Math.max(-560, Math.min(60, x)),
    y: Math.max(-700, Math.min(60, y)),
  });

  const snapCarousel = () => {
    const el = trackRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let best = active;
    let bestDist = Infinity;
    el.querySelectorAll<HTMLElement>("[data-card]").forEach((c) => {
      const cc = c.offsetLeft + c.offsetWidth / 2;
      const d = Math.abs(cc - center);
      if (d < bestDist) {
        bestDist = d;
        best = Number(c.dataset.card);
      }
    });
    if (best === active) {
      el.querySelector(`[data-card="${best}"]`)?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    } else {
      setActive(best);
    }
  };

  return (
    <div className="relative min-h-screen px-8 py-6 pb-32">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-[22px]">Portfolio</h1>
          <p className="text-[15px] text-muted mt-1">
            Deine Einheiten auf der Karte und im Überblick
          </p>
        </div>
        {/* View toggle — right margin keeps clear of the fixed notification bell */}
        <div className="flex items-center border border-line rounded-full p-1 bg-white mr-14">
          <button
            onClick={() => setView("karte")}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-[15px] ${
              view === "karte" ? "bg-[#2a2a2a] text-white" : "text-muted hover:text-foreground"
            }`}
          >
            <MapIcon size={15} />
            Karte
          </button>
          <button
            onClick={() => setView("uebersicht")}
            className={`flex items-center gap-2 rounded-full px-5 py-2 text-[15px] ${
              view === "uebersicht"
                ? "bg-[#2a2a2a] text-white"
                : "text-muted hover:text-foreground"
            }`}
          >
            <LayoutGrid size={15} />
            Übersicht
          </button>
        </div>
      </div>

      {view === "karte" ? (
        /* ---------------- Map view ---------------- */
        <div className="bg-white border border-line rounded-[24px] p-2 mt-6 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <div
            className="relative h-[560px] rounded-[18px] overflow-hidden cursor-grab active:cursor-grabbing select-none"
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
                width: 1700,
                height: 1100,
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: "center",
              }}
            >
              <CityMapSvg />

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
      ) : (
        /* ---------------- Carousel view ---------------- */
        <div className="mt-8">
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
            className="flex items-center gap-6 mt-8 min-h-[440px] overflow-x-auto px-[calc(50%-170px)] cursor-grab active:cursor-grabbing select-none [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none" }}
            onPointerDown={(e) => {
              cDrag.current = { startX: e.clientX, scroll: trackRef.current?.scrollLeft ?? 0 };
              moved.current = false;
            }}
            onPointerMove={(e) => {
              if (!cDrag.current || !trackRef.current) return;
              const dx = e.clientX - cDrag.current.startX;
              if (Math.abs(dx) > 6) moved.current = true;
              trackRef.current.scrollLeft = cDrag.current.scroll - dx;
            }}
            onPointerUp={() => {
              const wasDrag = moved.current;
              cDrag.current = null;
              if (wasDrag) snapCarousel();
              setTimeout(() => (moved.current = false), 0);
            }}
            onPointerLeave={() => {
              const wasDrag = moved.current;
              cDrag.current = null;
              if (wasDrag) snapCarousel();
              setTimeout(() => (moved.current = false), 0);
            }}
          >
            {units.map((u, i) => {
              const isActive = i === active;
              return (
                <button
                  key={u.key}
                  data-card={i}
                  onClick={(e) => {
                    if (moved.current) return;
                    if (isActive) openPopup(u, e);
                    else setActive(i);
                  }}
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
      )}

      {popup && (
        <UnitPopup
          p={popup}
          onClose={() => setPopup(null)}
          onMore={(u) => {
            setPopup(null);
            openChat(insightSeed(u));
          }}
        />
      )}

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
