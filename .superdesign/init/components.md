# Shared UI components (full source)

Framework: Next.js 16 (App Router) · React 19 · Tailwind v4 (CSS-first config, no tailwind.config) · lucide-react icons · recharts. No component library — custom primitives only. German-first UI with a DE/EN toggle (lang.tsx `t()`).


### `src/components/kpi-card.tsx`

```tsx
import { AskAi } from "@/components/ask-ai";

export function KpiCard({
  label,
  value,
  delta,
  deltaDirection,
  subline,
  metric,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaDirection?: "up" | "down";
  subline?: string;
  metric: string;
}) {
  return (
    <div className="group relative bg-panel rounded-[24px] px-7 py-6 flex flex-col gap-3">
      <AskAi metric={metric} />
      <span className="text-[15px]">{label}</span>
      <span className="text-[42px] leading-none tracking-[-1px]">{value}</span>
      {delta && (
        <span
          className={`text-[16px] ${
            deltaDirection === "down" ? "text-negative" : "text-accent-text"
          }`}
        >
          {deltaDirection === "down" ? "▼" : "▲"} {delta}
        </span>
      )}
      {subline && <span className="text-[14px] text-muted">{subline}</span>}
    </div>
  );
}

```


### `src/components/ai-card.tsx`

```tsx
import { MessageCircle } from "lucide-react";

export function AiCard({
  title,
  rows,
  chatHint,
}: {
  title: string;
  rows: { label: string; text: string }[];
  chatHint: string;
}) {
  return (
    <div
      className="rounded-[24px] p-7 text-white flex flex-col relative overflow-hidden"
      style={{
        background:
          "linear-gradient(120deg, #101114 0%, #1c1e24 45%, #2e3038 80%, #4a4038 100%)",
      }}
    >
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 85% 20%, rgba(160,150,140,0.45), transparent 55%)",
        }}
      />
      <div className="relative flex items-center gap-2.5 mb-5">
        <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-[13px]">
          A
        </span>
        <span className="text-[17px]">{title}</span>
      </div>

      <div className="relative flex flex-col gap-4 flex-1">
        {rows.map(({ label, text }) => (
          <div key={label} className="flex gap-5 text-[15px] leading-snug">
            <span className="w-[150px] shrink-0 text-white/60">{label}</span>
            <span>{text}</span>
          </div>
        ))}
      </div>

      <div className="relative mt-6 flex items-center gap-3 bg-white/10 border border-white/15 rounded-[30px] px-5 py-3 text-white/60 text-[14px]">
        <MessageCircle size={16} />
        <span className="flex-1" />
        <span>{chatHint}</span>
      </div>
    </div>
  );
}

```


### `src/components/chat-input.tsx`

```tsx
"use client";

import { useState } from "react";
import { Mic, ArrowUp, LifeBuoy } from "lucide-react";
import { useLang } from "@/components/lang";
import { useArbioChat, chatUnavailableSeed } from "@/components/arbio-chat";

export function ChatInput({
  placeholder,
  className = "",
  onRequest,
}: {
  placeholder: string;
  className?: string;
  onRequest?: () => void;
}) {
  const { t } = useLang();
  const { openChat } = useArbioChat();
  const [value, setValue] = useState("");

  // Sending from the bar opens the chat with the message and the standard
  // "not functional yet" reply.
  const submit = () => {
    const text = value.trim();
    if (!text) return;
    setValue("");
    openChat(chatUnavailableSeed(text, t));
  };

  return (
    <div
      className={`flex items-center gap-2 bg-white border border-line rounded-[30px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] ${
        onRequest ? "pl-2.5" : "pl-6"
      } pr-2.5 py-2.5 ${className}`}
    >
      {onRequest && (
        <button
          onClick={onRequest}
          className="flex items-center gap-2 shrink-0 rounded-full bg-panel hover:bg-line text-foreground pl-3 pr-4 py-2 text-[15px]"
        >
          <LifeBuoy size={16} />
          {t("Anfrage", "Request")}
        </button>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder={placeholder}
        className={`flex-1 min-w-0 bg-transparent outline-none text-[16px] placeholder:text-muted ${
          onRequest ? "pl-1" : ""
        }`}
      />
      <button className="w-10 h-10 rounded-full flex items-center justify-center text-muted hover:bg-panel">
        <Mic size={18} />
      </button>
      <button
        onClick={submit}
        className="w-10 h-10 rounded-full bg-panel flex items-center justify-center text-muted hover:bg-line"
      >
        <ArrowUp size={18} />
      </button>
    </div>
  );
}

```


### `src/components/ask-ai.tsx`

