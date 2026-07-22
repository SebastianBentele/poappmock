"use client";

import { MessageCircle } from "lucide-react";
import { useArbioChat, type Msg } from "@/components/arbio-chat";
import { useLang } from "@/components/lang";

/**
 * Small "ask AI" affordance for KPI cards and charts. It sits in the top-right
 * corner of its container and only becomes visible when that container is
 * hovered — the parent must carry `group relative`. Clicking opens the chat.
 */
export function AskAi({ label }: { label?: string }) {
  const { openChat } = useArbioChat();
  const { t } = useLang();

  const seed: Msg[] = [
    {
      kind: "bot",
      text: label
        ? t(`Was möchtest du zu „${label}" wissen? Frag einfach.`, `What would you like to know about "${label}"? Just ask.`)
        : t("Frag mich alles zu diesem Wert.", "Ask me anything about this metric."),
    },
  ];

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        openChat(seed);
      }}
      aria-label={t("KI fragen", "Ask AI")}
      className="group/ask absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full bg-white border border-line shadow-[0_2px_8px_rgba(0,0,0,0.10)] flex items-center justify-center text-muted hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <MessageCircle size={15} />
      <span className="pointer-events-none absolute right-full mr-2 top-1/2 -translate-y-1/2 hidden group-hover/ask:block bg-[#2a2a2a] text-white text-[12px] rounded-md px-2 py-1 whitespace-nowrap">
        {t("KI fragen", "Ask AI")}
      </span>
    </button>
  );
}
