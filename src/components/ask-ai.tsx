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
