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
