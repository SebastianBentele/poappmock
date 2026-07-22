"use client";

import { useState } from "react";
import {
  Calendar,
  Zap,
  Download,
  FileText,
  Check,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import { AiCard } from "@/components/ai-card";
import { ChatInput } from "@/components/chat-input";
import { FilterBar } from "@/components/filter-bar";
import { ProfitChart, PayoutChart } from "@/components/charts";
import { PnlTable } from "@/components/pnl-table";
import { OwnerCosts } from "@/components/owner-costs";
import { useArbioChat, costExplainSeed, type Msg, type Tr } from "@/components/arbio-chat";
import { useLang } from "@/components/lang";
import { AskAi } from "@/components/ask-ai";

const buildPayoutTrackers = (t: Tr): {
  title: string;
  amount: string;
  steps: { label: string; meta?: string; state: "done" | "current" | "pending" }[];
  seed: Msg[];
}[] => [
  {
    title: t("Auszahlung Juni 2026", "Payout June 2026"),
    amount: "€34.900",
    steps: [
      { label: t("Abrechnung erstellt", "Statement created"), meta: "01.07.", state: "done" },
      { label: t("Freigegeben", "Released"), meta: "03.07.", state: "done" },
      { label: t("Überwiesen", "Transferred"), meta: "05.07.", state: "done" },
      { label: t("Eingang", "Arrival"), meta: t("vsl. 07.07.", "est. Jul 7"), state: "current" },
    ],
    seed: [
      { kind: "user", text: t("Wo steht meine Juni-Auszahlung gerade?", "Where does my June payout stand right now?") },
      {
        kind: "bot",
        text: t(
          "Deine Juni-Auszahlung über €34.900 ist unterwegs: Abrechnung erstellt am 01.07., freigegeben am 03.07., überwiesen am 05.07. per SEPA. Der Eingang auf deinem Konto ist voraussichtlich am 07.07. (1–2 Bankarbeitstage). Sag Bescheid, falls sie bis 08.07. nicht angekommen ist — dann prüfe ich die Überweisung direkt.",
          "Your June payout of €34,900 is on its way: statement created Jul 1, released Jul 3, transferred Jul 5 via SEPA. Arrival in your account is expected on Jul 7 (1–2 banking days). Let me know if it hasn't arrived by Jul 8 — then I'll check the transfer directly."
        ),
      },
    ],
  },
  {
    title: t("Auszahlung Juli 2026", "Payout July 2026"),
    amount: t("€18.450 aufgelaufen", "€18,450 accrued"),
    steps: [
      { label: t("Läuft auf", "Accruing"), meta: t("bis 31.07.", "until Jul 31"), state: "current" },
      { label: t("Abrechnung", "Statement"), meta: "01.08.", state: "pending" },
      { label: t("Freigabe", "Release"), meta: "03.08.", state: "pending" },
      { label: t("Auszahlung", "Payout"), meta: "05.08.", state: "pending" },
    ],
    seed: [
      { kind: "user", text: t("Wann kommt meine Juli-Auszahlung?", "When is my July payout coming?") },
      {
        kind: "bot",
        text: t(
          "Für Juli sind bisher €18.450 aufgelaufen — der Monat läuft noch bis 31.07. Danach läuft alles automatisch: Abrechnung am 01.08., Freigabe am 03.08., Auszahlung am 05.08. (kostenlos), du musst nichts tun. Falls du den Betrag früher benötigst, steht dir jederzeit die Sofortauszahlung zur Verfügung (2% Gebühr, €369).",
          "€18,450 have accrued for July so far — the month runs until Jul 31. After that everything is automatic: statement Aug 1, release Aug 3, payout Aug 5 (free), you don't need to do anything. If you need the amount sooner, instant payout is available anytime (2% fee, €369)."
        ),
      },
    ],
  },
];

const buildCosts = (t: Tr) => [
  { label: t("OTA-Provision", "OTA commission"), key: "OTA-Provision", pct: "13,0%", width: "72%" },
  { label: t("Reinigung", "Cleaning"), key: "Reinigung · Test", pct: "0,5%", width: "6%" },
];

const buildStatements = (t: Tr) => [
  { month: t("Juni 2026", "June 2026"), period: "01.06. – 30.06.2026", amount: "€34.900,00" },
  { month: t("Mai 2026", "May 2026"), period: "01.05. – 31.05.2026", amount: "€30.400,00" },
  { month: t("April 2026", "April 2026"), period: "01.04. – 30.04.2026", amount: "€26.800,00" },
  { month: t("März 2026", "March 2026"), period: "01.03. – 31.03.2026", amount: "€21.500,00" },
  { month: t("Februar 2026", "February 2026"), period: "01.02. – 28.02.2026", amount: "€11.600,00" },
  { month: t("Januar 2026", "January 2026"), period: "01.01. – 31.01.2026", amount: "€8.100,00" },
  { month: t("Dezember 2025", "December 2025"), period: "01.12. – 31.12.2025", amount: "€9.400,00" },
  { month: t("November 2025", "November 2025"), period: "01.11. – 30.11.2025", amount: "€8.200,00" },
];

type Tab = "profit" | "payouts" | "costs";

export default function Finanzen() {
  const [tab, setTab] = useState<Tab>("profit");
  const { openChat } = useArbioChat();
  const { t } = useLang();

  const tabs: { key: Tab; label: string }[] = [
    { key: "profit", label: t("Profitabilität", "Profitability") },
    { key: "payouts", label: t("Auszahlungen", "Payouts") },
    { key: "costs", label: t("Kosten", "Costs") },
  ];
  const payoutTrackers = buildPayoutTrackers(t);
  const costs = buildCosts(t);
  const statements = buildStatements(t);

  // Margin funnel: how gross booking value turns into operating profit
  const funnel: {
    label: string;
    value: string;
    sub: string;
    deduction?: string;
    highlight?: boolean;
  }[] = [
    { label: t("Bruttoumsatz (GBV)", "Gross Booking Value"), value: "€41,5k", sub: t("Buchungsvolumen", "Booking volume") },
    { label: t("Nettoumsatz", "Net revenue"), value: "€38,7k", sub: t("nach USt. + Beh.steuer", "after VAT + accom. tax"), deduction: "− €2,8k" },
    { label: t("Operativer Gewinn", "Operating profit"), value: "€33,1k", sub: t("80% operative Marge", "80% operating margin"), deduction: t("− €5,6k Kosten", "− €5.6k costs"), highlight: true },
  ];

  return (
    <div className="relative min-h-screen px-8 py-6 pb-32">
      {/* Tabs + filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex items-center border border-line rounded-full p-1">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`rounded-full px-5 py-1.5 text-[15px] ${
                tab === key
                  ? "bg-white border border-line shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                  : "text-muted"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <FilterBar showStepper={false} />
      </div>

      {tab === "profit" ? (
        <>
          {/* Profit hero — the profit graph front and center */}
          <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-4">
            <div className="group relative bg-[#eef5eb] rounded-[24px] p-7 flex flex-col">
              <AskAi label={t("Operativer Gewinn", "Operating profit")} />
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[15px] text-accent-text">{t("Operativer Gewinn · Juli 2026", "Operating profit · July 2026")}</span>
                  <div className="flex items-end gap-3 mt-2">
                    <span className="text-[54px] leading-none tracking-[-1.5px]">€33,1k</span>
                    <span className="text-[16px] text-accent-text mb-1.5">▲ {t("7,6% vs. Vorjahr", "7.6% vs. last year")}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    <span className="rounded-full bg-white px-3.5 py-1.5 text-[13px]">{t("86,0% Deckungsbeitrag", "86.0% contribution margin")}</span>
                    <span className="rounded-full bg-white px-3.5 py-1.5 text-[13px]">{t("80% operative Marge", "80% operating margin")}</span>
                  </div>
                </div>
                <span className="flex items-center gap-2 text-[13px] text-muted shrink-0">
                  <span className="w-4 h-[3px] bg-accent inline-block rounded" /> {t("Gewinn über Zeit", "Profit over time")}
                </span>
              </div>
              <div className="bg-white rounded-[18px] p-4 mt-6">
                <ProfitChart />
              </div>
            </div>
            <AiCard
              title={t("Arbio Zusammenfassung", "Arbio summary")}
              rows={[
                {
                  label: t("Ergebnis", "Result"),
                  text: t(
                    "Deine operative Marge liegt bei starken 85 % — deine Immobilien wirtschaften hervorragend mit Arbio.",
                    "Your operating margin is a strong 85% — your properties are performing excellently with Arbio."
                  ),
                },
                {
                  label: t("Warum", "Why"),
                  text: t(
                    "Die Gesamtkosten stiegen saisonal bedingt auf 5.628 € (davon 5.407 € OTA-Provision) — dein Umsatz wuchs schneller als die Kosten.",
                    "Total costs rose seasonally to €5,628 (of which €5,407 OTA commission) — your revenue grew faster than costs."
                  ),
                },
                {
                  label: t("Arbio kümmert sich", "Arbio takes care of it"),
                  text: t(
                    "Wir prüfen gerade die Reinigungsbelege für Juli auf Vollständigkeit — du bekommst eine Nachricht, sobald alle erfasst sind.",
                    "We're currently checking the July cleaning receipts for completeness — you'll get a message once they're all captured."
                  ),
                },
              ]}
              chatHint={t("Details im Chat fragen", "Ask for details in chat")}
            />
          </div>

          {/* Margin funnel — from revenue to profit (P&L-native, not on the revenue page) */}
          <div className="bg-white border border-line rounded-[24px] p-7 mt-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
            <div className="flex items-start justify-between">
              <h3 className="text-[16px]">{t("Vom Umsatz zum Gewinn", "From revenue to profit")}</h3>
              <span className="text-[13px] text-muted">{t("Juli 2026", "July 2026")}</span>
            </div>
            <div className="flex flex-col xl:flex-row xl:items-stretch gap-3 mt-6">
              {funnel.map((s, i) => (
                <div key={s.label} className="flex flex-col xl:flex-row xl:items-center gap-3 xl:flex-1">
                  {i > 0 && (
                    <div className="flex xl:flex-col items-center justify-center gap-1.5 text-muted shrink-0 xl:px-1">
                      <ChevronRight size={20} className="rotate-90 xl:rotate-0" />
                      <span className="text-[12px] whitespace-nowrap">{s.deduction}</span>
                    </div>
                  )}
                  <div
                    className={`flex-1 rounded-[20px] px-6 py-5 ${
                      s.highlight ? "bg-[#eef5eb]" : "bg-panel"
                    }`}
                  >
                    <div className="text-[14px] text-muted">{s.label}</div>
                    <div
                      className={`text-[32px] tracking-[-0.5px] mt-1 ${
                        s.highlight ? "text-accent-text" : ""
                      }`}
                    >
                      {s.value}
                    </div>
                    <div className="text-[13px] text-muted mt-1">{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cost structure */}
          <div className="group relative bg-white border border-line rounded-[24px] p-7 mt-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
            <AskAi label={t("Kostenstruktur", "Cost structure")} />
            <div className="flex items-start justify-between">
              <h3 className="text-[16px]">{t("Kostenstruktur", "Cost structure")}</h3>
              <span className="flex items-center gap-1.5 text-[13px] text-muted">
                <MessageCircle size={13} />
                {t("% vom GBV · Klick öffnet Details", "% of GBV · click opens details")}
              </span>
            </div>
            <div className="flex flex-col gap-2 mt-5">
              {costs.map(({ label, key, pct, width }) => (
                <button
                  key={key}
                  onClick={() => openChat(costExplainSeed(key, t))}
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
                <span className="text-[15px]">{t("Gesamt", "Total")}</span>
                <span className="text-[15px]">
                  <b>13,6%</b> <span className="text-muted">{t("vom GBV", "of GBV")}</span>
                </span>
              </div>
            </div>
          </div>

          {/* P&L detail */}
          <div className="mt-5">
            <PnlTable />
          </div>
        </>
      ) : tab === "payouts" ? (
        <>
          {/* Accumulated payout + AI card */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.15fr] gap-4">
            <div className="bg-panel rounded-[24px] px-8 py-7 flex flex-col">
              <span className="text-[15px]">{t("Aufgelaufene Auszahlung · Juli 2026", "Accrued payout · July 2026")}</span>
              <span className="text-[52px] leading-none tracking-[-1px] mt-3">€18.450</span>
              <span className="flex items-center gap-2 text-[14px] text-muted mt-3">
                <Calendar size={14} />
                {t("Reguläre Auszahlung am 05.08.2026 · kostenlos", "Regular payout on Aug 5, 2026 · free")}
              </span>
              <div className="mt-auto pt-6">
                <button className="w-full flex items-center justify-center gap-2.5 bg-[#2a2a2a] text-white rounded-full px-6 py-4 text-[16px] hover:bg-black transition-colors">
                  <Zap size={17} />
                  {t("Sofort auszahlen · 2% Gebühr", "Pay out instantly · 2% fee")}
                </button>
                <p className="text-[13px] text-muted text-center mt-2.5">
                  {t("Du erhältst €18.081,00 sofort auf dein Konto (Gebühr: €369,00)", "You receive €18,081.00 instantly to your account (fee: €369.00)")}
                </p>
              </div>
            </div>
            <AiCard
              title={t("Deine Auszahlungen. Auf einen Blick.", "Your payouts. At a glance.")}
              rows={[
                {
                  label: t("Ergebnis", "Result"),
                  text: t(
                    "Bereits 18.450 € für Juli aufgelaufen — 12 % über dem Vormonat zum gleichen Stichtag.",
                    "Already €18,450 accrued for July — 12% above the previous month at the same date."
                  ),
                },
                {
                  label: t("Warum", "Why"),
                  text: t(
                    "Starke Sommerbelegung und eine höhere Durchschnittsrate treiben deine Auszahlung.",
                    "Strong summer occupancy and a higher average rate are driving your payout."
                  ),
                },
                {
                  label: t("Arbio kümmert sich", "Arbio takes care of it"),
                  text: t(
                    "Deine Juni-Auszahlung (34.900 €) ist unterwegs — Eingang vsl. 07.07. Alles läuft planmäßig, du musst nichts tun.",
                    "Your June payout (€34,900) is on its way — arrival est. Jul 7. Everything is on schedule, you don't need to do anything."
                  ),
                },
              ]}
              chatHint={t("Details im Chat fragen", "Ask for details in chat")}
            />
          </div>

          {/* Payout status tracker */}
          <div className="bg-white border border-line rounded-[24px] p-7 mt-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
            <div className="flex items-start justify-between">
              <h3 className="text-[16px]">{t("Auszahlungs-Status", "Payout status")}</h3>
              <span className="flex items-center gap-1.5 text-[13px] text-muted">
                <MessageCircle size={13} />
                {t("Klick öffnet Details im Chat", "Click opens details in chat")}
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
          <div className="group relative bg-white border border-line rounded-[24px] p-7 mt-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
            <AskAi label={t("Auszahlungen der letzten Monate", "Payouts of recent months")} />
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[16px]">{t("Auszahlungen der letzten Monate", "Payouts of recent months")}</h3>
                <p className="text-[13px] text-muted mt-0.5">Aug 2025 – Jul 2026</p>
              </div>
              <div className="flex gap-5 text-[13px] text-muted">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#b9d9ae] inline-block" /> {t("Ausgezahlt", "Paid out")}
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" /> {t("Aufgelaufen (Juli)", "Accrued (July)")}
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
              <h3 className="text-[16px]">{t("Owner Statements", "Owner statements")}</h3>
              <span className="text-[13px] text-muted">{t("PDF-Download", "PDF download")}</span>
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
                    <div className="text-[15px]">{t("Owner Statement", "Owner statement")} · {month}</div>
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
      ) : (
        <OwnerCosts />
      )}

      {/* Floating chat */}
      <div className="fixed bottom-6 left-[var(--sidebar-w)] right-0 flex justify-center px-8 pointer-events-none transition-[left] duration-200 ease-out">
        <ChatInput
          placeholder={
            tab === "profit"
              ? t("Frag alles über deine Profitabilität...", "Ask anything about your profitability...")
              : tab === "payouts"
                ? t("Frag alles über deine Auszahlungen...", "Ask anything about your payouts...")
                : t("Frag alles über deine Kosten...", "Ask anything about your costs...")
          }
          className="w-full max-w-[620px] pointer-events-auto"
        />
      </div>
    </div>
  );
}
