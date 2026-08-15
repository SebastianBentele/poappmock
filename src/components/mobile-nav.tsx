"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MessageCircle,
  BarChart3,
  Wallet,
  ClipboardList,
  CalendarDays,
  LayoutGrid,
  Menu,
  X,
} from "lucide-react";
import { useLang } from "@/components/lang";
import { useFeatures } from "@/components/variant";

// Mobile shell: sticky top bar (logo + burger) below lg, with a slide-over
// nav panel. The desktop sidebar is hidden below lg; this replaces it.
export function MobileNav() {
  const pathname = usePathname();
  const { t } = useLang();
  const features = useFeatures();
  const [open, setOpen] = useState(false);

  // Close the sheet on navigation and lock body scroll while open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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

  return (
    <>
      <div className="lg:hidden sticky top-0 z-40 h-16 bg-white/90 backdrop-blur-md border-b border-line flex items-center gap-3 px-4">
        <button
          onClick={() => setOpen(true)}
          aria-label={t("Menü öffnen", "Open menu")}
          className="w-11 h-11 rounded-full flex items-center justify-center text-foreground hover:bg-panel"
        >
          <Menu size={20} />
        </button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/arbio-logo.jpg"
          alt="Arbio"
          className="h-[20px] w-auto mix-blend-multiply"
          draggable={false}
        />
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[300px] max-w-[85vw] bg-[#fafafa] border-r border-line flex flex-col py-5 px-4 overflow-y-auto">
            <div className="flex items-center justify-between px-2 mb-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/arbio-logo.jpg"
                alt="Arbio"
                className="h-[22px] w-auto mix-blend-multiply"
                draggable={false}
              />
              <button
                onClick={() => setOpen(false)}
                aria-label={t("Menü schließen", "Close menu")}
                className="w-11 h-11 rounded-full flex items-center justify-center text-muted hover:bg-panel"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="flex flex-col gap-2.5">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-3 rounded-[22px] px-3 py-2.5 text-[15px] transition-colors ${
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
                    <span className="font-medium whitespace-nowrap">{label}</span>
                  </Link>
                );
              })}
            </nav>
            <Link
              href="/profil"
              className="mt-auto flex items-center gap-3 rounded-[22px] px-3 py-2.5 bg-white border border-line shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              <span className="w-10 h-10 rounded-full bg-panel flex items-center justify-center text-[13px] font-medium shrink-0">
                SE
              </span>
              <span className="flex-1 leading-tight">
                <span className="block text-[15px] font-medium">Sebastian</span>
                <span className="block text-[11px] tracking-[1px] text-muted">
                  {t("PROFIL", "PROFILE")}
                </span>
              </span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
