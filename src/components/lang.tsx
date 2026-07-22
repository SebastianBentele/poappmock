"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";

export type Lang = "de" | "en";

const LangCtx = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (de: string, en: string) => string;
}>({ lang: "de", setLang: () => {}, t: (de) => de });

export function useLang() {
  return useContext(LangCtx);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("de");

  useEffect(() => {
    const s = sessionStorage.getItem("arbio-lang");
    if (s === "en" || s === "de") setLangState(s);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    sessionStorage.setItem("arbio-lang", l);
  };

  const t = (de: string, en: string) => (lang === "de" ? de : en);

  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

const LANGS: { code: Lang; label: string }[] = [
  { code: "de", label: "Deutsch" },
  { code: "en", label: "English" },
];

export function LangToggle() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {open && <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />}
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative z-40 flex items-center gap-2 bg-white border border-line rounded-full h-11 pl-3.5 pr-3 shadow-[0_2px_10px_rgba(0,0,0,0.06)] hover:bg-panel transition-colors"
      >
        <Globe size={16} className="text-muted" />
        <span className="text-[14px] font-medium uppercase">{lang}</span>
        <ChevronDown size={15} className="text-muted" />
      </button>
      {open && (
        <div className="absolute right-0 top-[52px] w-[180px] bg-white border border-line rounded-[20px] shadow-[0_16px_50px_rgba(0,0,0,0.14)] p-2 z-40">
          {LANGS.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => {
                setLang(code);
                setOpen(false);
              }}
              className="w-full flex items-center justify-between rounded-[12px] px-4 py-2.5 text-[15px] text-left hover:bg-panel"
            >
              <span className="flex items-center gap-2.5">
                <span className="text-[13px] font-medium uppercase text-muted w-6">{code}</span>
                {label}
              </span>
              {lang === code && <Check size={15} className="text-accent-text" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
