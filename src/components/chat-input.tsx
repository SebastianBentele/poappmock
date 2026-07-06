import { Mic, ArrowUp } from "lucide-react";

export function ChatInput({
  placeholder,
  className = "",
}: {
  placeholder: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 bg-white border border-line rounded-[30px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] pl-6 pr-2.5 py-2.5 ${className}`}
    >
      <input
        type="text"
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-[16px] placeholder:text-muted"
      />
      <button className="w-10 h-10 rounded-full flex items-center justify-center text-muted hover:bg-panel">
        <Mic size={18} />
      </button>
      <button className="w-10 h-10 rounded-full bg-panel flex items-center justify-center text-muted hover:bg-line">
        <ArrowUp size={18} />
      </button>
    </div>
  );
}
