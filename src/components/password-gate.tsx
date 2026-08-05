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
  "e7a258fa7339d6e96858521b0ec5a5438bb45bb4f170f2c85c4b38e5112906f9", // internal
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
          <p className="text-[15px] text-muted mt-2">Property Owner App</p>

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