```tsx
"use client";

import { MessageCircle } from "lucide-react";
import { useArbioChat } from "@/components/arbio-chat";
import { useLang } from "@/components/lang";
import { metricSeed } from "@/components/metric-insights";

/**
 * Small "ask AI" affordance for KPI cards and charts. It sits in the top-right
 * corner of its container and only becomes visible when that container is
 * hovered — the parent must carry `group relative`. Clicking opens the chat and
 * immediately shows a summary for the given metric.
 */
export function AskAi({ metric }: { metric: string }) {
  const { openChat } = useArbioChat();
  const { t } = useLang();

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        openChat(metricSeed(metric, t));
      }}
      aria-label={t("KI fragen", "Ask AI")}
      className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full bg-white border border-line shadow-[0_2px_8px_rgba(0,0,0,0.10)] flex items-center justify-center text-muted hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <MessageCircle size={15} />
    </button>
  );
}

```


### `src/components/filter-bar.tsx`

```tsx
"use client";

import { useState } from "react";
import { Calendar, MapPin, Building2, ChevronDown, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useLang } from "@/components/lang";

const ALL_UNITS = [
  { name: "Altstadt Apartment", city: "Hamburg" },
  { name: "Studio Universität", city: "Hamburg" },
  { name: "Garten Apartment", city: "Hamburg" },
  { name: "Kiez Apartment Prenzlauer Berg", city: "Hamburg" },
  { name: "Altbau Suite Eppendorf", city: "Hamburg" },
];

const CITIES = ["Hamburg"];

type Open = "period" | "units" | "city" | null;

export function FilterBar({ showStepper = true }: { showStepper?: boolean }) {
  const { t } = useLang();
  const [open, setOpen] = useState<Open>(null);
  const [periodIdx, setPeriodIdx] = useState(0);
  const [custom, setCustom] = useState(false);
  const [units, setUnits] = useState<string[]>([]); // empty = all
  const [city, setCity] = useState<string | null>(null);

  const periodPresets = [
    t("Dieser Monat", "This month"),
    t("Letzter Monat", "Last month"),
    t("Dieses Quartal", "This quarter"),
    t("Dieses Jahr", "This year"),
    t("Letzte 12 Monate", "Last 12 months"),
  ];
  const period = custom ? "01.04. – 30.06.2026" : periodPresets[periodIdx];

  const unitLabel =
    units.length === 0
      ? t("Alle Einheiten", "All units")
      : units.length === 1
        ? units[0]
        : t(`${units.length} Einheiten`, `${units.length} units`);

  const toggleUnit = (name: string) =>
    setUnits((u) => (u.includes(name) ? u.filter((x) => x !== name) : [...u, name]));

  // Stepper cycles through the period presets (wraps around, leaves custom mode)
  const stepPeriod = (dir: 1 | -1) => {
    setCustom(false);
    setPeriodIdx((i) => (i + dir + periodPresets.length) % periodPresets.length);
  };

  const close = () => setOpen(null);

  const btn =
    "flex items-center gap-2 border border-line rounded-full h-11 px-5 text-[15px] bg-white hover:bg-panel";

  return (
    <div className="relative flex items-center gap-3 flex-wrap">
      {/* Backdrop to close dropdowns */}
      {open && <div className="fixed inset-0 z-30" onClick={close} />}

      {/* Period */}
      <div className="relative z-40">
        <div className="flex items-center gap-1 border border-line rounded-full bg-white h-11 pl-1 pr-1">
          {showStepper && (
            <button
              onClick={() => stepPeriod(-1)}
              className="w-8 h-8 rounded-full hover:bg-panel flex items-center justify-center text-muted"
            >
              <ChevronLeft size={16} />
            </button>
          )}
          <button
            onClick={() => setOpen(open === "period" ? null : "period")}
            className="flex items-center gap-2 px-3 text-[15px]"
          >
            <Calendar size={15} />
            {period}
            <ChevronDown size={15} className="text-muted" />
          </button>
          {showStepper && (
            <button
              onClick={() => stepPeriod(1)}
              className="w-8 h-8 rounded-full hover:bg-panel flex items-center justify-center text-muted"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>
        {open === "period" && (
          <div className="absolute left-0 top-12 w-[300px] bg-white border border-line rounded-[20px] shadow-[0_16px_50px_rgba(0,0,0,0.14)] p-2 z-40">
            {periodPresets.map((p, pi) => (
              <button
                key={p}
                onClick={() => {
                  setPeriodIdx(pi);
                  setCustom(false);
                  close();
                }}
                className="w-full flex items-center justify-between rounded-[12px] px-4 py-2.5 text-[15px] text-left hover:bg-panel"
              >
                {p}
                {periodIdx === pi && !custom && <Check size={15} className="text-accent-text" />}
              </button>
            ))}
            <div className="border-t border-line mt-2 pt-2">
              <button
                onClick={() => setCustom(true)}
                className="w-full flex items-center justify-between rounded-[12px] px-4 py-2.5 text-[15px] text-left hover:bg-panel"
              >
                {t("Eigener Zeitraum", "Custom period")}
                {custom && <Check size={15} className="text-accent-text" />}
              </button>
              {custom && (
                <div className="px-2 pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="border border-line rounded-[12px] px-3 py-2">
                      <div className="text-[11px] text-muted">{t("Von", "From")}</div>
                      <input
                        type="text"
                        defaultValue="01.04.2026"
                        className="w-full text-[14px] outline-none bg-transparent"
                      />
                    </div>
                    <div className="border border-line rounded-[12px] px-3 py-2">
                      <div className="text-[11px] text-muted">{t("Bis", "To")}</div>
                      <input
                        type="text"
                        defaultValue="30.06.2026"
                        className="w-full text-[14px] outline-none bg-transparent"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => close()}
                    className="w-full mt-2 bg-[#2a2a2a] text-white rounded-full py-2.5 text-[14px] hover:bg-black"
                  >
                    {t("Anwenden", "Apply")}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Units multi-select */}
      <div className="relative z-40">
        <button onClick={() => setOpen(open === "units" ? null : "units")} className={btn}>
          <MapPin size={15} />
          {unitLabel}
          <ChevronDown size={15} className="text-muted" />
        </button>
        {open === "units" && (
          <div className="absolute left-0 top-12 w-[280px] bg-white border border-line rounded-[20px] shadow-[0_16px_50px_rgba(0,0,0,0.14)] p-2 z-40">
            <button
              onClick={() => setUnits([])}
              className="w-full flex items-center justify-between rounded-[12px] px-4 py-2.5 text-[15px] text-left hover:bg-panel"
            >
              {t("Alle Einheiten", "All units")}
              {units.length === 0 && <Check size={15} className="text-accent-text" />}
            </button>
            <div className="border-t border-line mt-1 pt-1">
              {ALL_UNITS.map((u) => (
                <button
                  key={u.name}
                  onClick={() => toggleUnit(u.name)}
                  className="w-full flex items-center gap-3 rounded-[12px] px-4 py-2.5 text-[15px] text-left hover:bg-panel"
                >
                  <span
                    className={`w-4 h-4 rounded-[5px] border flex items-center justify-center shrink-0 ${
                      units.includes(u.name)
                        ? "bg-[#2a2a2a] border-[#2a2a2a] text-white"
                        : "border-line"
                    }`}
                  >
                    {units.includes(u.name) && <Check size={11} />}
                  </span>
                  <span className="flex-1">{u.name}</span>
                  <span className="text-[12px] text-muted">{u.city}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* City */}
      <div className="relative z-40">
        <button onClick={() => setOpen(open === "city" ? null : "city")} className={btn}>
          <Building2 size={15} />
          {city ?? t("Alle Städte", "All cities")}
          <ChevronDown size={15} className="text-muted" />
        </button>
        {open === "city" && (
          <div className="absolute left-0 top-12 w-[220px] bg-white border border-line rounded-[20px] shadow-[0_16px_50px_rgba(0,0,0,0.14)] p-2 z-40">
            <button
              onClick={() => {
                setCity(null);
                close();
              }}
              className="w-full flex items-center justify-between rounded-[12px] px-4 py-2.5 text-[15px] text-left hover:bg-panel"
            >
              {t("Alle Städte", "All cities")}
              {city === null && <Check size={15} className="text-accent-text" />}
            </button>
            {CITIES.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCity(c);
                  close();
                }}
                className="w-full flex items-center justify-between rounded-[12px] px-4 py-2.5 text-[15px] text-left hover:bg-panel"
              >
                {c}
                {city === c && <Check size={15} className="text-accent-text" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

```


