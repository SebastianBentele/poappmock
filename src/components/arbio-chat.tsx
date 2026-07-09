"use client";

import { createContext, useContext, useState, ReactNode } from "react";
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
  HelpCircle,
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
    }
  | {
      kind: "bars";
      title: string;
      bars: { label: string; value: string; pct: number }[];
    }
  | { kind: "chips"; options: { label: string; answer: Msg[] }[] };

type ReqType = "report" | "request" | "data";

const requestTypes: {
  type: ReqType;
  label: string;
  hint: string;
  icon: typeof AlertTriangle;
  options: string[];
}[] = [
  {
    type: "report",
    label: "Melden",
    hint: "Schaden oder Vorfall",
    icon: AlertTriangle,
    options: ["Schaden melden", "Sicherheitsvorfall melden"],
  },
  {
    type: "request",
    label: "Anfragen",
    hint: "Reparatur, Reinigung, Ausstattung",
    icon: Wrench,
    options: ["Reparatur anfragen", "Reinigung anfragen", "Ausstattung ändern"],
  },
  {
    type: "data",
    label: "Datenfrage",
    hint: "Frage zu deinen Zahlen",
    icon: HelpCircle,
    options: ["Wie war meine Auslastung im Juli?", "Wie entwickelt sich meine ADR?"],
  },
];

const dataAnswers: Record<string, string> = {
  "Wie war meine Auslastung im Juli?":
    "Deine Auslastung im Juli liegt bei 55,5 %. Das ist saisonal etwas niedriger, aber deine Durchschnittsrate von 241 € gleicht das aus — der Umsatz liegt 7,6 % über Vorjahr. Details findest du unter Umsatz.",
  "Wie entwickelt sich meine ADR?":
    "Deine ADR liegt aktuell bei 241 € — +37 € gegenüber dem Vorjahreszeitraum (+18 %). Seit Beginn mit Arbio ist sie um 34 % gestiegen. Die vollständige Entwicklung siehst du unter Umsatz.",
};

export const requestIntroSeed: Msg[] = [
  {
    kind: "bot",
    text: "Hi Sebastian! Was möchtest du tun? Wähl eine Kategorie — Melden, Anfragen oder Datenfrage — oder beschreib dein Anliegen frei. Für komplexere Themen kannst du unten auch direkt einen Call mit deinem KAM buchen.",
  },
];

