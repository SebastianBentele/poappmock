"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MessageCircle,
  BarChart3,
  Wallet,
  Banknote,
  ChevronRight,
  MessageSquarePlus,
  Settings,
  PanelLeft,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Frag Arbio", icon: MessageCircle },
  { href: "/portfolio", label: "Dein Portfolio", icon: BarChart3 },
  { href: "/profitability", label: "Profitabilität", icon: Wallet },
  { href: "/payouts", label: "Auszahlungen", icon: Banknote },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[290px] shrink-0 bg-[#fafafa] border-r border-line flex flex-col px-4 py-5">
      <div className="flex items-center justify-between px-2 mb-8">
        <span className="text-[26px] tracking-[-0.5px]">Arbio</span>
        <button className="p-2 rounded-lg hover:bg-panel text-muted">
          <PanelLeft size={17} />
        </button>
      </div>

      <nav className="flex flex-col gap-2.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-[22px] text-[15px] transition-colors ${
                active
                  ? "bg-white border border-line shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                  : "hover:bg-panel"
              }`}
            >
              <span
                className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  active ? "bg-[#2a2a2a] text-white" : "bg-panel text-foreground"
                }`}
              >
                <Icon size={16} />
              </span>
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>

      <button className="flex items-center justify-between px-3 py-3 mt-4 text-[14px] text-muted hover:text-foreground">
        <span>Vergangene Chats</span>
        <ChevronRight size={16} />
      </button>

      <div className="mt-auto flex flex-col gap-2.5">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-[22px] bg-white border border-line shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-[15px]">
          <span className="w-9 h-9 rounded-full bg-panel flex items-center justify-center">
            <MessageSquarePlus size={16} />
          </span>
          <span className="font-medium">Feedback geben</span>
        </button>

        <div className="flex items-center gap-3 px-3 py-2.5 rounded-[22px] bg-white border border-line shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <span className="w-10 h-10 rounded-full bg-panel flex items-center justify-center text-[13px] font-medium">
            SE
          </span>
          <div className="flex-1 leading-tight">
            <div className="text-[15px] font-medium">Sebastian</div>
            <div className="text-[11px] tracking-[1px] text-muted">PROFIL</div>
          </div>
          <button className="w-9 h-9 rounded-full bg-panel flex items-center justify-center text-muted">
            <Settings size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
