"use client";

import { useEffect, useState, ReactNode } from "react";
import { Lock, ArrowRight } from "lucide-react";

const PASSWORD = "Arbio123!";
const STORAGE_KEY = "arbio-po-app-auth";

export function PasswordGate({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    setAuthed(sessionStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  const submit = () => {
    if (input === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setAuthed(true);
    } else {
      setError(true);
    }
  };

  // Avoid flashing the app before the session check ran
  if (authed === null) return <div className="min-h-screen bg-[#fafafa]" />;

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6">
        <div className="w-full max-w-[400px] bg-white border border-line rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.06)] px-9 py-10 flex flex-col items-center">
          <span className="text-[30px] tracking-[-0.5px]">Arbio</span>
          <p className="text-[15px] text-muted mt-1">Property Owner App</p>

          <span className="w-11 h-11 rounded-full bg-panel flex items-center justify-center text-muted mt-8">
            <Lock size={17} />
          </span>
          <p className="text-[14px] text-muted mt-3 text-center">
            Diese Vorschau ist passwortgeschützt.
          </p>

          <input
            type="password"
            value={input}
            autoFocus
            onChange={(e) => {
              setInput(e.target.value);
              setError(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Passwort"
            className={`w-full mt-6 bg-white border rounded-[30px] px-6 py-3.5 text-[15px] outline-none placeholder:text-muted ${
              error ? "border-negative" : "border-line focus:border-[#c9c9c9]"
            }`}
          />
          {error && (
            <p className="w-full text-[13px] text-negative mt-2 px-2">
              Falsches Passwort — bitte versuch es nochmal.
            </p>
          )}

          <button
            onClick={submit}
            className="w-full flex items-center justify-center gap-2 bg-[#2a2a2a] text-white rounded-full px-6 py-3.5 text-[15px] mt-4 hover:bg-black transition-colors"
          >
            Anmelden
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