export function costExplainSeed(label: string): Msg[] {
  const seeds: Record<string, Msg[]> = {
    "OTA-Provision": [
      { kind: "user", text: "Erkläre mir die Position „OTA-Provision“ (Juli: –€5.407)" },
      {
        kind: "bot",
        text: "Gerne! Die OTA-Provision ist die Vermittlungsgebühr der Buchungsplattformen — im Juli –€5.407, das sind 13,0% vom Bruttoumsatz. Volle Transparenz: Booking.com –€4.421 (15% auf €29.475 aus 18 Buchungen), Airbnb –€986 (14% auf €7.040 aus 7 Buchungen). Deine 3 Direktbuchungen (€4.936) sind provisionsfrei — Arbio steuert deinen Kanal-Mix laufend so aus, dass unterm Strich am meisten für dich übrig bleibt. Die Provision wird automatisch vor der Auszahlung einbehalten, du musst nichts tun.",
      },
    ],
    Umsatzsteuer: [
      { kind: "user", text: "Erkläre mir die Position „Umsatzsteuer“ (Juli: –€2.712)" },
      {
        kind: "bot",
        text: "Die Umsatzsteuer-Position fasst USt. und Beherbergungssteuer zusammen, die wir aus deinem Bruttoumsatz abführen — im Juli –€2.712 auf €41.451 GBV. Sie steigt proportional zum Umsatz, daher der Anstieg ggü. Juni (–€1.869). Wir führen sie direkt ab und weisen sie in der Abrechnung aus — für deinen Steuerberater findest du die Details im Owner Statement unter Finanzen → Auszahlungen.",
      },
    ],
    "Reinigung · Test": [
      { kind: "user", text: "Erkläre mir die Position „Reinigung · Test“ (Juli: –€221)" },
      {
        kind: "bot",
        text: "Die –€221 sind Reinigungskosten, die im Juli erstmals als eigene Position in deiner P&L auftauchen (daher der Zusatz „Test“ — wir stellen die Kostenerfassung gerade um). Enthalten: 2 Zusatzreinigungen nach Late-Checkout (Studio Universität, je €68) und eine Grundreinigung im Garten Apartment (€85). Reguläre Wechselreinigungen zahlen die Gäste über die Reinigungsgebühr — sie tauchen hier nicht auf. Hinweis: Bei deinem Buchungsvolumen ist der Betrag ungewöhnlich niedrig; wir prüfen gerade, ob alle Juli-Belege schon erfasst sind.",
      },
    ],
    "Bruttoumsatz (GBV)": [
      { kind: "user", text: "Erkläre mir die Position „Bruttoumsatz (GBV)“ (Juli: €41.451)" },
      {
        kind: "bot",
        text: "Der Bruttoumsatz (Gross Booking Value) ist die Summe aller Gästezahlungen für Aufenthalte im Juli — €41.451 aus 28 Buchungen und 172 belegten Nächten, über alle Kanäle (Booking.com, Airbnb, Direct). Er ist die Ausgangsbasis der P&L: Davon gehen Umsatzsteuer, OTA-Provision und Kosten ab, bis dein operativer Gewinn von €33.111 übrig bleibt. Wichtig: Der GBV ist nicht dein Auszahlungsbetrag — der entspricht dem Nettoumsatz abzüglich Kosten.",
      },
    ],
    "Miete / Finanzierung": [
      { kind: "user", text: "Erkläre mir die Position „Miete / Finanzierung“ (–€2.100/Monat)" },
      {
        kind: "bot",
        text: "Das ist eine von dir gepflegte Kostenposition: „Kredit Altstadt Apartment“, €2.100 pro Monat, aktiv seit 01.01.2026. Sie stammt nicht aus der Arbio-Abrechnung, sondern aus deinen eigenen Angaben unter Finanzen → Kosten — dort kannst du sie jederzeit anpassen oder pro Einheit aufteilen. Sie fließt in deinen echten Netto-Gewinn ein, damit die P&L dein komplettes Investment abbildet, nicht nur die Vermietungsseite.",
      },
    ],
    Versicherung: [
      { kind: "user", text: "Erkläre mir die Position „Versicherung“ (–€245/Monat)" },
      {
        kind: "bot",
        text: "Deine Gebäudeversicherung mit €245 pro Monat — von dir unter Finanzen → Kosten gepflegt und auf alle Einheiten angewendet. Tipp: Wenn einzelne Einheiten unterschiedlich versichert sind, kannst du im Kosten-Tab pro Einheit abweichende Werte hinterlegen.",
      },
    ],
    "Nebenkosten & Internet": [
      { kind: "user", text: "Erkläre mir die Position „Nebenkosten & Internet“ (–€290/Monat)" },
      {
        kind: "bot",
        text: "Diese Position fasst zwei von dir gepflegte Kosten zusammen: Strom & Gas Abschlag (€200/Monat) und Glasfaser für 3 Einheiten (€90/Monat). Beide findest du unter Finanzen → Kosten und kannst sie dort jederzeit anpassen — sie fließen automatisch in deinen echten Netto-Gewinn ein.",
      },
    ],
  };
  return (
    seeds[label] ?? [
      { kind: "user", text: `Erkläre mir die Position „${label}“` },
      {
        kind: "bot",
        text: `Zu „${label}“ habe ich folgende Informationen: Die Position stammt aus deiner Juli-Abrechnung. Frag mich gern nach Details zu einzelnen Belegen.`,
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

export const waterDamageApprovalSeed: Msg[] = [
  {
    kind: "bot",
    text: "Beim Wasserschaden im Studio Universität (Ticket #1038) ist eine zusätzliche Reparatur nötig: Die Duschglaswand ist gerissen und muss von einem externen Handwerker getauscht werden. Wir haben ein Angebot eingeholt und brauchen kurz deine Freigabe.",
  },
  {
    kind: "approval",
    title: "Duschglaswand-Austausch (externer Handwerker)",
    unit: "Studio Universität · Ticket #1038",
    report:
      "Bei der Trocknung entdeckt: Die Glasabtrennung der Dusche ist gesprungen (Folgeschaden). Austausch inkl. Montage durch Glaserei Berger. Termin wäre der 10.07., damit die Einheit planmäßig am 11.07. wieder live geht.",
    photos: 2,
    cost: "€780 (Festpreis inkl. Material & Montage)",
    status: "pending",
  },
];

const notifications: Notification[] = [
  {
    id: "n4",
    icon: "approval",
    title: "Kostenfreigabe · Wasserschaden",
    text: "Externer Handwerker · €780 — deine Freigabe nötig",
    time: "vor 1 Std",
    seed: waterDamageApprovalSeed,
  },
  {
    id: "n1",
    icon: "ticket",
    title: "Ticket #1041 · WLAN-Router",
    text: "Techniker bestätigt für Di, 14.07., 9–12 Uhr",
    time: "vor 2 Std",
    seed: [
      {
        kind: "bot",
        text: "Kurz zu deiner Benachrichtigung: Für Ticket #1041 (WLAN-Router austauschen, Garten Apartment) hat der Techniker den Termin bestätigt — Dienstag, 14.07., zwischen 9 und 12 Uhr.",
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
      {
        kind: "bot",
        text: "Du musst nichts weiter tun — der Zugang erfolgt über die Schlüsselbox, im Zeitraum ist kein Gast eingebucht. Soll ich dir den Termin in den Kalender eintragen?",
      },
    ],
  },
  {
    id: "n2",
    icon: "ticket",
    title: "Ticket #1043 · Spülmaschine",
    text: "Ersatzteil bestellt — Einbau vsl. 16.07.",
    time: "vor 5 Std",
    seed: [
      {
        kind: "bot",
        text: "Update zu Ticket #1043 (Spülmaschine macht Geräusche, Altstadt Apartment): Unser Techniker war heute vor Ort — die Umwälzpumpe ist defekt. Das Ersatzteil ist bestellt, der Einbau ist für den 16.07. geplant.",
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
        text: "Kosten: €140 Material + Anfahrt, taucht danach als Position in deiner Juli-P&L auf. Die Maschine ist bis zum Einbau eingeschränkt nutzbar — die Gäste sind informiert.",
      },
    ],
  },
  {
    id: "n3",
    icon: "payout",
    title: "Auszahlung Juni überwiesen",
    text: "€34.900 unterwegs — Eingang vsl. 07.07.",
    time: "gestern",
    seed: [
      {
        kind: "bot",
        text: "Deine Juni-Auszahlung über €34.900 wurde gestern überwiesen. Ablauf: Abrechnung erstellt am 01.07., freigegeben am 03.07., überwiesen am 05.07. — der Eingang auf deinem Konto ist voraussichtlich am 07.07. (SEPA, 1–2 Bankarbeitstage).",
      },
      {
        kind: "timeline",
        title: "Auszahlung Juni 2026 · €34.900",
        steps: [
          { label: "Abrechnung erstellt", meta: "01.07.", state: "done" },
          { label: "Freigegeben", meta: "03.07.", state: "done" },
          { label: "Überwiesen", meta: "05.07.", state: "done" },
          { label: "Eingang auf deinem Konto", meta: "vsl. 07.07.", state: "current" },
        ],
      },
      {
        kind: "bot",
        text: "Das zugehörige Owner Statement liegt unter Finanzen → Auszahlungen bereit. Sag Bescheid, falls der Betrag bis 08.07. nicht angekommen ist.",
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
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);

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

  const submitRequest = (text: string, type: ReqType = "request") => {
    if (!text.trim()) return;
    if (type === "data") {
      setMessages((m) => [
        ...m,
        { kind: "user", text },
        {
          kind: "bot",
          text:
            dataAnswers[text] ??
            "Gute Frage — ich schaue mir deine Zahlen an. Die Auswertung findest du auch jederzeit unter Umsatz und Finanzen.",
        },
      ]);
    } else {
      setMessages((m) => [
        ...m,
        { kind: "user", text },
        {
          kind: "bot",
          text:
            type === "report"
              ? "Danke für die Meldung! Ich habe folgendes Ticket vorbereitet — bitte bestätige kurz:"
              : "Gerne! Ich habe folgendes Ticket vorbereitet — bitte bestätige kurz:",
        },
        draftFor(text),
      ]);
    }
    setInput("");
  };

  const bookKamCall = () => {
    setMessages((m) => [
      ...m,
      { kind: "user", text: "Ich möchte einen Termin mit meinem KAM buchen." },
      {
        kind: "bot",
        text: "Sehr gern — dein persönlicher Key Account Manager ist Jovana. Wähl einen der nächsten freien Termine, dann schicke ich dir die Kalendereinladung.",
      },
      { kind: "kamcall", slots: ["Mi 09.07. · 10:00", "Do 10.07. · 14:30", "Fr 11.07. · 09:00"] },
    ]);
  };

  const chooseSlot = (idx: number, slot: string) => {
    setMessages((m) => {
      const next = m.map((msg, i) =>
        i === idx && msg.kind === "kamcall" ? { ...msg, chosen: slot } : msg
      );
      next.push({
        kind: "bot",
        text: `Perfekt, dein Termin mit Jovana ist bestätigt: ${slot}. Du erhältst gleich eine Kalendereinladung per E-Mail. Bis dahin kannst du hier alle Details schon vorbereiten.`,
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
            "Danke für die Freigabe! Der Termin mit der Glaserei ist für den 10.07. gebucht. Die Kosten (€780) erscheinen transparent in deiner Juli-P&L. Die Einheit geht planmäßig am 11.07. wieder live — ich halte dich auf dem Laufenden.")
          : (custom?.declineText ??
            "Alles klar, die Reparatur wird nicht beauftragt. Die Duschglaswand bleibt vorerst gesperrt — sag Bescheid, wenn du ein alternatives Angebot möchtest."),
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
          text: "Alles klar, ich habe das Ticket verworfen. Kann ich sonst noch etwas für dich tun?",
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

      {/* Notification bell */}
      <div className="fixed top-5 right-6 z-40">
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
              <span className="text-[15px]">Benachrichtigungen</span>
              <span className="text-[13px] text-muted">Klick öffnet den Chat</span>
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

      {/* Chat overlay */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center px-6">
          <div className="bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] w-full max-w-[720px] h-[80vh] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-7 py-5 border-b border-line">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-[#2a2a2a] text-white flex items-center justify-center text-[13px]">
                  A
                </span>
                <div>
                  <div className="text-[16px]">Frag Arbio</div>
                  <div className="text-[13px] text-muted">
                    Anfragen, Tickets und alle Fragen zu deinem Portfolio.
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
                      className="self-end max-w-[80%] bg-[#2a2a2a] text-white rounded-[22px] rounded-br-[6px] px-5 py-3 text-[15px] leading-snug"
                    >
                      {m.text}
                    </div>
                  );
                if (m.kind === "bot")
                  return (
                    <div
                      key={i}
                      className="self-start max-w-[85%] bg-panel rounded-[22px] rounded-tl-[6px] px-5 py-3 text-[15px] leading-snug"
                    >
                      {m.text}
                    </div>
                  );
                if (m.kind === "timeline")
                  return (
                    <div
                      key={i}
                      className="self-start w-full max-w-[440px] bg-white border border-line rounded-[18px] px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
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
                        Ticket-Entwurf
                      </div>
                      <div className="text-[15px] mt-2">{m.title}</div>
                      <div className="text-[13px] text-muted mt-1">
                        {m.unit} · Priorität: {m.prio}
                      </div>
                      {m.status === "pending" ? (
                        <div className="flex gap-2.5 mt-4">
                          <button
                            onClick={() => resolveDraft(i, true)}
                            className="flex-1 bg-[#2a2a2a] text-white rounded-full px-4 py-2.5 text-[14px] hover:bg-black"
                          >
                            Ticket bestätigen
                          </button>
                          <button
                            onClick={() => resolveDraft(i, false)}
                            className="flex-1 border border-line rounded-full px-4 py-2.5 text-[14px] text-muted hover:bg-panel"
                          >
                            Verwerfen
                          </button>
                        </div>
                      ) : (
                        <div className="text-[13px] text-muted mt-3">
                          {m.status === "approved" ? "Bestätigt" : "Verworfen"}
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
                        Kostenfreigabe erforderlich
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
                        <span className="text-[14px] text-muted">Kostenvoranschlag</span>
                        <span className="text-[16px]">{m.cost}</span>
                      </div>
                      {m.status === "pending" ? (
                        <div className="flex gap-2.5 mt-4">
                          <button
                            onClick={() => resolveApproval(i, true)}
                            className="flex-1 bg-[#2a2a2a] text-white rounded-full px-4 py-2.5 text-[14px] hover:bg-black"
                          >
                            Freigeben
                          </button>
                          <button
                            onClick={() => resolveApproval(i, false)}
                            className="flex-1 border border-line rounded-full px-4 py-2.5 text-[14px] text-muted hover:bg-panel"
                          >
                            Ablehnen
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-[13px] mt-3 text-muted">
                          {m.status === "approved" ? (
                            <>
                              <CheckCircle2 size={14} className="text-accent-text" />
                              Freigegeben
                            </>
                          ) : (
                            "Abgelehnt"
                          )}
                        </div>
                      )}
                    </div>
                  );
                if (m.kind === "kamcall")
                  return (
                    <div
                      key={i}
                      className="self-start w-full max-w-[440px] bg-white border border-line rounded-[18px] px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-full bg-panel flex items-center justify-center text-[13px] font-medium">
                          JO
                        </span>
                        <div>
                          <div className="text-[15px]">Termin mit Jovana</div>
                          <div className="text-[13px] text-muted">Dein Key Account Manager</div>
                        </div>
                      </div>
                      {m.chosen ? (
                        <div className="flex items-center gap-1.5 text-[14px] mt-4 text-accent-text">
                          <CheckCircle2 size={15} />
                          {m.chosen} · bestätigt
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
                      className="self-start w-full max-w-[440px] bg-white border border-line rounded-[18px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
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
                              Live
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 bg-[#fdecea] text-negative rounded-full px-3 py-1 text-[13px]">
                              <span className="w-2 h-2 rounded-full bg-negative inline-block" />
                              Blockiert
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
                      </div>
                    </div>
                  );
                if (m.kind === "bars")
                  return (
                    <div
                      key={i}
                      className="self-start w-full max-w-[440px] bg-white border border-line rounded-[18px] px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
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
                    <div key={i} className="self-start flex gap-2 flex-wrap max-w-[85%]">
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
                      className="self-start w-full max-w-[440px] bg-white border border-line rounded-[18px] px-5 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)] flex items-center gap-3"
                    >
                      <CheckCircle2 size={18} className="text-accent-text shrink-0" />
                      <div className="flex-1">
                        <div className="text-[15px]">Ticket {m.number} erstellt</div>
                        <div className="text-[13px] text-muted mt-0.5">
                          {m.title} · Status jederzeit unter Operations
                        </div>
                      </div>
                    </div>
                  );
                return null;
              })}
            </div>

            <div className="px-7 pb-6 pt-2 border-t border-line">
              {!hasPending && (
                <div className="flex flex-col gap-2.5 py-3">
                  {requestTypes.map(({ type, label, hint, icon: Icon, options }) => (
                    <div key={type} className="flex items-start gap-3">
                      <span className="flex items-center gap-1.5 text-[13px] text-muted w-[112px] shrink-0 mt-1.5">
                        <Icon size={13} />
                        {label}
                      </span>
                      <div className="flex gap-2 flex-wrap flex-1">
                        {options.map((o) => (
                          <button
                            key={o}
                            onClick={() => submitRequest(o, type)}
                            className="border border-line rounded-full px-4 py-2 text-[14px] hover:bg-panel"
                            title={hint}
                          >
                            {o}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={bookKamCall}
                    className="flex items-center gap-2 text-[14px] text-accent-text hover:underline mt-1"
                  >
                    <Phone size={14} />
                    Komplexes Thema oder Beschwerde? Termin mit deinem KAM buchen
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2 bg-white border border-line rounded-[30px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] pl-6 pr-2.5 py-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitRequest(input)}
                  placeholder="Beschreib dein Anliegen..."
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
            </div>
          </div>
        </div>
      )}
    </ChatCtx.Provider>
  );
}
