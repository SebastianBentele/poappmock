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
