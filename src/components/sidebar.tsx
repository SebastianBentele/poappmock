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
} from "lucide-react";
import { useLang } from "@/components/lang";

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLang();
  const [collapsed, setCollapsed] = useState(false);

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
    { href: "/operativ", label: t("Operations", "Operations"), icon: ClipboardList },
    { href: "/kalender", label: t("Kalender", "Calendar"), icon: CalendarDays },
  ];

  return (
    <aside
      className={`shrink-0 bg-[#fafafa] border-r border-line flex flex-col py-5 overflow-hidden transition-[width] duration-200 ease-out ${
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
        <button className="flex items-center justify-between px-3 py-3 mt-4 text-[14px] text-muted hover:text-foreground">
          <span>{t("Vergangene Chats", "Past chats")}</span>
          <ChevronRight size={16} />
        </button>
      )}

      <div className="mt-auto flex flex-col gap-2.5 w-full">
        <button
          title={collapsed ? t("Feedback geben", "Give feedback") : undefined}
          className={`flex items-center gap-3 rounded-[22px] bg-white border border-line shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-[15px] ${
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
              <span className="w-9 h-9 rounded-full bg-panel flex items-center justify-center text-muted shrink-0">
                <Settings size={15} />
              </span>
            </>
          )}
        </Link>
      </div>
    </aside>
  );
}
