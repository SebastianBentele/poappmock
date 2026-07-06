"use client";

import { useState } from "react";
import {
  Calendar,
  MapPin,
  ChevronDown,
  Zap,
  Download,
  FileText,
  Check,
  MessageCircle,
} from "lucide-react";
import { KpiCard } from "@/components/kpi-card";
import { AiCard } from "@/components/ai-card";
import { ChatInput } from "@/components/chat-input";
import { ProfitChart, PayoutChart } from "@/components/charts";
import { PnlTable } from "@/components/pnl-table";
import { useArbioChat, costExplainSeed, type Msg } from "@/components/arbio-chat";

const payoutTrackers: {
  title: string;
  amount: string;
  steps: { label: string; meta?: string; state: "done" | "current" | "pending" }[];
  seed: Msg[];
}[] = [
  {
    title: "Auszahlung Juni 2026",
    amount: "€34.900",
    steps: [
      { label: "Abrechnung erstellt", meta: "01.07.", state: "done" },
      { label: "Freigegeben", meta: "03.07.", state: "done" },
      { label: "Überwiesen", meta: "05.07.", state: "done" },
      { label: "Eingang", meta: "vsl. 07.07.", state: "current" },
    ],
    seed: [
      { kind: "user", text: "Wo steht meine Juni-Auszahlung gerade?" },
      {
        kind: "bot",
        text: "Deine Juni-Auszahlung über €34.900 ist unterwegs: Abrechnung erstellt am 01.07., freigegeben am 03.07., überwiesen am 05.07. per SEPA. Der Eingang auf deinem Konto ist voraussichtlich am 07.07. (1–2 Bankarbeitstage). Sag Bescheid, falls sie bis 08.07. nicht angekommen ist — dann prüfe ich die Überweisung direkt.",
      },
    ],
  },
  {
    title: "Auszahlung Juli 2026",
    amount: "€18.450 aufgelaufen",
    steps: [
      { label: "Läuft auf", meta: "bis 31.07.", state: "current" },
      { label: "Abrechnung", meta: "01.08.", state: "pending" },
      { label: "Freigabe", meta: "03.08.", state: "pending" },
      { label: "Auszahlung", meta: "05.08.", state: "pending" },
    ],
    seed: [
      { kind: "user", text: "Wann kommt meine Juli-Auszahlung?" },
      {
        kind: "bot",
        text: "Für Juli sind bisher €18.450 aufgelaufen — der Monat läuft noch bis 31.07. Danach: Abrechnung am 01.08., Freigabe am 03.08., Auszahlung am 05.08. (kostenlos). Wenn du nicht warten willst: Über „Sofort auszahlen“ bekommst du den aktuellen Stand gegen 2% Gebühr (€369) sofort.",
      },
    ],
  },
];

const costs = [
  { label: "OTA-Provision", pct: "13,0%", width: "72%" },
  { label: "Reinigung", pct: "0,5%", width: "6%" },
];

const statements = [
  { month: "Juni 2026", period: "01.06. – 30.06.2026", amount: "€34.900,00" },
  { month: "Mai 2026", period: "01.05. – 31.05.2026", amount: "€30.400,00" },
  { month: "April 2026", period: "01.04. – 30.04.2026", amount: "€26.800,00" },
  { month: "März 2026", period: "01.03. – 31.03.2026", amount: "€21.500,00" },
  { month: "Februar 2026", period: "01.02. – 28.02.2026", amount: "€11.600,00" },
  { month: "Januar 2026", period: "01.01. – 31.01.2026", amount: "€8.100,00" },
  { month: "Dezember 2025", period: "01.12. – 31.12.2025", amount: "€9.400,00" },
  { month: "November 2025", period: "01.11. – 30.11.2025", amount: "€8.200,00" },
];

const tabs = ["Profitabilität", "Auszahlungen"] as const;
type Tab = (typeof tabs)[number];