### `src/components/lang.tsx`

```tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";

export type Lang = "de" | "en";

const LangCtx = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (de: string, en: string) => string;
}>({ lang: "de", setLang: () => {}, t: (de) => de });

export function useLang() {
  return useContext(LangCtx);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("de");

  useEffect(() => {
    const s = sessionStorage.getItem("arbio-lang");
    if (s === "en" || s === "de") setLangState(s);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    sessionStorage.setItem("arbio-lang", l);
  };

  const t = (de: string, en: string) => (lang === "de" ? de : en);

  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

const LANGS: { code: Lang; label: string }[] = [
  { code: "de", label: "Deutsch" },
  { code: "en", label: "English" },
];

export function LangToggle() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {open && <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />}
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative z-40 flex items-center gap-2 bg-white border border-line rounded-full h-11 pl-3.5 pr-3 shadow-[0_2px_10px_rgba(0,0,0,0.06)] hover:bg-panel transition-colors"
      >
        <Globe size={16} className="text-muted" />
        <span className="text-[14px] font-medium uppercase">{lang}</span>
        <ChevronDown size={15} className="text-muted" />
      </button>
      {open && (
        <div className="absolute right-0 top-[52px] w-[180px] bg-white border border-line rounded-[20px] shadow-[0_16px_50px_rgba(0,0,0,0.14)] p-2 z-40">
          {LANGS.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => {
                setLang(code);
                setOpen(false);
              }}
              className="w-full flex items-center justify-between rounded-[12px] px-4 py-2.5 text-[15px] text-left hover:bg-panel"
            >
              <span className="flex items-center gap-2.5">
                <span className="text-[13px] font-medium uppercase text-muted w-6">{code}</span>
                {label}
              </span>
              {lang === code && <Check size={15} className="text-accent-text" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

```


