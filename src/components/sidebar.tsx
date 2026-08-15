"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  MessageCircle,
  BarChart3,
  Wallet,
  ClipboardList,
  CalendarDays,
  LayoutGrid,
  ChevronRight,
  MessageSquarePlus,
  Settings,
  PanelLeft,
  Wrench,
  Banknote,
  X,
  CheckCircle2,
} from "lucide-react";
import { useLang } from "@/components/lang";
import { useFeatures } from "@/components/variant";
import { useArbioChat, waterDamageApprovalSeed } from "@/components/arbio-chat";
import { metricSeed } from "@/components/metric-insights";

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLang();
  const features = useFeatures();
  const { openChat } = useArbioChat();
  const [collapsed, setCollapsed] = useState(false);
  const [pastOpen, setPastOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  // Expose the current sidebar width so fixed elements (the floating chat bar)
  // can reflow with it via var(--sidebar-w).
  useEffect(() => {
    document.documentElement.style.setProperty("--sidebar-w", collapsed ? "76px" : "290px");
  }, [collapsed]);

  const navItems = [
    { href: "/", label: t("Frag Arbio", "Ask Arbio"), icon: MessageCircle },
    { href: "/einheiten", label: t("Portfolio", "Portfolio"), icon: LayoutGrid },
    { href: "/portfolio", label: t("Umsatz", "Revenue"), icon: BarChart3 },
    { href: "/finanzen", label: t("Finanzen", "Finance"), icon: Wallet },
    // V1 has no Operations page (maintenance data isn't reliable enough yet) —
    // it carries "Anfragen" instead: the requests the owner raised in the portal.
    features.operations
      ? { href: "/operativ", label: t("Operations", "Operations"), icon: ClipboardList }
      : { href: "/anfragen", label: t("Anfragen", "Requests"), icon: ClipboardList },
    { href: "/kalender", label: t("Kalender", "Calendar"), icon: CalendarDays },
  ];

  // Example past conversations — clicking one reopens it in the chat.
  const pastChats = [
    {
      title: t("Wasserschaden Studio Universität", "Water damage Studio University"),
      time: t("Heute", "Today"),
      icon: Wrench,
      seed: () => waterDamageApprovalSeed(t),
    },
    {
      title: t("Juni-Auszahlung", "June payout"),
      time: t("Gestern", "Yesterday"),
      icon: Banknote,
      seed: () => metricSeed("payouts", t),
    },
    {
      title: t("Top-Performer im Juli", "Top performer in July"),
      time: t("Montag", "Monday"),
      icon: BarChart3,
      seed: () => metricSeed("top-performer", t),
    },
  ];

  const closeFeedback = () => {
    setFeedbackOpen(false);
    setFeedbackSent(false);
    setFeedbackText("");
  };

  return (
    <aside
      className={`hidden lg:flex shrink-0 bg-[#fafafa] border-r border-line flex-col py-5 overflow-hidden transition-[width] duration-200 ease-out ${
        collapsed ? "w-[76px] px-3 items-center" : "w-[290px] px-4"
      }`}
    >
      {/* Header: logo + collapse toggle */}
      <div className={`flex items-center mb-8 ${collapsed ? "justify-center" : "justify-between px-2"}`}>
        {!collapsed && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src="/arbio-logo.jpg"
            alt="Arbio"
            className="h-[24px] w-auto mix-blend-multiply"
            draggable={false}
          />
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? t("Menü ausklappen", "Expand menu") : t("Menü einklappen", "Collapse menu")}
          className="p-2 rounded-lg hover:bg-panel text-muted"
        >
          <PanelLeft size={17} />
        </button>
      </div>

      <nav className="flex flex-col gap-2.5 w-full">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 rounded-[22px] text-[15px] transition-colors ${
                collapsed ? "justify-center px-1.5 py-1.5" : "px-3 py-2.5"
              } ${
                active
                  ? "bg-white border border-line shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                  : "hover:bg-panel"
              }`}
            >
              <span
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  active ? "bg-[#2a2a2a] text-white" : "bg-panel text-foreground"
                }`}
              >
                <Icon size={16} />
              </span>
              {!collapsed && <span className="font-medium whitespace-nowrap">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="mt-4">
          <button
            onClick={() => setPastOpen((o) => !o)}
            className="w-full flex items-center justify-between px-3 py-3 text-[14px] text-muted hover:text-foreground"
          >
            <span>{t("Vergangene Chats", "Past chats")}</span>
            <ChevronRight
              size={16}
              className={`transition-transform duration-200 ${pastOpen ? "rotate-90" : ""}`}
            />
          </button>
          {pastOpen && (
            <div className="flex flex-col gap-1 mt-1">
              {pastChats.map(({ title, time, icon: Icon, seed }) => (
                <button
                  key={title}
                  onClick={() => openChat(seed())}
                  className="flex items-center gap-2.5 rounded-[14px] px-3 py-2 text-left hover:bg-panel"
                >
                  <span className="w-7 h-7 rounded-full bg-panel flex items-center justify-center text-muted shrink-0">
                    <Icon size={13} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[13px] truncate">{title}</span>
                    <span className="block text-[11px] text-muted">{time}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-auto flex flex-col gap-2.5 w-full">
        <button
          onClick={() => setFeedbackOpen(true)}
          title={collapsed ? t("Feedback geben", "Give feedback") : undefined}
          className={`flex items-center gap-3 rounded-[22px] bg-white border border-line shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-[15px] hover:bg-panel transition-colors ${
            collapsed ? "justify-center px-1.5 py-1.5" : "px-3 py-2.5"
          }`}
        >
          <span className="w-9 h-9 rounded-full bg-panel flex items-center justify-center shrink-0">
            <MessageSquarePlus size={16} />
          </span>
          {!collapsed && <span className="font-medium whitespace-nowrap">{t("Feedback geben", "Give feedback")}</span>}
        </button>

        <Link
          href="/profil"
          title={collapsed ? "Sebastian" : undefined}
          className={`flex items-center gap-3 rounded-[22px] border border-line shadow-[0_1px_3px_rgba(0,0,0,0.04)] bg-white transition-colors ${
            pathname === "/profil" ? "" : "hover:bg-panel"
          } ${collapsed ? "justify-center px-1.5 py-1.5" : "px-3 py-2.5"}`}
        >
          <span className="w-10 h-10 rounded-full bg-panel flex items-center justify-center text-[13px] font-medium shrink-0">
            SE
          </span>
          {!collapsed && (
            <>
              <div className="flex-1 leading-tight">
                <div className="text-[15px] font-medium">Sebastian</div>
                <div className="text-[11px] tracking-[1px] text-muted">{t("PROFIL", "PROFILE")}</div>
              </div>
              <span className="w-9 h-9 rounded-full bg-panel flex items-center justify-center text-muted">
                <Settings size={15} />
              </span>
            </>
          )}
        </Link>
      </div>

      {/* Feedback modal */}
      {feedbackOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center px-6">
          <div className="bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.2)] w-full max-w-[460px] p-7">
            {feedbackSent ? (
              <div className="flex flex-col items-center text-center py-6">
                <CheckCircle2 size={40} className="text-accent-text" />
                <div className="text-[19px] mt-4">{t("Danke für dein Feedback!", "Thanks for your feedback!")}</div>
                <p className="text-[14px] text-muted mt-2 leading-snug">
                  {t(
                    "Wir lesen jede Nachricht und melden uns, wenn wir Rückfragen haben.",
                    "We read every message and will get back to you if we have questions."
                  )}
                </p>
                <button
                  onClick={closeFeedback}
                  className="mt-6 bg-[#2a2a2a] text-white rounded-full px-8 py-3 text-[15px]"
                >
                  {t("Fertig", "Done")}
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <div className="text-[19px]">{t("Feedback geben", "Give feedback")}</div>
                  <button
                    onClick={closeFeedback}
                    className="w-9 h-9 rounded-full bg-panel flex items-center justify-center text-muted"
                  >
                    <X size={16} />
                  </button>
                </div>
                <p className="text-[13px] text-muted mt-2">
                  {t(
                    "Was gefällt dir — und was können wir besser machen?",
                    "What do you like — and what can we do better?"
                  )}
                </p>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder={t("Dein Feedback...", "Your feedback...")}
                  rows={5}
                  className="w-full mt-4 border border-line rounded-[18px] px-5 py-4 text-[15px] outline-none focus:border-[#c9c9c9] resize-none bg-white"
                />
                <button
                  onClick={() => setFeedbackSent(true)}
                  disabled={!feedbackText.trim()}
                  className="w-full mt-4 bg-[#2a2a2a] text-white rounded-full px-6 py-3.5 text-[15px] hover:bg-black transition-colors disabled:opacity-40 disabled:hover:bg-[#2a2a2a]"
                >
                  {t("Feedback senden", "Send feedback")}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
