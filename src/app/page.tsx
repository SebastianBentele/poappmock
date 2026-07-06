"use client";

import { useState } from "react";
import {
  Calendar,
  LifeBuoy,
  X,
  CheckCircle2,
  Ticket,
  Mic,
  ArrowUp,
} from "lucide-react";
import { ChatInput } from "@/components/chat-input";

const kpis = [
  { label: "Monatsumsatz", value: "41.451 €" },
  { label: "Tagesrate", value: "241 €" },
  { label: "Auslastung", value: "55 %" },
  { label: "Contribution Margin", value: "86 %" },
  { label: "Operativer Gewinn", value: "33.111 €" },
];

const chips = ["Wöchentlicher Umsatz", "Top-Performer", "Buchungstempo", "Profitabilität"];

const prefabs = [
  "Reparatur melden",
  "Reinigung anfragen",
  "Abrechnungsfrage",
  "Ausstattung ändern",
];

type Msg =
  | { kind: "user"; text: string }
  | { kind: "bot"; text: string }
  | {
      kind: "draft";
      title: string;
      unit: string;
      prio: string;
      status: "pending" | "approved" | "discarded";
    }
  | { kind: "confirmed"; title: string; number: string };

const draftFor = (text: string) => ({
  kind: "draft" as const,
  title: text.length > 60 ? text.slice(0, 57) + "..." : text,
  unit: "Altstadt Apartment",
  prio: "Mittel",
  status: "pending" as const,
});

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");

  const openChat = () => {
    setMessages([
      {
        kind: "bot",
        text: "Hi Sebastian! Wobei können wir helfen? Wähl eine häufige Anfrage aus oder beschreib dein Anliegen einfach frei — ich erstelle daraus ein Ticket für unser Team.",
      },
    ]);
    setChatOpen(true);
  };

  const submitRequest = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [
      ...m,
      { kind: "user", text },
      {
        kind: "bot",
        text: "Gerne! Ich habe folgendes Ticket vorbereitet — bitte bestätige kurz:",
      },
      draftFor(text),
    ]);
    setInput("");
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

  const hasPendingDraft = messages.some((m) => m.kind === "draft" && m.status === "pending");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-10 py-16">
      <h1 className="text-[48px] tracking-[-1px]">Guten Tag, Sebastian.</h1>
      <p className="text-[20px] text-muted mt-2">
        Frag uns alles zu Umsatz, Profitabilität oder Forecast.
      </p>

      <div className="flex items-center gap-2 text-[15px] text-muted mt-12">
        <Calendar size={15} />
        <span>Aktueller Monat · Juli 2026</span>
      </div>

      <div className="flex gap-4 mt-5 flex-wrap justify-center">
        {kpis.map(({ label, value }) => (
          <div
            key={label}
            className="bg-white border border-line rounded-[24px] px-7 py-4 min-w-[180px] shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
          >
            <div className="text-[15px]">{label}</div>
            <div className="text-[28px] tracking-[-0.5px] mt-1">{value}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-24 flex-wrap justify-center">
        {chips.map((c) => (
          <button
            key={c}
            className="border border-line rounded-full px-5 py-2.5 text-[15px] hover:bg-panel"
          >
            {c}
          </button>
        ))}
      </div>

      <ChatInput
        placeholder="Frag etwas zu deinem Portfolio..."
        className="w-full max-w-[1060px] mt-5"
      />

      <button
        onClick={openChat}
        className="flex items-center gap-2.5 bg-[#2a2a2a] text-white rounded-full px-8 py-4 text-[16px] mt-8 hover:bg-black transition-colors"
      >
        <LifeBuoy size={17} />
        Anfrage stellen
      </button>

      {/* Request chat overlay */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center px-6">
          <div className="bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] w-full max-w-[720px] h-[80vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-line">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-[#2a2a2a] text-white flex items-center justify-center text-[13px]">
                  A
                </span>
                <div>
                  <div className="text-[16px]">Anfrage stellen</div>
                  <div className="text-[13px] text-muted">
                    Aus deiner Nachricht wird ein Ticket — du bestätigst, bevor es rausgeht.
                  </div>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="w-9 h-9 rounded-full bg-panel flex items-center justify-center text-muted"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
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
              })}
            </div>

            {/* Prefab chips + input */}
            <div className="px-7 pb-6 pt-2 border-t border-line">
              {!hasPendingDraft && (
                <div className="flex gap-2.5 flex-wrap py-3">
                  {prefabs.map((p) => (
                    <button
                      key={p}
                      onClick={() => submitRequest(p)}
                      className="border border-line rounded-full px-4 py-2 text-[14px] hover:bg-panel"
                    >
                      {p}
                    </button>
                  ))}
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
    </div>
  );
}
