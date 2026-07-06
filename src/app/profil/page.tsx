"use client";

import { useState } from "react";
import {
  User,
  Landmark,
  FileText,
  Download,
  Check,
  Pencil,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

type Field = { key: string; label: string; value: string; span?: boolean };

const initialPersonal: Field[] = [
  { key: "firstName", label: "Vorname", value: "Sebastian" },
  { key: "lastName", label: "Nachname", value: "Bentele" },
  { key: "company", label: "Firma (optional)", value: "Bentele Immobilien GmbH", span: true },
  { key: "email", label: "E-Mail", value: "sebastian@arbio.com" },
  { key: "phone", label: "Telefon", value: "+49 170 1234567" },
  { key: "street", label: "Straße & Hausnr.", value: "Maximilianstraße 12", span: true },
  { key: "zip", label: "PLZ", value: "80539" },
  { key: "city", label: "Stadt", value: "München" },
  { key: "country", label: "Land", value: "Deutschland" },
  { key: "taxId", label: "Steuernummer / USt-IdNr.", value: "DE812345678" },
];

const initialBank: Field[] = [
  { key: "accountHolder", label: "Kontoinhaber", value: "Sebastian Bentele", span: true },
  { key: "iban", label: "IBAN", value: "DE89 3704 0044 0532 0130 00", span: true },
  { key: "bic", label: "BIC", value: "COBADEFFXXX" },
  { key: "bank", label: "Bank", value: "Commerzbank München" },
];

const contractTerms = [
  { label: "Vertragsmodell", value: "Full-Service Management" },
  { label: "Management-Gebühr", value: "15% vom Nettoumsatz" },
  { label: "Vertragsbeginn", value: "01.03.2025" },
  { label: "Mindestlaufzeit", value: "12 Monate" },
  { label: "Kündigungsfrist", value: "3 Monate zum Laufzeitende" },
  { label: "Verwaltete Einheiten", value: "3 Einheiten" },
  { label: "Auszahlungsrhythmus", value: "Monatlich, zum 5." },
  { label: "Status", value: "Aktiv" },
];

const documents = [
  { name: "Management-Vertrag", meta: "PDF · unterzeichnet 24.02.2025 · 4 Seiten" },
  { name: "Leistungsbeschreibung (Anhang A)", meta: "PDF · 24.02.2025 · 2 Seiten" },
  { name: "Preisblatt & Gebühren (Anhang B)", meta: "PDF · 24.02.2025 · 1 Seite" },
];

function EditableSection({
  title,
  icon: Icon,
  fields,
}: {
  title: string;
  icon: typeof User;
  fields: Field[];
}) {
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState(fields);
  const [saved, setSaved] = useState(false);

  const update = (key: string, v: string) =>
    setValues((prev) => prev.map((f) => (f.key === key ? { ...f, value: v } : f)));

  const save = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="bg-white border border-line rounded-[24px] p-7 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-full bg-panel flex items-center justify-center text-muted">
            <Icon size={16} />
          </span>
          <h3 className="text-[16px]">{title}</h3>
        </div>
        {editing ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setValues(fields);
                setEditing(false);
              }}
              className="rounded-full border border-line px-4 py-2 text-[14px] text-muted hover:bg-panel"
            >
              Abbrechen
            </button>
            <button
              onClick={save}
              className="flex items-center gap-2 rounded-full bg-[#2a2a2a] text-white px-4 py-2 text-[14px] hover:bg-black"
            >
              <Check size={14} />
              Speichern
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[14px] hover:bg-panel"
          >
            <Pencil size={13} />
            Bearbeiten
          </button>
        )}
      </div>

      {saved && (
        <div className="flex items-center gap-2 mt-4 bg-[#eef5eb] text-accent-text rounded-[14px] px-4 py-2.5 text-[14px]">
          <CheckCircle2 size={15} />
          Änderungen gespeichert.
        </div>
      )}

      <div className="grid grid-cols-2 gap-x-6 gap-y-5 mt-6">
        {values.map((f) => (
          <div key={f.key} className={f.span ? "col-span-2" : ""}>
            <label className="block text-[13px] text-muted">{f.label}</label>
            {editing ? (
              <input
                value={f.value}
                onChange={(e) => update(f.key, e.target.value)}
                className="w-full mt-1.5 bg-white border border-line rounded-[14px] px-4 py-2.5 text-[15px] outline-none focus:border-[#c9c9c9]"
              />
            ) : (
              <div className="text-[15px] mt-1.5">{f.value}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Profil() {
  return (
    <div className="min-h-screen px-8 py-6 pb-32 max-w-[1000px]">
      <div className="flex items-center gap-4">
        <span className="w-14 h-14 rounded-full bg-panel flex items-center justify-center text-[18px] font-medium">
          SE
        </span>
        <div>
          <h1 className="text-[22px]">Sebastian Bentele</h1>
          <p className="text-[15px] text-muted mt-0.5">
            Property Owner · seit März 2025 · 3 Einheiten
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-7">
        <EditableSection title="Persönliche Daten" icon={User} fields={initialPersonal} />

        <div>
          <EditableSection title="Bankverbindung" icon={Landmark} fields={initialBank} />
          <div className="flex items-center gap-2 mt-2 px-2 text-[13px] text-muted">
            <ShieldCheck size={13} className="text-accent-text" />
            Deine Auszahlungen gehen auf dieses Konto. Änderungen werden aus Sicherheitsgründen
            geprüft, bevor sie aktiv werden.
          </div>
        </div>

        {/* Contract terms */}
        <div className="bg-white border border-line rounded-[24px] p-7 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-full bg-panel flex items-center justify-center text-muted">
              <FileText size={16} />
            </span>
            <h3 className="text-[16px]">Vertragskonditionen</h3>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-5 mt-6">
            {contractTerms.map(({ label, value }) => (
              <div key={label}>
                <div className="text-[13px] text-muted">{label}</div>
                <div className="text-[15px] mt-1 flex items-center gap-2">
                  {value}
                  {value === "Aktiv" && (
                    <span className="w-2 h-2 rounded-full bg-accent inline-block" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Documents */}
          <div className="border-t border-line mt-7 pt-6">
            <h4 className="text-[15px]">Dokumente</h4>
            <div className="flex flex-col mt-2">
              {documents.map(({ name, meta }, i) => (
                <div
                  key={name}
                  className={`flex items-center gap-4 py-3.5 ${
                    i > 0 ? "border-t border-line" : ""
                  }`}
                >
                  <span className="w-10 h-10 rounded-full bg-panel flex items-center justify-center text-muted shrink-0">
                    <FileText size={16} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] leading-tight">{name}</div>
                    <div className="text-[13px] text-muted mt-0.5">{meta}</div>
                  </div>
                  <button className="flex items-center gap-2 border border-line rounded-full px-4 py-2 text-[14px] hover:bg-panel">
                    <Download size={14} />
                    PDF
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
