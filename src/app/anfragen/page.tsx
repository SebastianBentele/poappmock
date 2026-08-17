"use client";

import { ClipboardList, MessageCircle, Plus, CheckCircle2 } from "lucide-react";
import { ChatInput } from "@/components/chat-input";
import { useArbioChat, requestIntroSeed, type Msg, type Tr } from "@/components/arbio-chat";
import { useLang } from "@/components/lang";

/**
 * V1 "Anfragen": only the requests the owner raised through the portal.
 *
 * Deliberately NOT the maintenance board — Breezeway ticket data isn't
 * reliable enough to show yet (inconsistent logging, no bill-to-owner vs
 * bill-to-guest tag). These requests are a closed loop the portal owns
 * end-to-end, so status and dates are trustworthy, and no cost surprises
 * can appear in them.
 */
type Status = "eingegangen" | "in-arbeit" | "erledigt";

const buildRequests = (t: Tr): {
  id: string;
  title: string;
  unit: string;
  category: string;
  created: string;
  status: Status;
  note: string;
  seed: Msg[];
}[] => [
  {
    id: "#1044",
    title: t("Spülmaschine macht Geräusche", "Dishwasher making noises"),
    unit: "Studio Universität",
    category: t("Reparatur", "Repair"),
    created: "08.07.2026",
    status: "in-arbeit",
    note: t("Jovana hat die Anfrage übernommen und meldet sich mit dem nächsten Schritt.", "Jovana picked up the request and will come back with the next step."),
    seed: [
      { kind: "user", text: t("Wie ist der Stand bei Anfrage #1044?", "What's the status of request #1044?") },
      {
        kind: "bot",
        text: t(
          "Anfrage #1044 (Spülmaschine, Studio Universität) liegt bei Jovana. Sie kümmert sich darum und meldet sich mit dem nächsten Schritt — du bekommst hier eine Benachrichtigung, sobald es Neues gibt.",
          "Request #1044 (dishwasher, Studio Universität) is with Jovana. She's taking care of it and will come back with the next step — you'll get a notification here as soon as there's news."
        ),
      },
      {
        kind: "timeline",
        title: t("Anfrage #1044 · Spülmaschine", "Request #1044 · Dishwasher"),
        steps: [
          { label: t("Eingegangen", "Received"), meta: "08.07.", state: "done" },
          { label: t("In Arbeit", "In progress"), meta: t("bei Jovana", "with Jovana"), state: "current" },
          { label: t("Erledigt", "Done"), state: "pending" },
        ],
        note: t("Wir melden uns, sobald es etwas Neues gibt.", "We'll get back to you as soon as there's news."),
      },
    ],
  },
  {
    id: "#1042",
    title: t("Neue Fotos für das Listing", "New photos for the listing"),
    unit: "Garten Apartment",
    category: t("Fotos & Listing", "Photos & listing"),
    created: "02.07.2026",
    status: "erledigt",
    note: t("Neue Fotos sind seit 06.07. auf allen Kanälen live.", "New photos have been live on all channels since Jul 6."),
    seed: [
      { kind: "user", text: t("Was ist aus meiner Foto-Anfrage geworden?", "What happened to my photo request?") },
      {
        kind: "bot",
        text: t(
          "Erledigt: Das Shooting im Garten Apartment war am 04.07., die neuen Fotos sind seit 06.07. auf Airbnb und Booking.com live.",
          "Done: the shoot at Garten Apartment took place on Jul 4, the new photos have been live on Airbnb and Booking.com since Jul 6."
        ),
      },
    ],
  },
  {
    id: "#1040",
    title: t("Eigenbelegung eintragen", "Add owner stay"),
    unit: "Garten Apartment",
    category: t("Eigenbelegung", "Owner stay"),
    created: "28.06.2026",
    status: "erledigt",
    note: t("07.–10.08. ist für Gäste blockiert.", "Aug 7–10 is blocked for guests."),
    seed: [
      { kind: "user", text: t("Ist meine Eigenbelegung im August eingetragen?", "Is my August owner stay booked in?") },
      {
        kind: "bot",
        text: t(
          "Ja — Garten Apartment ist vom 07. bis 10. August für Gästebuchungen blockiert. Der Zeitraum taucht in deinem Kalender als Eigenbelegung auf, die Reinigung ist entsprechend eingeplant.",
          "Yes — Garten Apartment is blocked for guest bookings from Aug 7 to 10. The period shows in your calendar as an owner stay and cleaning is scheduled accordingly."
        ),
      },
    ],
  },
];