export default function Finanzen() {
  const [tab, setTab] = useState<Tab>("Profitabilität");
  const { openChat } = useArbioChat();

  return (
    <div className="relative min-h-screen px-8 py-6 pb-32">
      <h1 className="text-[22px]">Finanzen</h1>
      <p className="text-[15px] text-muted mt-1">
        Dein P&L, deine Auszahlungen und Abrechnungen im Überblick
      </p>

      {/* Tabs + filters */}
      <div className="flex items-center gap-3 mt-5 mb-6 flex-wrap">
        <div className="flex items-center border border-line rounded-full p-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-5 py-1.5 text-[15px] ${
                tab === t
                  ? "bg-white border border-line shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                  : "text-muted"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button className="flex items-center gap-2 border border-line rounded-full px-5 py-2.5 text-[15px]">
          <MapPin size={15} />
          Alle Einheiten
          <ChevronDown size={15} className="text-muted" />
        </button>
        <button className="flex items-center gap-2 border border-line rounded-full px-5 py-2.5 text-[15px]">
          <Calendar size={15} />
          Dieser Monat
          <ChevronDown size={15} className="text-muted" />
        </button>
      </div>

      {tab === "Profitabilität" ? (
        <>
          {/* KPI grid + AI card */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.15fr] gap-4">
            <div className="grid grid-cols-2 gap-4">
              <KpiCard label="Bruttoumsatz (GBV)" value="€41,5k" delta="7,6% vs. Vorjahr" deltaDirection="up" />
              <KpiCard label="Nettoumsatz" value="€38,7k" subline="nach USt. + Beh.steuer" />
              <KpiCard label="Contribution Margin" value="86,0%" subline="vom Nettoumsatz" />
              <KpiCard label="Operativer Gewinn" value="€33,1k" subline="nach allen Kosten" />
            </div>
            <AiCard
              title="Arbio Zusammenfassung"
              rows={[
                {
                  label: "Kostenentwicklung",
                  text: "Die Gesamtkosten stiegen saisonal bedingt auf 5628 €, getrieben durch 5407 € OTA-Provisionen.",
                },
                {
                  label: "Margenentwicklung",
                  text: "Die operative Marge bleibt mit starken 85% auf einem hervorragenden Niveau.",
                },
                {
                  label: "Weitere Hinweise",
                  text: "Prüfen Sie die ungewöhnlich niedrigen Reinigungskosten von nur 221 € bei diesem hohen Buchungsvolumen.",
                },
              ]}
              chatHint="Details im Chat fragen"
            />
          </div>

          {/* Profit chart + cost structure */}
          <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-4 mt-5">
            <div className="bg-white border border-line rounded-[24px] p-7 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
              <div className="flex items-start justify-between">
                <h3 className="text-[16px]">Gewinn über Zeit</h3>
                <span className="flex items-center gap-2 text-[13px] text-muted">
                  <span className="w-4 h-[3px] bg-accent inline-block rounded" /> Operativer Gewinn
                </span>
              </div>
              <div className="mt-4">
                <ProfitChart />
              </div>
            </div>
            <div className="bg-white border border-line rounded-[24px] p-7 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
              <div className="flex items-start justify-between">
                <h3 className="text-[16px]">Kostenstruktur</h3>
                <span className="flex items-center gap-1.5 text-[13px] text-muted">
                  <MessageCircle size={13} />
                  % vom GBV
                </span>
              </div>
              <div className="flex flex-col gap-2 mt-5">
                {costs.map(({ label, pct, width }) => (
                  <button
                    key={label}
                    onClick={() =>
                      openChat(costExplainSeed(label === "Reinigung" ? "Reinigung · Test" : label))
                    }
                    className="flex items-center gap-4 px-2 py-2.5 -mx-2 rounded-[12px] hover:bg-panel transition-colors text-left"
                  >
                    <span className="w-[130px] shrink-0 text-[15px]">{label}</span>
                    <div className="flex-1 h-[6px] bg-panel rounded-full overflow-hidden">
                      <div className="h-full bg-[#c9c9c9] rounded-full" style={{ width }} />
                    </div>
                    <span className="w-[52px] text-right text-[15px]">{pct}</span>
                  </button>
                ))}
                <div className="border-t border-line pt-4 flex items-center justify-between">
                  <span className="text-[15px]">Gesamt</span>
                  <span className="text-[15px]">
                    <b>13,6%</b> <span className="text-muted">vom GBV</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* P&L detail */}
          <div className="mt-5">
            <PnlTable />
          </div>
        </>
      ) : (
        <>
          {/* Accumulated payout + AI card */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.15fr] gap-4">
            <div className="bg-panel rounded-[24px] px-8 py-7 flex flex-col">
              <span className="text-[15px]">Aufgelaufene Auszahlung · Juli 2026</span>
              <span className="text-[52px] leading-none tracking-[-1px] mt-3">€18.450</span>
              <span className="flex items-center gap-2 text-[14px] text-muted mt-3">
                <Calendar size={14} />
                Reguläre Auszahlung am 05.08.2026 · kostenlos
              </span>
              <div className="mt-auto pt-6">
                <button className="w-full flex items-center justify-center gap-2.5 bg-[#2a2a2a] text-white rounded-full px-6 py-4 text-[16px] hover:bg-black transition-colors">
                  <Zap size={17} />
                  Sofort auszahlen · 2% Gebühr
                </button>
                <p className="text-[13px] text-muted text-center mt-2.5">
                  Du erhältst €18.081,00 sofort auf dein Konto (Gebühr: €369,00)
                </p>
              </div>
            </div>
            <AiCard
              title="Deine Auszahlungen. Auf einen Blick."
              rows={[
                {
                  label: "Signal",
                  text: "Bereits 18.450 € für Juli aufgelaufen — 12 % über dem Vormonat zum gleichen Stichtag.",
                },
                {
                  label: "Treiber",
                  text: "Starke Sommerbelegung und eine höhere Durchschnittsrate treiben die Auszahlung.",
                },
                {
                  label: "Empfehlung",
                  text: "Die reguläre Auszahlung am 05.08. ist kostenlos — eine Sofortauszahlung kostet dich aktuell 369 €.",
                },
              ]}
              chatHint="Details im Chat fragen"
            />
          </div>

          {/* Payout status tracker */}
          <div className="bg-white border border-line rounded-[24px] p-7 mt-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
            <div className="flex items-start justify-between">
              <h3 className="text-[16px]">Auszahlungs-Status</h3>
              <span className="flex items-center gap-1.5 text-[13px] text-muted">
                <MessageCircle size={13} />
                Klick öffnet Details im Chat
              </span>
            </div>
            <div className="flex flex-col mt-2">
              {payoutTrackers.map(({ title, amount, steps, seed }, ti) => (
                <button
                  key={title}
                  onClick={() => openChat(seed)}
                  className={`text-left px-3 py-5 -mx-3 rounded-[16px] hover:bg-panel transition-colors ${
                    ti > 0 ? "border-t border-line" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[15px]">{title}</span>
                    <span className="text-[15px]">{amount}</span>
                  </div>
                  <div className="flex items-center mt-4">
                    {steps.map((s, si) => (
                      <div key={si} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-start">
                          <span
                            className={`w-7 h-7 rounded-full flex items-center justify-center ${
                              s.state === "done"
                                ? "bg-[#dcebd4] text-[#3c5f33]"
                                : s.state === "current"
                                  ? "border-2 border-accent text-accent-text"
                                  : "border border-line text-muted"
                            }`}
                          >
                            {s.state === "done" ? (
                              <Check size={14} />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            )}
                          </span>
                          <span
                            className={`text-[13px] mt-2 whitespace-nowrap ${
                              s.state === "pending" ? "text-muted" : ""
                            }`}
                          >
                            {s.label}
                          </span>
                          {s.meta && (
                            <span className="text-[12px] text-muted mt-0.5">{s.meta}</span>
                          )}
                        </div>
                        {si < steps.length - 1 && (
                          <span
                            className={`flex-1 h-[2px] mx-3 -mt-9 ${
                              s.state === "done" ? "bg-[#dcebd4]" : "bg-line"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Payout history chart */}
          <div className="bg-white border border-line rounded-[24px] p-7 mt-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[16px]">Auszahlungen der letzten Monate</h3>
                <p className="text-[13px] text-muted mt-0.5">Aug 2025 – Jul 2026</p>
              </div>
              <div className="flex gap-5 text-[13px] text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#b9d9ae] inline-block" /> Ausgezahlt
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" /> Aufgelaufen (Juli)
                </span>
              </div>
            </div>
            <div className="mt-4">
              <PayoutChart />
            </div>
          </div>

          {/* Owner statements */}
          <div className="bg-white border border-line rounded-[24px] p-7 mt-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
            <div className="flex items-start justify-between">
              <h3 className="text-[16px]">Owner Statements</h3>
              <span className="text-[13px] text-muted">PDF-Download</span>
            </div>
            <div className="mt-4 flex flex-col">
              {statements.map(({ month, period, amount }, i) => (
                <div
                  key={month}
                  className={`flex items-center gap-4 py-3.5 ${
                    i > 0 ? "border-t border-line" : ""
                  }`}
                >
                  <span className="w-10 h-10 rounded-full bg-panel flex items-center justify-center text-muted shrink-0">
                    <FileText size={16} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px]">Owner Statement · {month}</div>
                    <div className="text-[13px] text-muted">{period}</div>
                  </div>
                  <span className="text-[15px] w-[110px] text-right">{amount}</span>
                  <button className="flex items-center gap-2 border border-line rounded-full px-4 py-2 text-[14px] hover:bg-panel">
                    <Download size={14} />
                    PDF
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Floating chat */}
      <div className="fixed bottom-6 left-[290px] right-0 flex justify-center px-8 pointer-events-none">
        <ChatInput
          placeholder={
            tab === "Profitabilität"
              ? "Frag alles über deine Profitabilität..."
              : "Frag alles über deine Auszahlungen..."
          }
          className="w-full max-w-[620px] pointer-events-auto"
        />
      </div>
    </div>
  );
}
