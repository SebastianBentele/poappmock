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
import { useArbioChat, waterDamageApprovalSeed, type Msg, type Tr } from "@/components/arbio-chat";
import { useLang } from "@/components/lang";

/* ---------- data builders ---------- */

const buildSentiments = (t: Tr) => [
  { label: t("Sauberkeit", "Cleanliness"), pct: "94%", width: "94%" },
  { label: t("Check-in", "Check-in"), pct: "91%", width: "91%" },
  { label: t("Lage", "Location"), pct: "96%", width: "96%" },
  { label: t("Ausstattung", "Amenities"), pct: "82%", width: "82%" },
  { label: t("WLAN", "WiFi"), pct: "68%", width: "68%" },
];

const buildReviews = (t: Tr) => [
  {
    platform: "Airbnb",
    score: "5,0",
    text: t("Super unkomplizierter Check-in, die Wohnung war makellos sauber. Jederzeit wieder!", "Super smooth check-in, the flat was spotless. Would stay again anytime!"),
    unit: t("Altstadt Apartment · vor 2 Tagen", "Altstadt Apartment · 2 days ago"),
  },
  {
    platform: "Airbnb",
    score: "5,0",
    text: t("Traumhafte Altbauwohnung — stilvoll eingerichtet und perfekt organisiert.", "Gorgeous period flat — stylishly furnished and perfectly organized."),
    unit: t("Altbau Suite Eppendorf · vor 3 Tagen", "Altbau Suite Eppendorf · 3 days ago"),
  },
  {
    platform: "Booking.com",
    score: "8,0",
    text: t("Tolle Lage, aber das WLAN war am zweiten Abend instabil.", "Great location, but the WiFi was unstable on the second evening."),
    unit: t("Garten Apartment · vor 5 Tagen", "Garten Apartment · 5 days ago"),
  },
];

const buildAllReviews = (t: Tr) => [
  ...buildReviews(t),
  {
    platform: "Booking.com",
    score: "9,5",
    text: t("Perfekte Kommunikation, alle Fragen wurden in Minuten beantwortet. Sehr professionell.", "Perfect communication, all questions answered within minutes. Very professional."),
    unit: t("Kiez Apartment Prenzlauer Berg · vor 6 Tagen", "Kiez Apartment Prenzlauer Berg · 6 days ago"),
  },
  {
    platform: "Airbnb",
    score: "4,5",
    text: t("Schöne Wohnung in ruhiger Lage. Die Kaffeemaschine könnte ein Upgrade vertragen.", "Nice flat in a quiet spot. The coffee machine could use an upgrade."),
    unit: t("Altbau Suite Eppendorf · vor 1 Woche", "Altbau Suite Eppendorf · 1 week ago"),
  },
  {
    platform: "Airbnb",
    score: "5,0",
    text: t("Der Garten ist ein Traum — perfekt für Familien. Check-in komplett reibungslos.", "The garden is a dream — perfect for families. Check-in completely smooth."),
    unit: t("Garten Apartment · vor 1 Woche", "Garten Apartment · 1 week ago"),
  },
  {
    platform: "Booking.com",
    score: "9,0",
    text: t("Sehr sauber, top ausgestattet, tolle Betten. Gerne wieder in Hamburg!", "Very clean, well equipped, great beds. Happy to return to Hamburg!"),
    unit: t("Altstadt Apartment · vor 2 Wochen", "Altstadt Apartment · 2 weeks ago"),
  },
  {
    platform: "Airbnb",
    score: "4,5",
    text: t("Kompaktes, durchdachtes Studio — ideal für einen Städtetrip. Parken war etwas knifflig.", "Compact, well-thought-out studio — ideal for a city trip. Parking was a bit tricky."),
    unit: t("Studio Universität · vor 2 Wochen", "Studio Universität · 2 weeks ago"),
  },
  {
    platform: "Airbnb",
    score: "5,0",
    text: t("Stilvoll, hell, ruhig. Die Empfehlungen fürs Viertel im Gäste-Guide waren Gold wert.", "Stylish, bright, quiet. The neighborhood tips in the guest guide were worth their weight in gold."),
    unit: t("Kiez Apartment Prenzlauer Berg · vor 3 Wochen", "Kiez Apartment Prenzlauer Berg · 3 weeks ago"),
  },
  {
    platform: "Booking.com",
    score: "8,5",
    text: t("Gutes Preis-Leistungs-Verhältnis, schnelle Antworten. Late-Checkout hat super geklappt.", "Good value for money, fast replies. Late check-out worked out great."),
    unit: t("Studio Universität · vor 3 Wochen", "Studio Universität · 3 weeks ago"),
  },
  {
    platform: "Airbnb",
    score: "5,0",
    text: t("Eine der besten Ferienwohnungen, in denen wir je waren. Alles durchdacht bis ins Detail.", "One of the best holiday flats we've ever stayed in. Everything thought through to the detail."),
    unit: t("Altstadt Apartment · vor 4 Wochen", "Altstadt Apartment · 4 weeks ago"),
  },
  {
    platform: "Booking.com",
    score: "9,2",
    text: t("Blitzsauber und zentral. Die Anreise-Infos kamen genau zum richtigen Zeitpunkt.", "Spotless and central. The arrival info came at exactly the right time."),
    unit: t("Garten Apartment · vor 1 Monat", "Garten Apartment · 1 month ago"),
  },
];