export default function Anfragen() {
  const { openChat } = useArbioChat();
  const { t } = useLang();
  const requests = buildRequests(t);

  const statusPill = (s: Status) =>
    s === "erledigt"
      ? { label: t("Erledigt", "Done"), cls: "bg-[#eef5eb] text-accent-text", dot: "bg-accent" }
      : s === "in-arbeit"
        ? { label: t("In Arbeit", "In progress"), cls: "bg-panel text-foreground", dot: "bg-[#2a2a2a]" }
        : { label: t("Eingegangen", "Received"), cls: "bg-panel text-muted", dot: "bg-muted" };

  const open = requests.filter((r) => r.status !== "erledigt").length;

  return (
    <div className="relative min-h-screen px-4 md:px-8 py-6 pb-32">
      {/* Header + new request */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-[18px] tracking-[3px] uppercase">{t("Deine Anfragen", "Your requests")}</h2>
          <p className="text-[14px] text-muted mt-1">
            {open > 0
              ? t(`${open} offen · alles Weitere übernimmt dein Team`, `${open} open · your team handles the rest`)
              : t("Alles erledigt — nichts offen.", "All done — nothing open.")}
          </p>
        </div>
        <button
          onClick={() => openChat(requestIntroSeed(t))}
          className="flex items-center gap-2 bg-[#2a2a2a] text-white rounded-full px-6 py-3 text-[15px] hover:bg-black transition-colors"
        >
          <Plus size={16} />
          {t("Neue Anfrage", "New request")}
        </button>
      </div>

      {/* Request list */}
      <div className="bg-white border border-line rounded-[24px] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.03)] mt-6">
        {requests.map((r, i) => {
          const pill = statusPill(r.status);
          return (
            <button
              key={r.id}
              onClick={() => openChat(r.seed)}
              className={`w-full text-left px-5 py-5 hover:bg-panel transition-colors ${
                i > 0 ? "border-t border-line" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-[13px] text-muted">{r.id}</span>
                    <span className="text-[16px]">{r.title}</span>
                  </div>
                  <div className="text-[13px] text-muted mt-1">
                    {r.unit} · {r.category} · {t("erstellt", "created")} {r.created}
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] shrink-0 ${pill.cls}`}>
                  <span className={`w-2 h-2 rounded-full inline-block ${pill.dot}`} />
                  {pill.label}
                </span>
              </div>
              <p className="text-[14px] text-muted leading-snug mt-2.5">{r.note}</p>
              <span className="flex items-center gap-1.5 text-[13px] text-muted mt-2.5">
                <MessageCircle size={13} />
                {t("Details im Chat", "Details in chat")}
              </span>
            </button>
          );
        })}
      </div>

      {/* What belongs here / what doesn't — honest scope note */}
      <div className="bg-white border border-line rounded-[24px] p-5 md:p-7 mt-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-2 text-[13px] tracking-[1.5px] uppercase text-muted">
          <ClipboardList size={13} />
          {t("Was hierher gehört", "What belongs here")}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {[
            { title: t("Melden & anfragen", "Report & request"), text: t("Schäden, Reparaturen, Ausstattung, Fotos — beschreib es in einem Satz.", "Damage, repairs, amenities, photos — describe it in one sentence.") },
            { title: t("Eigenbelegung", "Owner stays"), text: t("Zeiträume für dich blockieren — wir tragen sie sauber im System ein.", "Block periods for yourself — we log them correctly in the system.") },
            { title: t("Rückfragen", "Questions"), text: t("Alles, was du sonst per Mail oder WhatsApp schicken würdest.", "Anything you'd otherwise send by email or WhatsApp.") },
          ].map(({ title, text }) => (
            <div key={title} className="bg-panel rounded-[16px] px-5 py-4">
              <div className="flex items-center gap-2 text-[14px]">
                <CheckCircle2 size={14} className="text-accent-text shrink-0" />
                {title}
              </div>
              <p className="text-[13px] text-muted leading-snug mt-1.5">{text}</p>
            </div>
          ))}
        </div>
        <p className="text-[13px] text-muted mt-4">
          {t(
            "Die laufende Instandhaltung deiner Einheiten steuert Arbio im Hintergrund — hier siehst du das, was du selbst angestoßen hast.",
            "Arbio runs the ongoing maintenance of your units in the background — here you see what you started yourself."
          )}
        </p>
      </div>

      {/* Floating chat */}
      <div className="fixed bottom-6 left-0 lg:left-[var(--sidebar-w)] right-0 flex justify-center px-4 md:px-8 pointer-events-none transition-[left] duration-200 ease-out">
        <ChatInput
          placeholder={t("Beschreib dein Anliegen...", "Describe your request...")}
          className="w-full max-w-[620px] pointer-events-auto"
        />
      </div>
    </div>
  );
}
