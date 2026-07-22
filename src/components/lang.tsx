"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

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

export function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <div className="flex items-center bg-white border border-line rounded-full p-0.5 shadow-[0_2px_10px_rgba(0,0,0,0.06)]">
      {(["de", "en"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`w-9 h-9 rounded-full text-[13px] font-medium uppercase transition-colors ${
            lang === l ? "bg-[#2a2a2a] text-white" : "text-muted hover:text-foreground"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