const buildBlockedSeed = (t: Tr): Msg[] => [
  { kind: "user", text: t("Warum ist das Studio Universität blockiert?", "Why is Studio Universität blocked?") },
  {
    kind: "bot",
    text: t(
      "Das Studio Universität ist seit dem 04.07. blockiert: Ein Wasserschaden im Bad (undichte Silikonfuge an der Dusche) muss getrocknet und repariert werden. Die Freigabe ist für den 11.07. geplant — der Zeitraum ist auf allen Kanälen gesperrt, damit keine Gäste betroffen sind.",
      "Studio Universität has been blocked since Jul 4: water damage in the bathroom (a leaking silicone joint at the shower) needs drying and repair. Release is planned for Jul 11 — the period is blocked on all channels so no guests are affected."
    ),
  },
  {
    kind: "timeline",
    title: t("Ticket #1038 · Wasserschaden Bad · Studio Universität", "Ticket #1038 · Water damage bathroom · Studio Universität"),
    steps: [
      { label: t("Schaden festgestellt & blockiert", "Damage identified & blocked"), meta: "04.07.", state: "done" },
      { label: t("Trocknung läuft", "Drying in progress"), meta: "05.–09.07.", state: "current" },
      { label: t("Reparatur & Endkontrolle", "Repair & final check"), meta: "10.07.", state: "pending" },
      { label: t("Einheit wieder live", "Unit live again"), meta: t("vsl. 11.07.", "est. Jul 11"), state: "pending" },
    ],
  },
  {
    kind: "bot",
    text: t(
      "Volle Transparenz: Entgangener Umsatz bisher ca. €610 (5 blockierte Nächte à ~€122). Das Team erneuert im Zuge der Reparatur direkt alle Silikonfugen im Bad — so senken wir das Risiko eines erneuten Ausfalls. Du musst nichts tun, wir halten dich auf dem Laufenden.",
      "Full transparency: lost revenue so far approx. €610 (5 blocked nights at ~€122). During the repair the team is renewing all silicone joints in the bathroom — reducing the risk of another outage. You don't need to do anything, we'll keep you posted."
    ),
  },
];

const doneTimeline = (
  t: Tr,
  id: string,
  title: string,
  unit: string,
  days: string,
  extra: string
): Msg[] => [
  {
    kind: "bot",
    text: t(
      `Ticket ${id} (${title}, ${unit}) wurde diese Woche gelöst — in ${days}. ${extra}`,
      `Ticket ${id} (${title}, ${unit}) was resolved this week — in ${days}. ${extra}`
    ),
  },
  {
    kind: "timeline",
    title: `Ticket ${id} · ${title}`,
    steps: [
      { label: t("Gemeldet", "Reported"), state: "done" },
      { label: t("Techniker vor Ort", "Technician on site"), state: "done" },
      { label: t("Erledigt", "Done"), meta: t(`in ${days}`, `in ${days}`), state: "done" },
    ],
  },
];

