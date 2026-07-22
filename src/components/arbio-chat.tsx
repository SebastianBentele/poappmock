"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useLang, LangToggle } from "@/components/lang";
import {
  X,
  CheckCircle2,
  Ticket,
  Mic,
  ArrowUp,
  Bell,
  Wrench,
  Banknote,
  Check,
  Image as ImageIcon,
  BadgeEuro,
  Phone,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

export type Msg =
  | { kind: "user"; text: string }
  | { kind: "bot"; text: string }
  | {
      kind: "draft";
      title: string;
      unit: string;
      prio: string;
      status: "pending" | "approved" | "discarded";
    }
  | { kind: "confirmed"; title: string; number: string }
  | {
      kind: "timeline";
      title: string;
      steps: { label: string; meta?: string; state: "done" | "current" | "pending" }[];
    }
  | {
      kind: "approval";
      title: string;
      unit: string;
      report: string;
      photos: number;
      cost: string;
      status: "pending" | "approved" | "declined";
      approveText?: string;
      declineText?: string;
    }
  | { kind: "kamcall"; slots: string[]; chosen?: string }
  | {
      kind: "unitcard";
      image: string;
      name: string;
      city: string;
      status: "live" | "blocked";
      blockedNote?: string;
      kpis: { label: string; value: string }[];
      recommendations?: { title: string; price: string; note: string }[];
      tickets?: { id: string; title: string; status: string }[];
    }
  | {
      kind: "bars";
      title: string;
      bars: { label: string; value: string; pct: number }[];
    }
  | { kind: "chips"; options: { label: string; answer: Msg[] }[] };

export type Tr = (de: string, en: string) => string;

const UNIT_NAMES = [
  "Altstadt Apartment",
  "Studio Universität",
  "Garten Apartment",
  "Altbau Suite Eppendorf",
  "Kiez Apartment Prenzlauer Berg",
];

export const requestIntroSeed = (t: Tr): Msg[] => [
  {
    kind: "bot",
    text: t(
      "Hi Sebastian! Wähl unten Melden oder Anfragen — ich führe dich Schritt für Schritt durch. Für komplexe Themen oder Beschwerden buch direkt einen Termin mit deinem KAM, oder beschreib dein Anliegen einfach frei.",
      "Hi Sebastian! Pick Report or Request below — I'll guide you step by step. For complex topics or complaints, book a call with your KAM directly, or just describe your request freely."
    ),
  },
];

export function costExplainSeed(label: string, t: Tr): Msg[] {
  const seeds: Record<string, Msg[]> = {
    "OTA-Provision": [
      { kind: "user", text: t("Erkläre mir die Position „OTA-Provision“ (Juli: –€5.407)", "Explain the “OTA commission” line item (July: –€5,407)") },
      {
        kind: "bot",
        text: t(
          "Gerne! Die OTA-Provision ist die Vermittlungsgebühr der Buchungsplattformen — im Juli –€5.407, das sind 13,0% vom Bruttoumsatz. Volle Transparenz: Booking.com –€4.421 (15% auf €29.475 aus 18 Buchungen), Airbnb –€986 (14% auf €7.040 aus 7 Buchungen). Deine 3 Direktbuchungen (€4.936) sind provisionsfrei — Arbio steuert deinen Kanal-Mix laufend so aus, dass unterm Strich am meisten für dich übrig bleibt. Die Provision wird automatisch vor der Auszahlung einbehalten, du musst nichts tun.",
          "Sure! The OTA commission is the booking platforms' intermediary fee — in July –€5,407, i.e. 13.0% of gross revenue. Full transparency: Booking.com –€4,421 (15% on €29,475 from 18 bookings), Airbnb –€986 (14% on €7,040 from 7 bookings). Your 3 direct bookings (€4,936) are commission-free — Arbio continuously steers your channel mix so the most is left for you. The commission is withheld automatically before payout, you don't need to do anything."
        ),
      },
    ],
    Umsatzsteuer: [
      { kind: "user", text: t("Erkläre mir die Position „Umsatzsteuer“ (Juli: –€2.712)", "Explain the “VAT” line item (July: –€2,712)") },
      {
        kind: "bot",
        text: t(
          "Die Umsatzsteuer-Position fasst USt. und Beherbergungssteuer zusammen, die wir aus deinem Bruttoumsatz abführen — im Juli –€2.712 auf €41.451 GBV. Sie steigt proportional zum Umsatz, daher der Anstieg ggü. Juni (–€1.869). Wir führen sie direkt ab und weisen sie in der Abrechnung aus — für deinen Steuerberater findest du die Details im Owner Statement unter Finanzen → Auszahlungen.",
          "The VAT line combines value-added tax and accommodation tax that we remit from your gross revenue — in July –€2,712 on €41,451 GBV. It scales with revenue, hence the increase vs. June (–€1,869). We remit it directly and itemize it in the statement — for your tax advisor you'll find the details in the Owner Statement under Finance → Payouts."
        ),
      },
    ],
    "Reinigung · Test": [
      { kind: "user", text: t("Erkläre mir die Position „Reinigung · Test“ (Juli: –€221)", "Explain the “Cleaning · Test” line item (July: –€221)") },
      {
        kind: "bot",
        text: t(
          "Die –€221 sind Reinigungskosten, die im Juli erstmals als eigene Position in deiner P&L auftauchen (daher der Zusatz „Test“ — wir stellen die Kostenerfassung gerade um). Enthalten: 2 Zusatzreinigungen nach Late-Checkout (Studio Universität, je €68) und eine Grundreinigung im Garten Apartment (€85). Reguläre Wechselreinigungen zahlen die Gäste über die Reinigungsgebühr — sie tauchen hier nicht auf. Hinweis: Bei deinem Buchungsvolumen ist der Betrag ungewöhnlich niedrig; wir prüfen gerade, ob alle Juli-Belege schon erfasst sind.",
          "The –€221 are cleaning costs that appear as their own P&L line for the first time in July (hence the “Test” suffix — we're currently rolling out cost capture). Included: 2 extra cleanings after late check-out (Studio Universität, €68 each) and one deep clean in the Garten Apartment (€85). Regular turnover cleanings are paid by guests via the cleaning fee — they don't show here. Note: for your booking volume the amount is unusually low; we're checking whether all July receipts are captured."
        ),
      },
    ],
    "Bruttoumsatz (GBV)": [
      { kind: "user", text: t("Erkläre mir die Position „Bruttoumsatz (GBV)“ (Juli: €41.451)", "Explain the “Gross Booking Value (GBV)” line item (July: €41,451)") },
      {
        kind: "bot",
        text: t(
          "Der Bruttoumsatz (Gross Booking Value) ist die Summe aller Gästezahlungen für Aufenthalte im Juli — €41.451 aus 28 Buchungen und 172 belegten Nächten, über alle Kanäle (Booking.com, Airbnb, Direct). Er ist die Ausgangsbasis der P&L: Davon gehen Umsatzsteuer, OTA-Provision und Kosten ab, bis dein operativer Gewinn von €33.111 übrig bleibt. Wichtig: Der GBV ist nicht dein Auszahlungsbetrag — der entspricht dem Nettoumsatz abzüglich Kosten.",
          "The Gross Booking Value is the sum of all guest payments for July stays — €41,451 from 28 bookings and 172 booked nights, across all channels (Booking.com, Airbnb, Direct). It's the starting point of the P&L: VAT, OTA commission and costs come off it until your operating profit of €33,111 remains. Important: GBV is not your payout amount — that equals net revenue minus costs."
        ),
      },
    ],
    "Miete / Finanzierung": [
      { kind: "user", text: t("Erkläre mir die Position „Miete / Finanzierung“ (–€2.100/Monat)", "Explain the “Rent / financing” line item (–€2,100/month)") },
      {
        kind: "bot",
        text: t(
          "Das ist eine von dir gepflegte Kostenposition: „Kredit Altstadt Apartment“, €2.100 pro Monat, aktiv seit 01.01.2026. Sie stammt nicht aus der Arbio-Abrechnung, sondern aus deinen eigenen Angaben unter Finanzen → Kosten — dort kannst du sie jederzeit anpassen oder pro Einheit aufteilen. Sie fließt in deinen echten Netto-Gewinn ein, damit die P&L dein komplettes Investment abbildet, nicht nur die Vermietungsseite.",
          "This is a cost item you maintain yourself: “Loan Altstadt Apartment”, €2,100 per month, active since 01/01/2026. It doesn't come from the Arbio statement but from your own entries under Finance → Costs — where you can adjust it anytime or split it per unit. It feeds into your true net profit so the P&L reflects your complete investment, not just the rental side."
        ),
      },
    ],
    Versicherung: [
      { kind: "user", text: t("Erkläre mir die Position „Versicherung“ (–€245/Monat)", "Explain the “Insurance” line item (–€245/month)") },
      {
        kind: "bot",
        text: t(
          "Deine Gebäudeversicherung mit €245 pro Monat — von dir unter Finanzen → Kosten gepflegt und auf alle Einheiten angewendet. Tipp: Wenn einzelne Einheiten unterschiedlich versichert sind, kannst du im Kosten-Tab pro Einheit abweichende Werte hinterlegen.",
          "Your building insurance at €245 per month — maintained by you under Finance → Costs and applied across all units. Tip: if individual units are insured differently, you can set per-unit values in the Costs tab."
        ),
      },
    ],
    "Nebenkosten & Internet": [
      { kind: "user", text: t("Erkläre mir die Position „Nebenkosten & Internet“ (–€290/Monat)", "Explain the “Utilities & internet” line item (–€290/month)") },
      {
        kind: "bot",
        text: t(
          "Diese Position fasst zwei von dir gepflegte Kosten zusammen: Strom & Gas Abschlag (€200/Monat) und Glasfaser für 3 Einheiten (€90/Monat). Beide findest du unter Finanzen → Kosten und kannst sie dort jederzeit anpassen — sie fließen automatisch in deinen echten Netto-Gewinn ein.",
          "This line combines two costs you maintain: electricity & gas prepayment (€200/month) and fiber internet for 3 units (€90/month). You'll find both under Finance → Costs and can adjust them anytime — they feed automatically into your true net profit."
        ),
      },
    ],
  };
  return (
    seeds[label] ?? [
      { kind: "user", text: t(`Erkläre mir die Position „${label}“`, `Explain the “${label}” line item`) },
      {
        kind: "bot",
        text: t(
          `Zu „${label}“ habe ich folgende Informationen: Die Position stammt aus deiner Juli-Abrechnung. Frag mich gern nach Details zu einzelnen Belegen.`,
          `On “${label}” I have the following: the line item comes from your July statement. Feel free to ask me for details on individual receipts.`
        ),
      },
    ]
  );
}

type Notification = {
  id: string;
  icon: "ticket" | "payout" | "approval";
  title: string;
  text: string;
  time: string;
  seed: Msg[];
};

export const waterDamageApprovalSeed = (t: Tr): Msg[] => [
  {
    kind: "bot",
    text: t(
      "Beim Wasserschaden im Studio Universität (Ticket #1038) ist eine zusätzliche Reparatur nötig: Die Duschglaswand ist gerissen und muss von einem externen Handwerker getauscht werden. Wir haben ein Angebot eingeholt und brauchen kurz deine Freigabe.",
      "The water damage in Studio Universität (Ticket #1038) requires an additional repair: the shower glass panel has cracked and needs to be replaced by an external contractor. We've obtained a quote and just need your approval."
    ),
  },
  {
    kind: "approval",
    title: t("Duschglaswand-Austausch (externer Handwerker)", "Shower glass panel replacement (external contractor)"),
    unit: "Studio Universität · Ticket #1038",
    report: t(
      "Bei der Trocknung entdeckt: Die Glasabtrennung der Dusche ist gesprungen (Folgeschaden). Austausch inkl. Montage durch Glaserei Berger. Termin wäre der 10.07., damit die Einheit planmäßig am 11.07. wieder live geht.",
      "Discovered during drying: the shower glass partition has cracked (consequential damage). Replacement incl. installation by Glaserei Berger. Appointment would be July 10 so the unit goes live again on schedule on July 11."
    ),
    photos: 2,
    cost: t("€780 (Festpreis inkl. Material & Montage)", "€780 (fixed price incl. material & installation)"),
    status: "pending",
  },
];

const buildNotifications = (t: Tr): Notification[] => [
  {
    id: "n4",
    icon: "approval",
    title: t("Kostenfreigabe · Wasserschaden", "Cost approval · water damage"),
    text: t("Externer Handwerker · €780 — deine Freigabe nötig", "External contractor · €780 — your approval needed"),
    time: t("vor 1 Std", "1 hr ago"),
    seed: waterDamageApprovalSeed(t),
  },
  {
    id: "n1",
    icon: "ticket",
    title: t("Ticket #1041 · WLAN-Router", "Ticket #1041 · WiFi router"),
    text: t("Techniker bestätigt für Di, 14.07., 9–12 Uhr", "Technician confirmed for Tue, Jul 14, 9–12"),
    time: t("vor 2 Std", "2 hrs ago"),
    seed: [
      {
        kind: "bot",
        text: t(
          "Kurz zu deiner Benachrichtigung: Für Ticket #1041 (WLAN-Router austauschen, Garten Apartment) hat der Techniker den Termin bestätigt — Dienstag, 14.07., zwischen 9 und 12 Uhr.",
          "Quick note on your notification: for Ticket #1041 (replace WiFi router, Garten Apartment) the technician has confirmed the appointment — Tuesday, Jul 14, between 9 and 12."
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
      {
        kind: "bot",
        text: t(
          "Du musst nichts weiter tun — der Zugang erfolgt über die Schlüsselbox, im Zeitraum ist kein Gast eingebucht. Soll ich dir den Termin in den Kalender eintragen?",
          "You don't need to do anything further — access is via the key box, and no guest is booked during that window. Shall I add the appointment to your calendar?"
        ),
      },
    ],
  },
  {
    id: "n2",
    icon: "ticket",
    title: t("Ticket #1043 · Spülmaschine", "Ticket #1043 · Dishwasher"),
    text: t("Ersatzteil bestellt — Einbau vsl. 16.07.", "Spare part ordered — install est. Jul 16"),
    time: t("vor 5 Std", "5 hrs ago"),
    seed: [
      {
        kind: "bot",
        text: t(
          "Update zu Ticket #1043 (Spülmaschine macht Geräusche, Altstadt Apartment): Unser Techniker war heute vor Ort — die Umwälzpumpe ist defekt. Das Ersatzteil ist bestellt, der Einbau ist für den 16.07. geplant.",
          "Update on Ticket #1043 (dishwasher making noise, Altstadt Apartment): our technician was on site today — the circulation pump is faulty. The spare part is ordered, installation is planned for July 16."
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
          "Kosten: €140 Material + Anfahrt, taucht danach als Position in deiner Juli-P&L auf. Die Maschine ist bis zum Einbau eingeschränkt nutzbar — die Gäste sind informiert.",
          "Cost: €140 material + call-out, will appear as a line in your July P&L afterwards. The machine is usable with limitations until the install — guests are informed."
        ),
      },
    ],
  },
  {
    id: "n3",
    icon: "payout",
    title: t("Auszahlung Juni überwiesen", "June payout transferred"),
    text: t("€34.900 unterwegs — Eingang vsl. 07.07.", "€34,900 on the way — arrival est. Jul 7"),
    time: t("gestern", "yesterday"),
    seed: [
      {
        kind: "bot",
        text: t(
          "Deine Juni-Auszahlung über €34.900 wurde gestern überwiesen. Ablauf: Abrechnung erstellt am 01.07., freigegeben am 03.07., überwiesen am 05.07. — der Eingang auf deinem Konto ist voraussichtlich am 07.07. (SEPA, 1–2 Bankarbeitstage).",
          "Your June payout of €34,900 was transferred yesterday. Flow: statement created Jul 1, released Jul 3, transferred Jul 5 — arrival in your account is expected on Jul 7 (SEPA, 1–2 banking days)."
        ),
      },
      {
        kind: "timeline",
        title: t("Auszahlung Juni 2026 · €34.900", "Payout June 2026 · €34,900"),
        steps: [
          { label: t("Abrechnung erstellt", "Statement created"), meta: "01.07.", state: "done" },
          { label: t("Freigegeben", "Released"), meta: "03.07.", state: "done" },
          { label: t("Überwiesen", "Transferred"), meta: "05.07.", state: "done" },
          { label: t("Eingang auf deinem Konto", "Arrival in your account"), meta: t("vsl. 07.07.", "est. Jul 7"), state: "current" },
        ],
      },
      {
        kind: "bot",
        text: t(
          "Das zugehörige Owner Statement liegt unter Finanzen → Auszahlungen bereit. Sag Bescheid, falls der Betrag bis 08.07. nicht angekommen ist.",
          "The corresponding Owner Statement is ready under Finance → Payouts. Let me know if the amount hasn't arrived by Jul 8."
        ),
      },
    ],
  },
];

const draftFor = (text: string) => ({
  kind: "draft" as const,
  title: text.length > 60 ? text.slice(0, 57) + "..." : text,
  unit: "Altstadt Apartment",
  prio: "Mittel",
  status: "pending" as const,
});

const ChatCtx = createContext<{ openChat: (seed: Msg[]) => void }>({
  openChat: () => {},
});

export function useArbioChat() {
  return useContext(ChatCtx);
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);

  const notifications = buildNotifications(t);
  const unread = notifications.filter((n) => !readIds.includes(n.id)).length;

  const openChat = (seed: Msg[]) => {
    setMessages(seed);
    setInput("");
    setNotifOpen(false);
    setOpen(true);
  };

  const openNotification = (n: Notification) => {
    setReadIds((r) => (r.includes(n.id) ? r : [...r, n.id]));
    openChat(n.seed);
  };

  const submitRequest = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [
      ...m,
      { kind: "user", text },
      { kind: "bot", text: t("Gerne! Ich habe folgendes Ticket vorbereitet — bitte bestätige kurz:", "Sure! I've prepared the following ticket — please confirm:") },
      draftFor(text),
    ]);
    setInput("");
  };

  // Guided flows: type → unit → ticket draft to confirm
  const startGuided = (mode: "melden" | "anfragen") => {
    const types =
      mode === "melden"
        ? [t("Schaden", "Damage"), t("Sicherheitsvorfall", "Security incident"), t("Sonstiger Vorfall", "Other incident")]
        : [t("Reparatur", "Repair"), t("Reinigung", "Cleaning"), t("Ausstattung ändern", "Change amenities")];
    const draftTitle = (typ: string) =>
      mode === "melden"
        ? t(`${typ} melden`, `Report ${typ.toLowerCase()}`)
        : typ === t("Ausstattung ändern", "Change amenities")
          ? typ
          : t(`${typ} anfragen`, `Request ${typ.toLowerCase()}`);
    setMessages((m) => [
      ...m,
      { kind: "user", text: mode === "melden" ? t("Ich möchte etwas melden.", "I'd like to report something.") : t("Ich möchte etwas anfragen.", "I'd like to make a request.") },
      {
        kind: "bot",
        text:
          mode === "melden"
            ? t("Alles klar — was möchtest du melden?", "Got it — what would you like to report?")
            : t("Gerne — was brauchst du?", "Sure — what do you need?"),
      },
      {
        kind: "chips",
        options: types.map((typ) => ({
          label: typ,
          answer: [
            { kind: "bot", text: t(`${typ} — für welche Einheit?`, `${typ} — for which unit?`) },
            {
              kind: "chips",
              options: UNIT_NAMES.map((u) => ({
                label: u,
                answer: [
                  {
                    kind: "bot",
                    text: t("Danke! Ich habe alles vorbereitet — bitte bestätige kurz:", "Thanks! I've prepared everything — please confirm:"),
                  },
                  { kind: "draft", title: draftTitle(typ), unit: u, prio: t("Mittel", "Medium"), status: "pending" },
                ],
              })),
            },
          ],
        })),
      },
    ]);
  };

  const bookKamCall = () => {
    setMessages((m) => [
      ...m,
      { kind: "user", text: t("Ich möchte einen Termin mit meinem KAM buchen.", "I'd like to book a call with my KAM.") },
      {
        kind: "bot",
        text: t(
          "Sehr gern — dein persönlicher Key Account Manager ist Jovana. Wähl einen der nächsten freien Termine, dann schicke ich dir die Kalendereinladung.",
          "Gladly — your personal Key Account Manager is Jovana. Pick one of the next available slots and I'll send you the calendar invite."
        ),
      },
      { kind: "kamcall", slots: [t("Mi 09.07. · 10:00", "Wed Jul 9 · 10:00"), t("Do 10.07. · 14:30", "Thu Jul 10 · 14:30"), t("Fr 11.07. · 09:00", "Fri Jul 11 · 09:00")] },
    ]);
  };

  const chooseSlot = (idx: number, slot: string) => {
    setMessages((m) => {
      const next = m.map((msg, i) =>
        i === idx && msg.kind === "kamcall" ? { ...msg, chosen: slot } : msg
      );
      next.push({
        kind: "bot",
        text: t(
          `Perfekt, dein Termin mit Jovana ist bestätigt: ${slot}. Du erhältst gleich eine Kalendereinladung per E-Mail. Bis dahin kannst du hier alle Details schon vorbereiten.`,
          `Perfect, your call with Jovana is confirmed: ${slot}. You'll receive a calendar invite by email shortly. Until then you can prepare all the details right here.`
        ),
      });
      return next;
    });
  };

  const resolveApproval = (idx: number, approved: boolean) => {
    setMessages((m) => {
      const next = m.map((msg, i) =>
        i === idx && msg.kind === "approval"
          ? { ...msg, status: approved ? ("approved" as const) : ("declined" as const) }
          : msg
      );
      const appr = m[idx];
      const custom = appr.kind === "approval" ? appr : null;
      next.push({
        kind: "bot",
        text: approved
          ? (custom?.approveText ??
            t("Danke für die Freigabe! Der Termin mit der Glaserei ist für den 10.07. gebucht. Die Kosten (€780) erscheinen transparent in deiner Juli-P&L. Die Einheit geht planmäßig am 11.07. wieder live — ich halte dich auf dem Laufenden.",
              "Thanks for the approval! The appointment with the glazier is booked for July 10. The cost (€780) will appear transparently in your July P&L. The unit goes live again on schedule on July 11 — I'll keep you posted."))
          : (custom?.declineText ??
            t("Alles klar, die Reparatur wird nicht beauftragt. Die Duschglaswand bleibt vorerst gesperrt — sag Bescheid, wenn du ein alternatives Angebot möchtest.",
              "Understood, the repair won't be commissioned. The shower glass panel stays blocked for now — let me know if you'd like an alternative quote.")),
      });
      return next;
    });
  };

  const chooseInlineChip = (option: { label: string; answer: Msg[] }) => {
    setMessages((m) => [...m, { kind: "user", text: option.label }, ...option.answer]);
  };

  const resolveDraft = (idx: number, approved: boolean) => {
    setMessages((m) => {
      const next = m.map((msg, i) =>
        i === idx && msg.kind === "draft"
          ? { ...msg, status: approved ? ("approved" as const) : ("discarded" as const) }
          : msg
      );
      const draft = m[idx];
      if (approved && draft.kind === "draft") {
        next.push({ kind: "confirmed", title: draft.title, number: "#1044" });
      } else {
        next.push({
          kind: "bot",
          text: t("Alles klar, ich habe das Ticket verworfen. Kann ich sonst noch etwas für dich tun?", "Alright, I've discarded the ticket. Is there anything else I can do for you?"),
        });
      }
      return next;
    });
  };

  const hasPending = messages.some(
    (m) =>
      (m.kind === "draft" && m.status === "pending") ||
      (m.kind === "approval" && m.status === "pending")
  );

  return (
    <ChatCtx.Provider value={{ openChat }}>
      {children}

      {/* Language toggle + notification bell */}
      <div className="fixed top-5 right-6 z-40 flex items-center gap-3">
        <LangToggle />
        <div className="relative">
        <button
          onClick={() => setNotifOpen((o) => !o)}
          className="relative w-11 h-11 rounded-full bg-white border border-line shadow-[0_2px_10px_rgba(0,0,0,0.06)] flex items-center justify-center text-foreground hover:bg-panel"
        >
          <Bell size={17} />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#c62828] text-white text-[11px] flex items-center justify-center">
              {unread}
            </span>
          )}
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-14 w-[400px] bg-white border border-line rounded-[24px] shadow-[0_16px_50px_rgba(0,0,0,0.14)] overflow-hidden">
            <div className="px-6 py-4 border-b border-line flex items-center justify-between">
              <span className="text-[15px]">{t("Benachrichtigungen", "Notifications")}</span>
              <span className="text-[13px] text-muted">{t("Klick öffnet den Chat", "Click opens the chat")}</span>
            </div>
            {notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => openNotification(n)}
                className="w-full flex items-start gap-3.5 px-6 py-4 text-left hover:bg-panel border-b border-line last:border-b-0"
              >
                <span className="w-9 h-9 rounded-full bg-panel flex items-center justify-center text-muted shrink-0 mt-0.5">
                  {n.icon === "ticket" ? (
                    <Wrench size={15} />
                  ) : n.icon === "payout" ? (
                    <Banknote size={15} />
                  ) : (
                    <BadgeEuro size={15} />
                  )}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="flex items-center gap-2">
                    <span className="text-[14px] truncate">{n.title}</span>
                    {!readIds.includes(n.id) && (
                      <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                    )}
                  </span>
                  <span className="block text-[13px] text-muted mt-0.5 leading-snug">
                    {n.text}
                  </span>
                  <span className="block text-[12px] text-muted mt-1">{n.time}</span>
                </span>
              </button>
            ))}
          </div>
        )}
        </div>
      </div>

      {/* Chat overlay */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center px-6">
          <div className="bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] w-full max-w-[720px] max-h-[85vh] min-h-[340px] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-7 py-5 border-b border-line">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/arbio-a-white.png" alt="Arbio" className="h-[17px] w-auto" draggable={false} />
                </span>
                <div>
                  <div className="text-[16px]">{t("Frag Arbio", "Ask Arbio")}</div>
                  <div className="text-[13px] text-muted">
                    {t("Anfragen, Tickets und alle Fragen zu deinem Portfolio.", "Requests, tickets and all questions about your portfolio.")}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-full bg-panel flex items-center justify-center text-muted"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-7 py-6 flex flex-col gap-4">
              {messages.map((m, i) => {
                if (m.kind === "user")
                  return (
                    <div
                      key={i}
                      className="shrink-0 self-end max-w-[80%] bg-[#2a2a2a] text-white rounded-[22px] rounded-br-[6px] px-5 py-3 text-[15px] leading-snug"
                    >
                      {m.text}
                    </div>
                  );
                if (m.kind === "bot")
                  return (
                    <div
                      key={i}
                      className="shrink-0 self-start max-w-[85%] bg-panel rounded-[22px] rounded-tl-[6px] px-5 py-3 text-[15px] leading-snug"
                    >
                      {m.text}
                    </div>
                  );
                if (m.kind === "timeline")
                  return (
                    <div
                      key={i}
                      className="shrink-0 self-start w-full max-w-[440px] bg-white border border-line rounded-[18px] px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
                    >
                      <div className="text-[14px] mb-3">{m.title}</div>
                      <div className="flex flex-col">
                        {m.steps.map((s, si) => (
                          <div key={si} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <span
                                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                  s.state === "done"
                                    ? "bg-[#dcebd4] text-[#3c5f33]"
                                    : s.state === "current"
                                      ? "border-2 border-accent text-accent-text"
                                      : "border border-line text-muted"
                                }`}
                              >
                                {s.state === "done" ? (
                                  <Check size={13} />
                                ) : (
                                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                                )}
                              </span>
                              {si < m.steps.length - 1 && (
                                <span
                                  className={`w-[2px] h-4 ${
                                    s.state === "done" ? "bg-[#dcebd4]" : "bg-line"
                                  }`}
                                />
                              )}
                            </div>
                            <div className="pb-2">
                              <span
                                className={`text-[14px] ${
                                  s.state === "pending" ? "text-muted" : ""
                                }`}
                              >
                                {s.label}
                              </span>
                              {s.meta && (
                                <span className="text-[13px] text-muted"> · {s.meta}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                if (m.kind === "draft")
                  return (
                    <div
                      key={i}
                      className={`self-start w-full max-w-[440px] bg-white border border-line rounded-[18px] px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)] ${
                        m.status === "discarded" ? "opacity-50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2 text-[13px] text-muted">
                        <Ticket size={13} />
                        {t("Ticket-Entwurf", "Ticket draft")}
                      </div>
                      <div className="text-[15px] mt-2">{m.title}</div>
                      <div className="text-[13px] text-muted mt-1">
                        {m.unit} · {t("Priorität", "Priority")}: {m.prio}
                      </div>
                      {m.status === "pending" ? (
                        <div className="flex gap-2.5 mt-4">
                          <button
                            onClick={() => resolveDraft(i, true)}
                            className="flex-1 bg-[#2a2a2a] text-white rounded-full px-4 py-2.5 text-[14px] hover:bg-black"
                          >
                            {t("Ticket bestätigen", "Confirm ticket")}
                          </button>
                          <button
                            onClick={() => resolveDraft(i, false)}
                            className="flex-1 border border-line rounded-full px-4 py-2.5 text-[14px] text-muted hover:bg-panel"
                          >
                            {t("Verwerfen", "Discard")}
                          </button>
                        </div>
                      ) : (
                        <div className="text-[13px] text-muted mt-3">
                          {m.status === "approved" ? t("Bestätigt", "Confirmed") : t("Verworfen", "Discarded")}
                        </div>
                      )}
                    </div>
                  );
                if (m.kind === "approval")
                  return (
                    <div
                      key={i}
                      className={`self-start w-full max-w-[460px] bg-white border border-line rounded-[18px] px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)] ${
                        m.status === "declined" ? "opacity-50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2 text-[13px] text-[#8a5a1a]">
                        <BadgeEuro size={14} />
                        {t("Kostenfreigabe erforderlich", "Cost approval required")}
                      </div>
                      <div className="text-[15px] mt-2">{m.title}</div>
                      <div className="text-[13px] text-muted mt-0.5">{m.unit}</div>
                      <p className="text-[14px] leading-snug mt-3">{m.report}</p>
                      <div className="flex gap-2 mt-3">
                        {Array.from({ length: m.photos }).map((_, pi) => (
                          <span
                            key={pi}
                            className="w-16 h-16 rounded-[12px] bg-panel flex items-center justify-center text-muted"
                          >
                            <ImageIcon size={18} />
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-4 bg-panel rounded-[12px] px-4 py-3">
                        <span className="text-[14px] text-muted">{t("Kostenvoranschlag", "Cost estimate")}</span>
                        <span className="text-[16px]">{m.cost}</span>
                      </div>
                      {m.status === "pending" ? (
                        <div className="flex gap-2.5 mt-4">
                          <button
                            onClick={() => resolveApproval(i, true)}
                            className="flex-1 bg-[#2a2a2a] text-white rounded-full px-4 py-2.5 text-[14px] hover:bg-black"
                          >
                            {t("Freigeben", "Approve")}
                          </button>
                          <button
                            onClick={() => resolveApproval(i, false)}
                            className="flex-1 border border-line rounded-full px-4 py-2.5 text-[14px] text-muted hover:bg-panel"
                          >
                            {t("Ablehnen", "Decline")}
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-[13px] mt-3 text-muted">
                          {m.status === "approved" ? (
                            <>
                              <CheckCircle2 size={14} className="text-accent-text" />
                              {t("Freigegeben", "Approved")}
                            </>
                          ) : (
                            t("Abgelehnt", "Declined")
                          )}
                        </div>
                      )}
                    </div>
                  );
                if (m.kind === "kamcall")
                  return (
                    <div
                      key={i}
                      className="shrink-0 self-start w-full max-w-[440px] bg-white border border-line rounded-[18px] px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-full bg-panel flex items-center justify-center text-[13px] font-medium">
                          JO
                        </span>
                        <div>
                          <div className="text-[15px]">{t("Termin mit Jovana", "Call with Jovana")}</div>
                          <div className="text-[13px] text-muted">{t("Dein Key Account Manager", "Your Key Account Manager")}</div>
                        </div>
                      </div>
                      {m.chosen ? (
                        <div className="flex items-center gap-1.5 text-[14px] mt-4 text-accent-text">
                          <CheckCircle2 size={15} />
                          {m.chosen} · {t("bestätigt", "confirmed")}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2 mt-4">
                          {m.slots.map((s) => (
                            <button
                              key={s}
                              onClick={() => chooseSlot(i, s)}
                              className="flex items-center gap-2 border border-line rounded-full px-4 py-2.5 text-[14px] hover:bg-panel"
                            >
                              <Phone size={13} className="text-muted" />
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                if (m.kind === "unitcard")
                  return (
                    <div
                      key={i}
                      className="shrink-0 self-start w-full max-w-[440px] bg-white border border-line rounded-[18px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={m.image}
                        alt={m.name}
                        className="w-full h-[150px] object-cover"
                        draggable={false}
                      />
                      <div className="p-5">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-[16px]">{m.name}</div>
                            <div className="text-[13px] text-muted mt-0.5">{m.city}</div>
                          </div>
                          {m.status === "live" ? (
                            <span className="flex items-center gap-1.5 bg-[#eef5eb] text-accent-text rounded-full px-3 py-1 text-[13px]">
                              <span className="w-2 h-2 rounded-full bg-accent inline-block" />
                              {t("Live", "Live")}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 bg-[#fdecea] text-negative rounded-full px-3 py-1 text-[13px]">
                              <span className="w-2 h-2 rounded-full bg-negative inline-block" />
                              {t("Blockiert", "Blocked")}
                            </span>
                          )}
                        </div>
                        {m.blockedNote && (
                          <div className="text-[13px] text-negative mt-1.5">{m.blockedNote}</div>
                        )}
                        <div className="grid grid-cols-2 gap-2 mt-3.5">
                          {m.kpis.map(({ label, value }) => (
                            <div key={label} className="bg-panel rounded-[12px] px-3.5 py-2.5">
                              <div className="text-[12px] text-muted">{label}</div>
                              <div className="text-[17px] tracking-[-0.3px] mt-0.5">{value}</div>
                            </div>
                          ))}
                        </div>
                        {m.recommendations && m.recommendations.length > 0 && (
                          <div className="mt-4">
                            <div className="flex items-center gap-1.5 text-[12px] tracking-[1.5px] uppercase text-muted">
                              <Sparkles size={12} />
                              {t("Empfehlungen von Arbio", "Recommendations from Arbio")}
                            </div>
                            {m.recommendations.map(({ title, price, note }) => (
                              <div key={title} className="py-2 border-b border-line last:border-b-0">
                                <div className="flex items-center justify-between text-[14px]">
                                  <span>{title}</span>
                                  <span>{price}</span>
                                </div>
                                <p className="text-[13px] text-muted leading-snug mt-0.5">{note}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        {m.tickets && (
                          <div className="mt-4">
                            <div className="flex items-center gap-1.5 text-[12px] tracking-[1.5px] uppercase text-muted">
                              <Wrench size={12} />
                              {t("Tickets", "Tickets")}
                            </div>
                            {m.tickets.length === 0 ? (
                              <div className="flex items-center gap-2 text-[13px] text-muted mt-1.5">
                                <CheckCircle2 size={13} className="text-accent-text" />
                                {t("Keine offenen Tickets", "No open tickets")}
                              </div>
                            ) : (
                              m.tickets.map(({ id, title, status }) => (
                                <div
                                  key={id}
                                  className="flex items-center gap-3 py-2 border-b border-line last:border-b-0"
                                >
                                  <span className="text-[13px] text-muted shrink-0">{id}</span>
                                  <span className="flex-1 text-[14px] truncate">{title}</span>
                                  <span
                                    className={`text-[12px] rounded-full px-2.5 py-0.5 shrink-0 ${
                                      status === "In Arbeit" || status === "In progress"
                                        ? "bg-[#eef5eb] text-accent-text"
                                        : "bg-panel text-muted"
                                    }`}
                                  >
                                    {status}
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                if (m.kind === "bars")
                  return (
                    <div
                      key={i}
                      className="shrink-0 self-start w-full max-w-[440px] bg-white border border-line rounded-[18px] px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
                    >
                      <div className="text-[14px] mb-3">{m.title}</div>
                      <div className="flex flex-col gap-2.5">
                        {m.bars.map(({ label, value, pct }) => (
                          <div key={label} className="flex items-center gap-3">
                            <span className="w-[54px] shrink-0 text-[13px] text-muted">{label}</span>
                            <div className="flex-1 h-[8px] bg-panel rounded-full overflow-hidden">
                              <div
                                className="h-full bg-accent rounded-full"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="w-[72px] text-right text-[13px]">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                if (m.kind === "chips")
                  return (
                    <div key={i} className="shrink-0 self-start flex gap-2 flex-wrap max-w-[85%]">
                      {m.options.map((o) => (
                        <button
                          key={o.label}
                          onClick={() => chooseInlineChip(o)}
                          className="border border-line bg-white rounded-full px-4 py-2 text-[14px] hover:bg-panel"
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  );
                if (m.kind === "confirmed")
                  return (
                    <div
                      key={i}
                      className="shrink-0 self-start w-full max-w-[440px] bg-white border border-line rounded-[18px] px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)] flex items-center gap-3"
                    >
                      <CheckCircle2 size={18} className="text-accent-text shrink-0" />
                      <div className="flex-1">
                        <div className="text-[15px]">{t(`Ticket ${m.number} erstellt`, `Ticket ${m.number} created`)}</div>
                        <div className="text-[13px] text-muted mt-0.5">
                          {m.title} · {t("Status jederzeit unter Operations", "Status anytime under Operations")}
                        </div>
                      </div>
                    </div>
                  );
                return null;
              })}
            </div>

            <div className="px-7 pb-5 pt-4 border-t border-line">
              <div className="flex items-center gap-2 bg-white border border-line rounded-[30px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] pl-6 pr-2.5 py-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitRequest(input)}
                  placeholder={t("Beschreib dein Anliegen...", "Describe your request...")}
                  className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-muted"
                />
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-muted hover:bg-panel">
                  <Mic size={18} />
                </button>
                <button
                  onClick={() => submitRequest(input)}
                  className="w-10 h-10 rounded-full bg-[#2a2a2a] text-white flex items-center justify-center hover:bg-black"
                >
                  <ArrowUp size={18} />
                </button>
              </div>
              {!hasPending && (
                <div className="flex gap-2.5 flex-wrap justify-center pt-3">
                  <button
                    onClick={() => startGuided("melden")}
                    className="flex items-center gap-2 border border-line rounded-full px-5 py-2.5 text-[14px] hover:bg-panel"
                  >
                    <AlertTriangle size={14} className="text-muted" />
                    {t("Melden", "Report")}
                  </button>
                  <button
                    onClick={() => startGuided("anfragen")}
                    className="flex items-center gap-2 border border-line rounded-full px-5 py-2.5 text-[14px] hover:bg-panel"
                  >
                    <Wrench size={14} className="text-muted" />
                    {t("Anfragen", "Request")}
                  </button>
                  <button
                    onClick={bookKamCall}
                    className="flex items-center gap-2 border border-line rounded-full px-5 py-2.5 text-[14px] hover:bg-panel"
                  >
                    <Phone size={14} className="text-muted" />
                    {t("KAM-Termin buchen", "Book KAM call")}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </ChatCtx.Provider>
  );
}
