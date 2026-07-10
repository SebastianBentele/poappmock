import { Mic, ArrowUp, LifeBuoy } from "lucide-react";

export function ChatInput({
  placeholder,
  className = "",
  onRequest,
}: {
  placeholder: string;
  className?: string;
  onRequest?: () => void;
}) {
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
          Anfrage
        </button>
      )}
      <input
        type="text"
        placeholder={placeholder}
        className={`flex-1 min-w-0 bg-transparent outline-none text-[16px] placeholder:text-muted ${
          onRequest ? "pl-1" : ""
        }`}
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
