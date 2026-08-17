"use client";

import { useEffect, useRef, useState } from "react";
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
    type: "line",
    label: t("Arbio Management-Fee", "Arbio management fee"),
    key: "Arbio Management-Fee",
    negative: true,
    values: ["–€201", "–€218", "–€531", "–€3.120", "–€3.587", "–€4.004", "–€5.811"],
  },
  {
    type: "total",
    label: t("Contribution Margin", "Contribution margin"),
    sub: t("71,0% vom Nettoumsatz", "71.0% of net revenue"),
    values: ["€1.005", "€1.012", "€2.462", "€15.020", "€16.570", "€18.716", "€27.521"],
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
    values: ["€1.005", "€1.012", "€2.462", "€15.020", "€16.570", "€18.716", "€27.300"],
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
    values: ["–€1.630", "–€1.623", "–€173", "€12.385", "€13.935", "€16.081", "€24.665"],
  },
];

export function PnlTable() {
  const { openChat } = useArbioChat();
  const { lang, t } = useLang();
  const months = buildMonths(lang);
  const rows = buildRows(t);
  // Mobile shows one month at a time — seven columns never fit a phone.
  // The months are horizontal snap panels: swipe to change month.
  const [mIdx, setMIdx] = useState(months.length - 1);
  const monthScroller = useRef<HTMLDivElement>(null);

  // Start on the current (last) month.
  useEffect(() => {
    const el = monthScroller.current;
    if (el) el.scrollLeft = el.clientWidth * (months.length - 1);
  }, [months.length]);

  const onMonthScroll = () => {
    const el = monthScroller.current;
    if (!el || el.clientWidth === 0) return;
    const idx = Math.min(months.length - 1, Math.max(0, Math.round(el.scrollLeft / el.clientWidth)));
    if (idx !== mIdx) setMIdx(idx);
  };

  const stepMonth = (dir: 1 | -1) => {
    const el = monthScroller.current;
    if (!el) return;
    const next = Math.min(months.length - 1, Math.max(0, mIdx + dir));
    el.scrollTo({ left: el.clientWidth * next, behavior: "smooth" });
    setMIdx(next);
  };

  return (
    <div className="bg-white border border-line rounded-[24px] p-5 md:p-7 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between">
        <h3 className="text-[16px] font-medium">{t("P&L Übersicht", "P&L overview")}</h3>
        <div className="hidden md:flex items-center gap-3">
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

      <div className="md:hidden mt-4">
        <div className="flex items-center justify-between mb-1">
          <button
            onClick={() => stepMonth(-1)}
            disabled={mIdx === 0}
            className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-muted disabled:opacity-30"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="text-[14px]">
            {months[mIdx]}
            {mIdx === months.length - 1 && (
              <span className="bg-[#2a2a2a] text-white rounded-full px-2 py-0.5 text-[10px] tracking-[1px] ml-2">
                {t("Jetzt", "Now")}
              </span>
            )}
          </span>
          <button
            onClick={() => stepMonth(1)}
            disabled={mIdx === months.length - 1}
            className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-muted disabled:opacity-30"
          >
            <ChevronRight size={15} />
          </button>
        </div>

        {/* Swipeable months: one full-width snap panel per month */}
        <div
          ref={monthScroller}
          onScroll={onMonthScroll}
          className="flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {months.map((m, mi) => (
            <div key={m} className="w-full shrink-0 snap-center">
              {rows.map((row, ri) =>
                row.type === "section" ? (
                  <div key={ri} className="bg-[#fafafa] rounded-[10px] px-3 py-2 text-[12px] tracking-[1.5px] uppercase text-muted mt-4">
                    {row.label}
                  </div>
                ) : (
                  <button
                    key={ri}
                    onClick={row.type === "line" ? () => openChat(costExplainSeed(row.key ?? row.label, t)) : undefined}
                    className={`w-full flex items-baseline justify-between gap-4 px-1 py-3 text-left ${
                      row.type === "total" ? "border-t border-line" : ""
                    }`}
                  >
                    <span className="min-w-0">
                      <span className={`text-[15px] ${row.type === "total" ? "font-medium" : ""}`}>{row.label}</span>
                      {row.sub && <span className="block text-[12px] text-muted mt-0.5">{row.sub}</span>}
                    </span>
                    <span
                      className={`text-[15px] whitespace-nowrap ${
                        row.values[mi] === null
                          ? "text-line"
                          : row.type === "total"
                            ? row.signed
                              ? row.values[mi]!.startsWith("\u2013")
                                ? "text-negative"
                                : "text-accent-text"
                              : "text-foreground"
                            : row.negative
                              ? "text-negative"
                              : ""
                      }`}
                    >
                      {row.values[mi] ?? "\u2013"}
                    </span>
                  </button>
                )
              )}
            </div>
          ))}
        </div>

        {/* month dots */}
        <div className="flex justify-center gap-1.5 mt-4">
          {months.map((m, mi) => (
            <span
              key={m}
              className={`h-1.5 rounded-full transition-all ${
                mi === mIdx ? "w-5 bg-[#2a2a2a]" : "w-1.5 bg-line"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="hidden md:block overflow-x-auto mt-4">
        <table className="w-full min-w-[900px] border-separate [border-spacing:0]">
          <thead>
            <tr>
              <th className="w-[230px] sticky left-0 z-10 bg-white border-r border-line shadow-[6px_0_8px_-6px_rgba(0,0,0,0.10)]" />
              {months.map((m, i) => (
                <th
                  key={m}
                  className="text-right pb-3 text-[12px] font-normal tracking-[1.5px] uppercase text-muted whitespace-nowrap"
                >
                  {i === months.length - 1 ? (
                    <span className="text-foreground">
                      {m}{" "}
                      <span className="bg-[#2a2a2a] text-white rounded-full px-2 py-0.5 text-[10px] tracking-[1px]">
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
                  <td className="pt-4 pb-0 sticky left-0 z-10 bg-white border-r border-line shadow-[6px_0_8px_-6px_rgba(0,0,0,0.10)]">
                    <div className="bg-[#fafafa] rounded-l-[10px] px-3 py-2 text-[12px] tracking-[1.5px] uppercase text-muted whitespace-nowrap">
                      {row.label}
                    </div>
                  </td>
                  <td colSpan={months.length} className="pt-4 pb-0">
                    <div className="bg-[#fafafa] px-3 py-2 text-[12px]">&nbsp;</div>
                  </td>
                </tr>
              ) : (
                <tr
                  key={ri}
                  onClick={row.type === "line" ? () => openChat(costExplainSeed(row.key ?? row.label, t)) : undefined}
                  className={`group ${
                    row.type === "line" ? "cursor-pointer hover:bg-panel transition-colors" : ""
                  }`}
                >
                  <td className={`py-3 pr-4 pl-2 sticky left-0 z-10 bg-white group-hover:bg-panel transition-colors border-r border-line shadow-[6px_0_8px_-6px_rgba(0,0,0,0.10)] ${row.type === "total" ? "border-t border-line" : ""}`}>
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
                      className={`py-3 text-right text-[15px] whitespace-nowrap ${row.type === "total" ? "border-t border-line" : ""} ${
                        v === null
                          ? "text-line"
                          : row.type === "total"
                            ? row.signed
                              ? v.startsWith("–")
                                ? "text-negative"
                                : "text-accent-text"
                              : "text-foreground"
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
