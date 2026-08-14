# Layout components (full source)

App shell = fixed 290px sidebar (collapsible to 76px via --sidebar-w CSS var) + main content. No responsive/mobile shell exists yet. PasswordGate wraps everything (demo access).


### `src/app/layout.tsx`

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { ChatProvider } from "@/components/arbio-chat";
import { PasswordGate } from "@/components/password-gate";
import { LanguageProvider } from "@/components/lang";
import { TopBar } from "@/components/top-bar";

export const metadata: Metadata = {
  title: "Arbio Property Owner App",
  description: "Property Owner App Mockup",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="h-full antialiased">
      <body className="min-h-full">
        <LanguageProvider>
          <PasswordGate>
            <ChatProvider>
              <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 min-w-0">
                  <TopBar />
                  {children}
                </main>
              </div>
            </ChatProvider>
          </PasswordGate>
        </LanguageProvider>
      </body>
    </html>
  );
}

```


### `src/components/sidebar.tsx`

```tsx
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
import { useArbioChat, waterDamageApprovalSeed } from "@/components/arbio-chat";
import { metricSeed } from "@/components/metric-insights";

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLang();
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
    { href: "/operativ", label: t("Operations", "Operations"), icon: ClipboardList },
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

```


### `src/components/top-bar.tsx`

```tsx
"use client";

import { usePathname } from "next/navigation";
import { useLang } from "@/components/lang";

// Route → page header. Home ("/") and any unlisted route render no bar,
// so the chat hero keeps its bespoke layout.
const TITLES: Record<string, { de: string; en: string; subDe?: string; subEn?: string }> = {
  "/einheiten": {
    de: "Portfolio",
    en: "Portfolio",
    subDe: "Deine Einheiten auf der Karte und im Überblick",
    subEn: "Your units on the map and at a glance",
  },
  "/portfolio": {
    de: "Umsatz",
    en: "Revenue",
    subDe: "Umsatz, Auslastung und Buchungstempo im Überblick",
    subEn: "Revenue, occupancy and booking pace at a glance",
  },
  "/finanzen": {
    de: "Finanzen",
    en: "Finance",
    subDe: "Dein P&L, deine Auszahlungen und Abrechnungen im Überblick",
    subEn: "Your P&L, payouts and statements at a glance",
  },
  "/operativ": {
    de: "Operations",
    en: "Operations",
    subDe: "Was gerade passiert — und was Arbio für dich erledigt",
    subEn: "What's happening right now — and what Arbio gets done for you",
  },
  "/kalender": {
    de: "Kalender",
    en: "Calendar",
    subDe: "Alle Einheiten, Buchungen und Wartungen im Überblick",
    subEn: "All units, bookings and maintenance at a glance",
  },
  "/profil": { de: "Profil", en: "Profile" },
};

export function TopBar() {
  const pathname = usePathname();
  const { t } = useLang();
  const entry = TITLES[pathname];
  if (!entry) return null;

  const sub = entry.subDe ? t(entry.subDe, entry.subEn ?? entry.subDe) : null;

  return (
    <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-line">
      {/* right padding keeps the title clear of the language toggle + bell */}
      <div className="px-8 py-4 pr-[190px]">
        <h1 className="text-[20px] leading-tight">{t(entry.de, entry.en)}</h1>
        {sub && <p className="text-[13px] text-muted mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

```


### `src/components/password-gate.tsx`

```tsx
"use client";

import { useEffect, useState, ReactNode } from "react";
import { Lock, ArrowRight } from "lucide-react";
import { useLang } from "@/components/lang";

/**
 * Access list for the preview. Entries are SHA-256 hashes of
 * `email.toLowerCase() + ":" + password` — neither the passwords nor the
 * invitees' email addresses are stored in this repository (one of the mirrors
 * is public). Generate a new entry with:
 *
 *   node scripts/make-access.mjs <email> <password>
 */
const ACCESS_HASHES = new Set([
  "e7a258fa7339d6e96858521b0ec5a5438bb45bb4f170f2c85c4b38e5112906f9", // internal (legacy password)
  "93aabfaafc8a15fa803c17bbbebd642661ca2e02ffebf9d3854d97a985d547f4", // internal
  "4926ac5e0912832143ca10bb3e082ae7bb87f1233c03c51f8d81caf85b9f832e", // invited owner 1
  "84d1bf240fc7787f62ab578b2aa811954219dbcdaffe345a9a6e06c3904a8e8f", // invited owner 2
  "a71d23f32931096fad83d2ca729ac2cf512a72ebe3965c6a0e44ea36dec9f455", // invited owner 3
]);

const STORAGE_KEY = "arbio-po-app-auth";

async function sha256Hex(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function PasswordGate({ children }: { children: ReactNode }) {
  const { t } = useLang();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    setAuthed(sessionStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  const submit = async () => {
    if (!email.trim() || !password || checking) return;
    setChecking(true);
    try {
      const hash = await sha256Hex(`${email.trim().toLowerCase()}:${password}`);
      if (ACCESS_HASHES.has(hash)) {
        sessionStorage.setItem(STORAGE_KEY, "1");
        setAuthed(true);
        return;
      }
      setError(true);
    } finally {
      setChecking(false);
    }
  };

  // Avoid flashing the app before the session check ran
  if (authed === null) return <div className="min-h-screen bg-[#fafafa]" />;

  if (!authed) {
    const field =
      "w-full bg-white border rounded-[30px] px-6 py-3.5 text-[15px] outline-none placeholder:text-muted";
    const border = error ? "border-negative" : "border-line focus:border-[#c9c9c9]";

    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6">
        <div className="w-full max-w-[400px] bg-white border border-line rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.06)] px-9 py-10 flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/arbio-logo.jpg"
            alt="Arbio"
            className="h-[30px] w-auto mix-blend-multiply"
            draggable={false}
          />
          <p className="text-[15px] mt-2">Arbio Portal Demo</p>

          <span className="w-11 h-11 rounded-full bg-panel flex items-center justify-center text-muted mt-8">
            <Lock size={17} />
          </span>
          <p className="text-[14px] text-muted mt-3 text-center">
            {t(
              "Melde dich mit deinen Zugangsdaten an.",
              "Sign in with the credentials you received."
            )}
          </p>

          <input
            type="email"
            value={email}
            autoFocus
            autoComplete="username"
            onChange={(e) => {
              setEmail(e.target.value);
              setError(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder={t("E-Mail", "Email")}
            className={`${field} ${border} mt-6`}
          />
          <input
            type="password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder={t("Passwort", "Password")}
            className={`${field} ${border} mt-3`}
          />
          {error && (
            <p className="w-full text-[13px] text-negative mt-2 px-2">
              {t(
                "E-Mail oder Passwort ist falsch — bitte versuch es nochmal.",
                "Email or password is incorrect — please try again."
              )}
            </p>
          )}

          <button
            onClick={submit}
            disabled={checking}
            className="w-full flex items-center justify-center gap-2 bg-[#2a2a2a] text-white rounded-full px-6 py-3.5 text-[15px] mt-4 hover:bg-black transition-colors disabled:opacity-60"
          >
            {t("Anmelden", "Sign in")}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

```
