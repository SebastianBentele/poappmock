"use client";

import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { useArbioChat, costExplainSeed } from "@/components/arbio-chat";

const months = ["Jan '26", "Feb '26", "Mär '26", "Apr '26", "Mai '26", "Jun '26", "Jul '26"];

type Row =
  | { type: "section"; label: string }
  | {
      type: "line" | "total";
      label: string;
      sub?: string;
      values: (string | null)[];
      negative?: boolean;
    };

const rows: Row[] = [
  { type: "section", label: "Erlöse" },
  {
    type: "line",
    label: "Bruttoumsatz (GBV)",
    values: ["€1.435", "€1.551", "€3.786", "€22.254", "€25.588", "€28.563", "€41.451"],
  },
  {
    type: "line",
    label: "Umsatzsteuer",
    negative: true,
    values: ["–€94", "–€101", "–€248", "–€1.456", "–€1.674", "–€1.869", "–€2.712"],
  },
  {
    type: "total",
    label: "Nettoumsatz",
    values: ["€1.342", "€1.450", "€3.538", "€20.798", "€23.914", "€26.694", "€38.739"],
  },
  { type: "section", label: "Variable Kosten" },
  {
    type: "line",
    label: "OTA-Provision",
    negative: true,
    values: ["–€136", "–€220", "–€545", "–€2.658", "–€3.757", "–€3.974", "–€5.407"],
  },
  {
    type: "total",
    label: "Contribution Margin",
    sub: "86,0% vom Nettoumsatz",
    values: ["€1.206", "€1.230", "€2.993", "€18.140", "€20.157", "€22.720", "€33.332"],
  },
  { type: "section", label: "Fixe Kosten" },
  {
    type: "line",
    label: "Reinigung · Test",
    negative: true,
    values: [null, null, null, null, null, null, "–€221"],
  },
  {
    type: "total",
    label: "Operativer Gewinn",
    values: ["€1.206", "€1.230", "€2.993", "€18.140", "€20.157", "€22.720", "€33.111"],
  },
];

export function PnlTable() {
  const { openChat } = useArbioChat();

  return (
    <div className="bg-white border border-line rounded-[24px] p-7 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between">
        <h3 className="text-[16px] font-medium">P&L Übersicht</h3>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[13px] text-muted">
            <MessageCircle size={13} />
            Position anklicken für Erklärung im Chat
          </span>
          <span className="text-[14px] text-muted">28 Buchungen · 172 belegte Nächte</span>
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
                        Jetzt
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
                  onClick={row.type === "line" ? () => openChat(costExplainSeed(row.label)) : undefined}
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
                            ? "text-accent-text"
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