### `src/components/pnl-table.tsx`

```tsx
"use client";

import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { useArbioChat, costExplainSeed } from "@/components/arbio-chat";
import { useLang, type Lang } from "@/components/lang";

type Row =
  | { type: "section"; label: string }
  | {
      type: "line" | "total";
      label: string;
      key?: string;
      sub?: string;
      values: (string | null)[];
      negative?: boolean;
      signed?: boolean;
    };

const buildMonths = (lang: Lang) =>
  lang === "de"
    ? ["Jan '26", "Feb '26", "Mär '26", "Apr '26", "Mai '26", "Jun '26", "Jul '26"]
    : ["Jan '26", "Feb '26", "Mar '26", "Apr '26", "May '26", "Jun '26", "Jul '26"];

const buildRows = (t: (de: string, en: string) => string): Row[] => [
  { type: "section", label: t("Erlöse", "Revenue") },
  {
    type: "line",
    label: t("Bruttoumsatz (GBV)", "Gross Booking Value (GBV)"),
    key: "Bruttoumsatz (GBV)",
    values: ["€1.435", "€1.551", "€3.786", "€22.254", "€25.588", "€28.563", "€41.451"],
  },
  {
    type: "line",
    label: t("Umsatzsteuer", "VAT"),
    key: "Umsatzsteuer",
    negative: true,
    values: ["–€94", "–€101", "–€248", "–€1.456", "–€1.674", "–€1.869", "–€2.712"],
  },
  {
    type: "total",
    label: t("Nettoumsatz", "Net revenue"),
    values: ["€1.342", "€1.450", "€3.538", "€20.798", "€23.914", "€26.694", "€38.739"],
  },
  { type: "section", label: t("Variable Kosten", "Variable costs") },
  {
    type: "line",
    label: t("OTA-Provision", "OTA commission"),
    key: "OTA-Provision",
    negative: true,
    values: ["–€136", "–€220", "–€545", "–€2.658", "–€3.757", "–€3.974", "–€5.407"],
  },
  {
    type: "total",
    label: t("Contribution Margin", "Contribution margin"),
    sub: t("86,0% vom Nettoumsatz", "86.0% of net revenue"),
    values: ["€1.206", "€1.230", "€2.993", "€18.140", "€20.157", "€22.720", "€33.332"],
  },
  { type: "section", label: t("Fixe Kosten", "Fixed costs") },
  {
    type: "line",
    label: t("Reinigung · Test", "Cleaning · Test"),
    key: "Reinigung · Test",
    negative: true,
    values: [null, null, null, null, null, null, "–€221"],
  },
  {
    type: "total",
    label: t("Operativer Gewinn", "Operating profit"),
    values: ["€1.206", "€1.230", "€2.993", "€18.140", "€20.157", "€22.720", "€33.111"],
  },
  { type: "section", label: t("Eigene Kosten · von dir gepflegt", "Own costs · maintained by you") },
  {
    type: "line",
    label: t("Miete / Finanzierung", "Rent / financing"),
    key: "Miete / Finanzierung",
    negative: true,
    values: ["–€2.100", "–€2.100", "–€2.100", "–€2.100", "–€2.100", "–€2.100", "–€2.100"],
  },
  {
    type: "line",
    label: t("Versicherung", "Insurance"),
    key: "Versicherung",
    negative: true,
    values: ["–€245", "–€245", "–€245", "–€245", "–€245", "–€245", "–€245"],
  },
  {
    type: "line",
    label: t("Nebenkosten & Internet", "Utilities & internet"),
    key: "Nebenkosten & Internet",
    negative: true,
    values: ["–€290", "–€290", "–€290", "–€290", "–€290", "–€290", "–€290"],
  },
  {
    type: "total",
    label: t("Echter Netto-Gewinn", "True net profit"),
    sub: t("nach deinen Kosten", "after your costs"),
    signed: true,
    values: ["–€1.429", "–€1.405", "€358", "€15.505", "€17.522", "€20.085", "€30.476"],
  },
];

export function PnlTable() {
  const { openChat } = useArbioChat();
  const { lang, t } = useLang();
  const months = buildMonths(lang);
  const rows = buildRows(t);

  return (
    <div className="bg-white border border-line rounded-[24px] p-7 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between">
        <h3 className="text-[16px] font-medium">{t("P&L Übersicht", "P&L overview")}</h3>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[13px] text-muted">
            <MessageCircle size={13} />
            {t("Position anklicken für Erklärung im Chat", "Click a line for an explanation in chat")}
          </span>
          <span className="text-[14px] text-muted">{t("28 Buchungen · 172 belegte Nächte", "28 bookings · 172 booked nights")}</span>
          <button className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-muted hover:bg-panel">
            <ChevronLeft size={15} />
          </button>
          <button className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-muted hover:bg-panel">
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr>
              <th className="w-[230px]" />
              {months.map((m, i) => (
                <th
                  key={m}
                  className="text-right pb-3 text-[12px] font-normal tracking-[1.5px] uppercase text-muted whitespace-nowrap"
                >
                  {i === months.length - 1 ? (
                    <span className="text-foreground">
                      {m}{" "}
                      <span className="bg-[#d3f2a3] text-[#3c5f33] rounded-md px-1.5 py-0.5 text-[10px] tracking-[1px]">
                        {t("Jetzt", "Now")}
                      </span>
                    </span>
                  ) : (
                    m
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) =>
              row.type === "section" ? (
                <tr key={ri}>
                  <td
                    colSpan={months.length + 1}
                    className="pt-5 pb-2 text-[12px] tracking-[1.5px] uppercase text-muted border-t border-line"
                  >
                    {row.label}
                  </td>
                </tr>
              ) : (
                <tr
                  key={ri}
                  onClick={row.type === "line" ? () => openChat(costExplainSeed(row.key ?? row.label, t)) : undefined}
                  className={`${row.type === "total" ? "border-t border-line" : ""} ${
                    row.type === "line" ? "cursor-pointer hover:bg-panel transition-colors" : ""
                  }`}
                >
                  <td className="py-3 pr-4 pl-2 rounded-l-[10px]">
                    <span className={`text-[15px] ${row.type === "total" ? "font-medium" : ""}`}>
                      {row.label}
                    </span>
                    {row.sub && (
                      <span className="block text-[12px] text-muted mt-0.5">{row.sub}</span>
                    )}
                  </td>
                  {row.values.map((v, vi) => (
                    <td
                      key={vi}
                      className={`py-3 text-right text-[15px] whitespace-nowrap ${
                        v === null
                          ? "text-line"
                          : row.type === "total"
                            ? row.signed && v.startsWith("–")
                              ? "text-negative"
                              : "text-accent-text"
                            : row.negative
                              ? "text-negative"
                              : ""
                      }`}
                    >
                      {v ?? "–"}
                    </td>
                  ))}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

```