type BoardTicket = { id: string; title: string; unit: string; note: string; seed: Msg[] };
type Column = { key: "open" | "progress" | "done"; label: string; tickets: BoardTicket[] };

const buildBoard = (t: Tr): Column[] => [
  {
    key: "open",
    label: t("Offen", "Open"),
    tickets: [
      {
        id: "#1043",
        title: t("Spülmaschine macht Geräusche", "Dishwasher making noise"),
        unit: "Altstadt Apartment",
        note: t("seit gestern · Techniker-Termin wird vereinbart", "since yesterday · scheduling technician"),
        seed: [
          {
            kind: "bot",
            text: t(
              "Zu Ticket #1043 (Spülmaschine macht Geräusche, Altstadt Apartment): Unser Techniker war vor Ort — die Umwälzpumpe ist defekt. Das Ersatzteil ist bestellt, der Einbau ist für den 16.07. geplant.",
              "On Ticket #1043 (dishwasher making noise, Altstadt Apartment): our technician was on site — the circulation pump is faulty. The spare part is ordered, installation is planned for Jul 16."
            ),
          },
          {
            kind: "timeline",
            title: t("Ticket #1043 · Spülmaschine macht Geräusche", "Ticket #1043 · Dishwasher making noise"),
            steps: [
              { label: t("Gemeldet", "Reported"), meta: t("gestern", "yesterday"), state: "done" },
              { label: t("Techniker vor Ort", "Technician on site"), meta: t("heute", "today"), state: "done" },
              { label: t("Ersatzteil bestellt", "Spare part ordered"), meta: t("Einbau vsl. 16.07.", "install est. Jul 16"), state: "current" },
              { label: t("Erledigt", "Done"), state: "pending" },
            ],
          },
          {
            kind: "bot",
            text: t(
              "Kosten: €140 Material + Anfahrt — taucht danach als Position in deiner Juli-P&L auf. Die Maschine ist bis zum Einbau eingeschränkt nutzbar, die Gäste sind informiert.",
              "Cost: €140 material + call-out — appears as a line in your July P&L afterwards. The machine is usable with limitations until the install, guests are informed."
            ),
          },
        ],
      },
      {
        id: "#1047",
        title: t("Abfluss Küche läuft langsam ab", "Kitchen drain slow"),
        unit: "Kiez Apartment Prenzlauer Berg",
        note: t("seit heute · Diagnose eingeplant", "since today · diagnosis scheduled"),
        seed: [
          {
            kind: "bot",
            text: t(
              "Zu Ticket #1047 (Abfluss Küche läuft langsam ab, Kiez Apartment Prenzlauer Berg): Die Meldung kam heute über die Reinigungskraft. Unser Hausmeister schaut es sich beim nächsten Turnover am 12.07. an — kein Gast ist beeinträchtigt.",
              "On Ticket #1047 (kitchen drain slow, Kiez Apartment Prenzlauer Berg): reported today by the cleaner. Our caretaker will look at it during the next turnover on Jul 12 — no guest is affected."
            ),
          },
          {
            kind: "timeline",
            title: t("Ticket #1047 · Abfluss Küche", "Ticket #1047 · Kitchen drain"),
            steps: [
              { label: t("Gemeldet", "Reported"), meta: t("heute", "today"), state: "done" },
              { label: t("Diagnose", "Diagnosis"), meta: "12.07.", state: "current" },
              { label: t("Erledigt", "Done"), state: "pending" },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "progress",
    label: t("In Arbeit", "In progress"),
    tickets: [
      {
        id: "#1041",
        title: t("WLAN-Router austauschen", "Replace WiFi router"),
        unit: "Garten Apartment",
        note: t("Termin bestätigt: 14.07., 9–12 Uhr", "Appointment confirmed: Jul 14, 9–12"),
        seed: [
          {
            kind: "bot",
            text: t(
              "Zu Ticket #1041 (WLAN-Router austauschen, Garten Apartment): Der Techniker hat den Termin bestätigt — Dienstag, 14.07., zwischen 9 und 12 Uhr. Der Zugang erfolgt über die Schlüsselbox, im Zeitraum ist kein Gast eingebucht.",
              "On Ticket #1041 (replace WiFi router, Garten Apartment): the technician confirmed the appointment — Tuesday, Jul 14, between 9 and 12. Access is via the key box, no guest is booked during that window."
            ),
          },
          {
            kind: "timeline",
            title: t("Ticket #1041 · WLAN-Router austauschen", "Ticket #1041 · Replace WiFi router"),
            steps: [
              { label: t("Gemeldet", "Reported"), meta: "03.07.", state: "done" },
              { label: t("Techniker beauftragt", "Technician assigned"), meta: "04.07.", state: "done" },
              { label: t("Termin bestätigt", "Appointment confirmed"), meta: t("14.07., 9–12 Uhr", "Jul 14, 9–12"), state: "current" },
              { label: t("Erledigt", "Done"), state: "pending" },
            ],
          },
        ],
      },
      {
        id: "#1038",
        title: t("Wasserschaden Bad", "Water damage bathroom"),
        unit: "Studio Universität",
        note: t("Trocknung läuft · Freigabe vsl. 11.07.", "Drying · release est. Jul 11"),
        seed: [],
      },
      {
        id: "#1039",
        title: t("Zusatzreinigung nach Late-Checkout", "Extra cleaning after late check-out"),
        unit: "Studio Universität",
        note: t("Eingeplant: 09.07., 14 Uhr", "Scheduled: Jul 9, 2 pm"),
        seed: [
          {
            kind: "bot",
            text: t(
              "Zu Ticket #1039 (Zusatzreinigung nach Late-Checkout, Studio Universität): Die Reinigung ist für den 09.07. um 14 Uhr eingeplant — rechtzeitig vor dem nächsten Check-in um 18 Uhr. Kosten: €68, erscheint als Reinigungsposition in deiner Juli-P&L.",
              "On Ticket #1039 (extra cleaning after late check-out, Studio Universität): the cleaning is scheduled for Jul 9 at 2 pm — in time before the next check-in at 6 pm. Cost: €68, appears as a cleaning line in your July P&L."
            ),
          },
          {
            kind: "timeline",
            title: t("Ticket #1039 · Zusatzreinigung", "Ticket #1039 · Extra cleaning"),
            steps: [
              { label: t("Gemeldet", "Reported"), meta: t("gestern", "yesterday"), state: "done" },
              { label: t("Eingeplant", "Scheduled"), meta: t("09.07., 14 Uhr", "Jul 9, 2 pm"), state: "current" },
              { label: t("Erledigt", "Done"), state: "pending" },
            ],
          },
        ],
      },
    ],
  },
  {
    key: "done",
    label: t("Diese Woche gelöst", "Resolved this week"),
    tickets: [
      {
        id: "#1042",
        title: t("Heizung entlüftet", "Radiator bled"),
        unit: "Garten Apartment",
        note: t("gelöst in 1,5 Tagen", "resolved in 1.5 days"),
        seed: doneTimeline(t, "#1042", t("Heizung entlüftet", "Radiator bled"), "Garten Apartment", t("1,5 Tagen", "1.5 days"),
          t("Der Gast hatte kalte Heizkörper gemeldet — unser Hausmeister hat entlüftet und den Druck angepasst. Keine Kosten für dich.", "The guest reported cold radiators — our caretaker bled them and adjusted the pressure. No cost to you.")),
      },
      {
        id: "#1040",
        title: t("Rauchmelder-Batterie getauscht", "Smoke detector battery replaced"),
        unit: "Altstadt Apartment",
        note: t("gelöst in 0,5 Tagen", "resolved in 0.5 days"),
        seed: doneTimeline(t, "#1040", t("Rauchmelder-Batterie", "Smoke detector battery"), "Altstadt Apartment", t("0,5 Tagen", "0.5 days"),
          t("Beim Turnover aufgefallen, direkt getauscht. Kosten: €8.", "Noticed during turnover, replaced right away. Cost: €8.")),
      },
      {
        id: "#1037",
        title: t("Fenstergriff repariert", "Window handle repaired"),
        unit: "Altbau Suite Eppendorf",
        note: t("gelöst in 2 Tagen", "resolved in 2 days"),
        seed: doneTimeline(t, "#1037", t("Fenstergriff repariert", "Window handle repaired"), "Altbau Suite Eppendorf", t("2 Tagen", "2 days"),
          t("Ersatzteil bestellt und montiert. Kosten: €24 Material.", "Spare part ordered and fitted. Cost: €24 material.")),
      },
    ],
  },
];

const buildWeekRows = (t: Tr) => [
  { icon: Sparkles, text: t("12 Reinigungen", "12 cleanings"), meta: t("zuletzt heute 11:30 · Altstadt Apartment", "last today 11:30 · Altstadt Apartment") },
  { icon: Wrench, text: t("4 Tickets gelöst", "4 tickets resolved"), meta: t("Ø 1,6 Tage Lösungszeit", "avg. 1.6 days resolution time") },
  { icon: MessageCircle, text: t("19 Gästeanfragen beantwortet", "19 guest inquiries answered"), meta: t("Ø 4 Min Antwortzeit", "avg. 4 min response time") },
  { icon: Home, text: t("8 Check-ins begleitet", "8 check-ins handled"), meta: t("alle reibungslos", "all smooth") },
];

const buildWeekSummarySeed = (t: Tr): Msg[] => [
  { kind: "user", text: t("Was hat Arbio diese Woche für mich erledigt?", "What did Arbio get done for me this week?") },
  {
    kind: "bot",
    text: t(
      "Gern — hier ist deine Woche im Überblick. Insgesamt 43 erledigte Aufgaben über deine 5 Einheiten, alles ohne dein Zutun:",
      "Sure — here's your week at a glance. 43 completed tasks across your 5 units, all without any effort on your part:"
    ),
  },
  {
    kind: "bars",
    title: t("Diese Woche erledigt · 02.–08.07.", "Completed this week · Jul 2–8"),
    bars: [
      { label: t("Gäste", "Guests"), value: t("19 Anfragen", "19 inquiries"), pct: 100 },
      { label: t("Reinigung", "Cleaning"), value: t("12 Turnovers", "12 turnovers"), pct: 63 },
      { label: t("Check-ins", "Check-ins"), value: t("8 begleitet", "8 handled"), pct: 42 },
      { label: t("Tickets", "Tickets"), value: t("4 gelöst", "4 resolved"), pct: 21 },
    ],
  },
  {
    kind: "bot",
    text: t(
      "Highlights: Die Heizung im Garten Apartment war in 1,5 Tagen entlüftet, der Rauchmelder im Altstadt Apartment wurde beim Turnover direkt mit erledigt, und alle 8 Check-ins liefen ohne einen einzigen Anruf bei dir. Offen sind nur noch die Freigabe zur Duschglaswand und der Router-Termin am 14.07.",
      "Highlights: the radiator in the Garten Apartment was bled in 1.5 days, the smoke detector in the Altstadt Apartment was handled right during the turnover, and all 8 check-ins ran without a single call to you. Only open items are the shower glass approval and the router appointment on Jul 14."
    ),
  },
];

/* ---------- page ---------- */

export default function Operativ() {
  const { openChat } = useArbioChat();
  const { t } = useLang();
  const [reviewsOpen, setReviewsOpen] = useState(false);

  const sentiments = buildSentiments(t);
  const reviews = buildReviews(t);
  const allReviews = buildAllReviews(t);
  const board = buildBoard(t);
  const weekRows = buildWeekRows(t);
  const blockedSeed = buildBlockedSeed(t);
  // Studio water-damage ticket in the board reuses the full blocked seed
  board[1].tickets[1].seed = blockedSeed;

  return (
    <div className="relative min-h-screen px-8 py-6 pb-32">
      {/* Filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <FilterBar showStepper={false} />
      </div>

      {/* 1 — Needs your attention */}
      <div className="flex items-center gap-2 text-[12px] tracking-[1.5px] uppercase text-muted mb-3">
        <AlertTriangle size={12} />
        {t("Braucht deine Aufmerksamkeit", "Needs your attention")}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <button
          onClick={() => openChat(waterDamageApprovalSeed(t))}
          className="text-left bg-[#fbf6ee] border border-[#f0e2c8] rounded-[24px] p-6 hover:bg-[#f8f0e2] transition-colors"
        >
          <div className="flex items-start justify-between">
            <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#8a5a1a]">
              <BadgeEuro size={17} />
            </span>
            <span className="bg-white text-[#8a5a1a] rounded-full px-3 py-1 text-[13px]">
              {t("Freigabe offen", "Approval pending")}
            </span>
          </div>
          <div className="text-[17px] mt-4">{t("Duschglaswand-Austausch · €780", "Shower glass replacement · €780")}</div>
          <div className="text-[14px] text-muted mt-1">
            {t("Studio Universität · Ticket #1038 · externer Handwerker (Festpreis)", "Studio Universität · Ticket #1038 · external contractor (fixed price)")}
          </div>
          <div className="flex items-center gap-1.5 text-[14px] text-[#8a5a1a] mt-4">
            {t("Prüfen & freigeben", "Review & approve")}
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
              {t("Blockiert", "Blocked")}
            </span>
          </div>
          <div className="text-[17px] mt-4">{t("Studio Universität · Wasserschaden Bad", "Studio Universität · Water damage bathroom")}</div>
          <div className="text-[14px] text-muted mt-1">
            {t("Entgangener Umsatz bisher ca. €610 · Ticket #1038", "Lost revenue so far approx. €610 · Ticket #1038")}
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-[13px] mb-1.5">
              <span className="text-muted">{t("Trocknung läuft", "Drying in progress")}</span>
              <span className="text-accent-text">{t("Wieder live in 2 Tagen · vsl. 11.07.", "Live again in 2 days · est. Jul 11")}</span>
            </div>
            <div className="h-[8px] bg-white rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full" style={{ width: "60%" }} />
            </div>
          </div>
        </button>
      </div>

      {/* 2 — Ticket board */}
      <div className="bg-white border border-line rounded-[24px] p-7 mt-6 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <h3 className="text-[16px]">{t("Tickets", "Tickets")}</h3>
          <span className="flex items-center gap-1.5 text-[13px] text-muted">
            <MessageCircle size={13} />
            {t("Klick öffnet Details im Chat", "Click opens details in chat")}
          </span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mt-5">
          {board.map(({ key, label, tickets }) => (
            <div key={key} className="bg-panel rounded-[18px] p-4">
              <div className="flex items-center justify-between px-1 mb-3">
                <span
                  className={`text-[13px] tracking-[1px] uppercase ${
                    key === "done" ? "text-accent-text" : "text-muted"
                  }`}
                >
                  {label}
                </span>
                <span className="text-[13px] text-muted">{tickets.length}</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {tickets.map((tk) => (
                  <button
                    key={tk.id}
                    onClick={() => openChat(tk.seed)}
                    className={`text-left rounded-[14px] px-4 py-3.5 border transition-colors ${
                      key === "done"
                        ? "bg-[#f1f6ee] border-[#dcebd4] hover:bg-[#eaf2e5]"
                        : "bg-white border-line hover:bg-[#fbfbfa]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {key === "done" && (
                        <CheckCircle2 size={14} className="text-accent-text shrink-0" />
                      )}
                      <span className="text-[14px] leading-tight flex-1">{tk.title}</span>
                    </div>
                    <div className="text-[12px] text-muted mt-1.5">
                      {tk.id} · {tk.unit}
                    </div>
                    <div
                      className={`text-[12px] mt-1 ${
                        key === "done" ? "text-accent-text" : "text-muted"
                      }`}
                    >
                      {tk.note}
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
          <h3 className="text-[16px]">{t("Diese Woche erledigt", "Completed this week")}</h3>
          <button
            onClick={() => openChat(buildWeekSummarySeed(t))}
            className="flex items-center gap-2 border border-line rounded-full px-4 py-2 text-[14px] hover:bg-panel"
          >
            <MessageCircle size={14} className="text-muted" />
            {t("Zusammenfassung im Chat", "Summary in chat")}
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

      {/* 4 — Reviews */}
      <div className="flex items-center gap-2 text-[12px] tracking-[1.5px] uppercase text-muted mt-8 mb-3">
        <Star size={12} />
        {t("Bewertungen", "Reviews")}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.15fr] gap-4">
        <div className="bg-white border border-line rounded-[24px] p-7 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <div className="flex items-start justify-between">
            <h3 className="text-[16px]">{t("Bewertungs-Insights", "Review insights")}</h3>
            <span className="text-[13px] text-muted">{t("% positiv erwähnt", "% mentioned positively")}</span>
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
          title={t("Deine Bewertungen. Auf einen Blick.", "Your reviews. At a glance.")}
          rows={[
            {
              label: t("Ergebnis", "Result"),
              text: t(
                "4,8 ★ auf Airbnb und 9,3 auf Booking.com — deine Immobilien gehören zu den bestbewerteten ihrer Viertel.",
                "4.8 ★ on Airbnb and 9.3 on Booking.com — your properties are among the best-rated in their neighborhoods."
              ),
            },
            {
              label: t("Warum", "Why"),
              text: t(
                "Sauberkeit und Check-in werden in 9 von 10 Bewertungen positiv erwähnt — das Ergebnis von 38 Reinigungen und 8 begleiteten Check-ins allein diesen Monat.",
                "Cleanliness and check-in are mentioned positively in 9 out of 10 reviews — the result of 38 cleanings and 8 handled check-ins this month alone."
              ),
            },
            {
              label: t("Arbio kümmert sich", "Arbio takes care of it"),
              text: t(
                "Das WLAN-Thema aus zwei Bewertungen ist adressiert: Der Routertausch im Garten Apartment ist für den 14.07. terminiert.",
                "The WiFi topic from two reviews is addressed: the router swap in the Garten Apartment is scheduled for Jul 14."
              ),
            },
          ]}
          chatHint={t("Details im Chat fragen", "Ask for details in chat")}
        />
      </div>

      {/* Latest reviews — full width */}
      <div className="bg-white border border-line rounded-[24px] p-7 mt-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-between">
          <h3 className="text-[16px]">{t("Neueste Bewertungen", "Latest reviews")}</h3>
          <button
            onClick={() => setReviewsOpen(true)}
            className="flex items-center gap-2 border border-line rounded-full px-4 py-2 text-[14px] hover:bg-panel"
          >
            <Star size={14} className="text-muted" />
            {t("Alle Bewertungen", "All reviews")}
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
                <div className="text-[16px]">{t("Alle Bewertungen", "All reviews")}</div>
                <div className="text-[13px] text-muted mt-0.5">
                  {allReviews.length} {t("Bewertungen · Ø 4,8 ★ Airbnb · 9,3 Booking.com", "reviews · avg. 4.8 ★ Airbnb · 9.3 Booking.com")}
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
          placeholder={t("Frag alles über deinen Betrieb...", "Ask anything about your operations...")}
          className="w-full max-w-[620px] pointer-events-auto"
        />
      </div>
    </div>
  );
}