### `src/components/charts.tsx`

```tsx
"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ReferenceLine,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
  Tooltip,
} from "recharts";
import { useLang, type Lang } from "@/components/lang";

const GREEN = "#7db86c";
const GREEN_LIGHT = "#b9d9ae";
const GREEN_DARK = "#5f9e50";
const GRAY = "#9a9a9a";
const GRAY_DARK = "#bdbdbd";

// Value formatters shared by axes and tooltips.
const eur = (v: number | string) => `€${Number(v).toLocaleString("de-DE")}`;
const pct = (v: number | string) => `${v}%`;

const LINE_CURSOR = { stroke: "#dcdcdc", strokeWidth: 1 } as const;

type TipEntry = {
  value: number | string | null;
  dataKey?: string | number;
  name?: string;
  color?: string;
  stroke?: string;
};

// On-brand tooltip that shows the actual value on hover. Pass `names`
// (dataKey → label) for multi-series charts; omit it for single-series ones.
// Also drives recharts' hover tracking that highlights the active bar.
function ChartTooltip(props: {
  active?: boolean;
  payload?: TipEntry[];
  label?: string | number;
  fmt?: (v: number) => string;
  names?: Record<string, string>;
  labelFmt?: (l: string | number) => string;
}) {
  const { active, payload, label, fmt = (v) => `${v}`, names, labelFmt } = props;
  if (!active || !payload || payload.length === 0) return null;
  const seen = new Set<string>();
  const rows = payload.filter((p) => {
    const key = String(p.dataKey ?? "");
    if (p.value == null || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  if (rows.length === 0) return null;
  const heading =
    label != null && `${label}` !== "" ? (labelFmt ? labelFmt(label) : `${label}`) : null;
  return (
    <div className="bg-white border border-line rounded-[12px] shadow-[0_8px_30px_rgba(0,0,0,0.14)] px-3.5 py-2.5 text-[13px]">
      {heading != null && heading !== "" && <div className="text-muted mb-1.5">{heading}</div>}
      <div className="flex flex-col gap-1.5">
        {rows.map((p, i) =>
          names ? (
            <div key={i} className="flex items-center gap-2.5">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: p.color || p.stroke || GREEN }}
              />
              <span className="text-muted">{names[String(p.dataKey)] ?? p.name}</span>
              <span className="ml-auto pl-6 font-medium">{fmt(p.value as number)}</span>
            </div>
          ) : (
            <div key={i} className="text-[15px] font-medium">
              {fmt(p.value as number)}
            </div>
          )
        )}
      </div>
    </div>
  );
}

// Month axis labels are stored canonically in English (e.g. "Mar", "Aug '25").
// For German we map the month part back; the year suffix is preserved.
const MONTH_DE: Record<string, string> = {
  Jan: "Jan", Feb: "Feb", Mar: "Mär", Apr: "Apr", May: "Mai", Jun: "Jun",
  Jul: "Jul", Aug: "Aug", Sep: "Sep", Oct: "Okt", Nov: "Nov", Dec: "Dez",
};
const monthTick = (lang: Lang) => (m: string | number) => {
  const s = `${m}`;
  if (lang === "en") return s;
  const [mon, ...rest] = s.split(" ");
  return [MONTH_DE[mon] ?? mon, ...rest].join(" ");
};

const rollingRevenue = [
  { m: "Apr", dj: 21000, fc: null, lj: 6200, vj: 5800 },
  { m: "May", dj: 24500, fc: null, lj: 7400, vj: 6300 },
  { m: "Jun", dj: 29000, fc: null, lj: 6900, vj: 6100 },
  { m: "Jul", dj: 43400, fc: 43400, lj: 7100, vj: 6600 },
  { m: "Aug", dj: null, fc: 39800, lj: 6800, vj: 6400 },
  { m: "Sep", dj: null, fc: 24500, lj: 6500, vj: 6200 },
  { m: "Oct", dj: null, fc: 10800, lj: 6900, vj: 2200 },
  { m: "Nov", dj: null, fc: 1600, lj: 1400, vj: 1300 },
  { m: "Dec", dj: null, fc: 1500, lj: 1600, vj: 1400 },
  { m: "Jan", dj: null, fc: 1400, lj: 1500, vj: 1300 },
  { m: "Feb", dj: null, fc: 1500, lj: 1800, vj: 1400 },
  { m: "Mar", dj: null, fc: 1600, lj: 2100, vj: 1500 },
];

export function RollingRevenueChart() {
  const { lang, t } = useLang();
  return (
    <div className="h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={rollingRevenue} margin={{ top: 24, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="m"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#717171", fontSize: 13 }}
            tickFormatter={monthTick(lang)}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#717171", fontSize: 13 }}
            tickFormatter={(v: number) => (v === 0 ? "€0" : `€${Math.round(v / 1000)}k`)}
            ticks={[0, 17000, 34000, 50000]}
          />
          <ReferenceLine
            x="Jul"
            stroke="#c5c5c5"
            label={{ value: t("Heute", "Today"), position: "top", fill: "#717171", fontSize: 12 }}
          />
          <Tooltip
            cursor={LINE_CURSOR}
            content={
              <ChartTooltip
                fmt={eur}
                labelFmt={monthTick(lang)}
                names={{
                  dj: t("Dieses Jahr", "This year"),
                  fc: t("Forecast", "Forecast"),
                  lj: t("Letztes Jahr", "Last year"),
                  vj: t("Vorjahr", "Prior year"),
                }}
              />
            }
          />
          <Area type="monotone" dataKey="dj" fill="url(#greenFade)" stroke="none" />
          <Line type="monotone" dataKey="dj" stroke={GREEN} strokeWidth={2.5} dot={{ r: 3.5, fill: GREEN }} />
          <Line type="monotone" dataKey="fc" stroke={GREEN} strokeWidth={2} strokeDasharray="6 6" dot={{ r: 3.5, fill: GREEN }} />
          <Line type="monotone" dataKey="lj" stroke={GRAY} strokeWidth={1.5} dot={false} />
          <Line type="monotone" dataKey="vj" stroke={GRAY} strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
          <defs>
            <linearGradient id="greenFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GREEN} stopOpacity={0.25} />
              <stop offset="100%" stopColor={GREEN} stopOpacity={0.02} />
            </linearGradient>
          </defs>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

const dailyRevenue = Array.from({ length: 62 }, (_, i) => {
  const wave = Math.sin(i / 4.5) * 0.4 + 0.9;
  const spike = i % 13 === 0 ? 1.6 : 1;
  return {
    d: i,
    dj: Math.round((420 + ((i * 137) % 700)) * wave * spike),
    vj: Math.round((360 + ((i * 91) % 520)) * wave),
  };
});

export function DailyRevenueChart() {
  const { t } = useLang();
  return (
    <div className="h-[230px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dailyRevenue} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={0}>
          <XAxis dataKey="d" hide />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#717171", fontSize: 13 }}
            tickFormatter={(v: number) => (v === 0 ? "€0" : `€${Math.round(v / 1000)}k`)}
            ticks={[0, 1000, 2000]}
            domain={[0, 2400]}
          />
          <Tooltip
            cursor={false}
            content={
              <ChartTooltip
                fmt={eur}
                labelFmt={() => ""}
                names={{ dj: t("Dieses Jahr", "This year"), vj: t("Vorjahr", "Prior year") }}
              />
            }
          />
          <Bar dataKey="dj" fill={GREEN} radius={[2, 2, 0, 0]} activeBar={{ fill: GREEN_DARK }} />
          <Bar dataKey="vj" fill={GREEN_LIGHT} radius={[2, 2, 0, 0]} activeBar={{ fill: GREEN }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const payouts = [
  { m: "Aug '25", v: 31200, current: false },
  { m: "Sep", v: 27400, current: false },
  { m: "Oct", v: 19800, current: false },
  { m: "Nov", v: 8200, current: false },
  { m: "Dec", v: 9400, current: false },
  { m: "Jan '26", v: 8100, current: false },
  { m: "Feb", v: 11600, current: false },
  { m: "Mar", v: 21500, current: false },
  { m: "Apr", v: 26800, current: false },
  { m: "May", v: 30400, current: false },
  { m: "Jun", v: 34900, current: false },
  { m: "Jul", v: 18450, current: true },
];

export function PayoutChart() {
  const { lang } = useLang();
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={payouts} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="m"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#717171", fontSize: 13 }}
            tickFormatter={monthTick(lang)}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#717171", fontSize: 13 }}
            tickFormatter={(v: number) => (v === 0 ? "€0" : `€${Math.round(v / 1000)}k`)}
            ticks={[0, 12000, 24000, 36000]}
          />
          <Tooltip cursor={false} content={<ChartTooltip fmt={eur} labelFmt={monthTick(lang)} />} />
          <Bar dataKey="v" radius={[10, 10, 10, 10]} activeBar={{ fill: GREEN_DARK }}>
            {payouts.map((p) => (
              <Cell key={p.m} fill={p.current ? GREEN : GREEN_LIGHT} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Two months of daily data (1..30, 1..30), deterministic
const dailyKpis = Array.from({ length: 60 }, (_, i) => {
  const day = (i % 30) + 1;
  const w1 = Math.sin(i / 3.2) * 0.5 + Math.sin(i / 8.5) * 0.3;
  const w2 = Math.sin((i + 9) / 4.1) * 0.55 + Math.sin(i / 11) * 0.35;
  return {
    d: day,
    occDj: Math.round(Math.min(88, Math.max(30, 55 + w1 * 22))),
    occVj: Math.round(Math.min(95, Math.max(22, 48 + w2 * 30))),
    rateDj: Math.round(Math.min(310, Math.max(185, 240 + w1 * 55))),
    rateVj: Math.round(Math.min(250, Math.max(160, 200 + w2 * 28))),
  };
});

function DailyKpiChart({
  djKey,
  vjKey,
  ticks,
  formatter,
  domain,
}: {
  djKey: string;
  vjKey: string;
  ticks: number[];
  formatter: (v: number) => string;
  domain: [number, number];
}) {
  const { t } = useLang();
  return (
    <div className="h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={dailyKpis} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#f0f0f0" />
          <Tooltip
            cursor={LINE_CURSOR}
            content={
              <ChartTooltip
                fmt={formatter}
                labelFmt={(d) => t(`Tag ${d}`, `Day ${d}`)}
                names={{
                  [djKey]: t("Dieses Jahr", "This year"),
                  [vjKey]: t("Vorjahr", "Prior year"),
                }}
              />
            }
          />
          <XAxis
            dataKey="d"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#717171", fontSize: 12 }}
            ticks={[1, 7, 14, 21, 28]}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#717171", fontSize: 12 }}
            ticks={ticks}
            domain={domain}
            tickFormatter={formatter}
          />
          <Area type="monotone" dataKey={djKey} fill="url(#greenFadeDaily)" stroke="none" />
          <Line type="monotone" dataKey={djKey} stroke={GREEN} strokeWidth={2} dot={false} />
          <Line
            type="monotone"
            dataKey={vjKey}
            stroke="#b5b5b5"
            strokeWidth={1.5}
            strokeDasharray="5 5"
            dot={false}
          />
          <defs>
            <linearGradient id="greenFadeDaily" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GREEN} stopOpacity={0.18} />
              <stop offset="100%" stopColor={GREEN} stopOpacity={0.02} />
            </linearGradient>
          </defs>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DailyOccupancyChart() {
  return (
    <DailyKpiChart
      djKey="occDj"
      vjKey="occVj"
      ticks={[0, 25, 50, 75, 100]}
      domain={[0, 100]}
      formatter={(v) => `${v}%`}
    />
  );
}

export function DailyRateChart() {
  return (
    <DailyKpiChart
      djKey="rateDj"
      vjKey="rateVj"
      ticks={[0, 100, 200, 300, 350]}
      domain={[0, 350]}
      formatter={(v) => `€${v}`}
    />
  );
}

const channels = [
  { name: "Booking.com", value: 71.1, color: "#f5455c" },
  { name: "Airbnb", value: 17.0, color: "#1e3a75" },
  { name: "Direct", value: 11.9, color: "#2fbf4f" },
];

export function ChannelDonut() {
  return (
    <div className="relative h-[220px] w-[220px] mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={channels}
            dataKey="value"
            innerRadius={82}
            outerRadius={96}
            startAngle={90}
            endAngle={-270}
            paddingAngle={3}
            cornerRadius={8}
            stroke="none"
          >
            {channels.map((c) => (
              <Cell key={c.name} fill={c.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[30px] tracking-[-0.5px]">€41.451</span>
      </div>
    </div>
  );
}

const tickets = [
  { m: "Feb", gelöst: 28, offen: 2 },
  { m: "Mar", gelöst: 34, offen: 3 },
  { m: "Apr", gelöst: 31, offen: 2 },
  { m: "May", gelöst: 38, offen: 4 },
  { m: "Jun", gelöst: 44, offen: 2 },
  { m: "Jul", gelöst: 41, offen: 3 },
];

export function TicketsChart() {
  const { lang, t } = useLang();
  return (
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={tickets} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="m"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#717171", fontSize: 13 }}
            tickFormatter={monthTick(lang)}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#717171", fontSize: 13 }}
            ticks={[0, 15, 30, 45]}
          />
          <Tooltip
            cursor={false}
            content={
              <ChartTooltip
                fmt={(v) => `${v}`}
                labelFmt={monthTick(lang)}
                names={{ "gelöst": t("Gelöst", "Resolved"), offen: t("Offen", "Open") }}
              />
            }
          />
          <Bar dataKey="gelöst" stackId="t" fill={GREEN_LIGHT} radius={[0, 0, 10, 10]} activeBar={{ fill: GREEN }} />
          <Bar dataKey="offen" stackId="t" fill="#d3d3d3" radius={[10, 10, 0, 0]} activeBar={{ fill: GRAY_DARK }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const profitOverTime = [
  { m: "Aug '25", v: 3200 },
  { m: "Sep", v: 2600 },
  { m: "Oct", v: 1400 },
  { m: "Nov", v: 250 },
  { m: "Dec", v: 480 },
  { m: "Jan '26", v: 380 },
  { m: "Feb", v: 900 },
  { m: "Mar", v: 2100 },
  { m: "Apr", v: 2400 },
  { m: "May", v: 2800 },
  { m: "Jun", v: 3300 },
  { m: "Jul", v: 4300 },
];

export function ProfitChart() {
  const { lang } = useLang();
  return (
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={profitOverTime} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="m"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#717171", fontSize: 13 }}
            tickFormatter={monthTick(lang)}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#717171", fontSize: 13 }}
            tickFormatter={(v: number) => (v === 0 ? "€0" : `€${(v / 1000).toLocaleString("de-DE")}k`)}
            ticks={[0, 2000, 4000]}
            domain={[0, 4600]}
          />
          <Tooltip cursor={false} content={<ChartTooltip fmt={eur} labelFmt={monthTick(lang)} />} />
          <Bar dataKey="v" fill="#b9d9ae" radius={[10, 10, 10, 10]} activeBar={{ fill: GREEN }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Year-on-year revenue trajectory since Arbio took over
const growthByYear = [
  { y: "2023", label: "vor Arbio", v: 198000, pre: true },
  { y: "2024", label: "Jahr 1", v: 246000 },
  { y: "2025", label: "Jahr 2", v: 288000 },
  { y: "2026", label: "YTD", v: 337000, ytd: true },
];

export function GrowthChart() {
  return (
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={growthByYear} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="y"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#717171", fontSize: 13 }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#717171", fontSize: 13 }}
            tickFormatter={(v: number) => `€${Math.round(v / 1000)}k`}
            ticks={[0, 100000, 200000, 300000]}
          />
          <Tooltip cursor={false} content={<ChartTooltip fmt={eur} />} />
          <Bar dataKey="v" radius={[10, 10, 10, 10]} activeBar={{ fill: GREEN_DARK }}>
            {growthByYear.map((d) => (
              <Cell key={d.y} fill={d.pre ? "#d3d3d3" : d.ytd ? GREEN : GREEN_LIGHT} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Length-of-stay distribution
const losShares = [8, 34, 39, 19];

export function LosChart() {
  const { t } = useLang();
  const losBuckets = [
    { b: t("1 Nacht", "1 night"), share: losShares[0] },
    { b: t("2–3 Nächte", "2–3 nights"), share: losShares[1] },
    { b: t("4–6 Nächte", "4–6 nights"), share: losShares[2] },
    { b: t("7+ Nächte", "7+ nights"), share: losShares[3] },
  ];
  return (
    <div className="h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={losBuckets} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="b"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#717171", fontSize: 13 }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#717171", fontSize: 13 }}
            tickFormatter={(v: number) => `${v}%`}
            ticks={[0, 20, 40]}
          />
          <Tooltip cursor={false} content={<ChartTooltip fmt={pct} />} />
          <Bar dataKey="share" radius={[10, 10, 10, 10]} activeBar={{ fill: GREEN_DARK }}>
            {losBuckets.map((d) => (
              <Cell key={d.b} fill={d.share >= 39 ? GREEN : GREEN_LIGHT} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

```
