"use client";

import { useState } from "react";
import {
  Building,
  ChevronDown,
  ChevronUp,
  Info,
  Lock,
  Pencil,
  Plus,
  Trash2,
  Sparkles,
  Shirt,
  Percent,
  BadgePercent,
  Landmark,
  Package,
  TrendingUp,
  Zap,
  Wifi,
  Home,
  Shield,
  Receipt,
  Building2,
  Monitor,
  Calculator,
  Users,
  Wrench,
  Box,
} from "lucide-react";

type Rhythm = "pro Monat" | "pro Woche" | "einmalig";

type Entry = { name: string; amount: number; rhythm: Rhythm; since: string };

type Category = {
  key: string;
  label: string;
  icon: typeof Package;
  entries: Entry[];
};

const lockedCategories = [
  { label: "Reinigung", icon: Sparkles, value: "€221", note: "Zusatz- & Grundreinigungen Juli" },
  { label: "Wäsche", icon: Shirt, value: "€96", note: "Wäscheservice Juli" },
  { label: "OTA-Gebühren", icon: Percent, value: "€5.407", note: "Booking.com & Airbnb Provision" },
  { label: "Arbio-Gebühren", icon: BadgePercent, value: "15%", note: "Management-Gebühr lt. Vertrag" },
  { label: "Beherbergungssteuer / Kurtaxe", icon: Landmark, value: "€912", note: "Wird von Arbio abgeführt" },
];

const initialCategories: Category[] = [
  { key: "verbrauch", label: "Verbrauchsmaterial", icon: Package, entries: [] },
  { key: "marketing", label: "Marketing", icon: TrendingUp, entries: [] },
  {
    key: "nebenkosten",
    label: "Nebenkosten",
    icon: Zap,
    entries: [{ name: "Strom & Gas Abschlag", amount: 200, rhythm: "pro Monat", since: "01.01.2026" }],
  },
  {
    key: "internet",
    label: "Internet",
    icon: Wifi,
    entries: [{ name: "Glasfaser (3 Einheiten)", amount: 90, rhythm: "pro Monat", since: "01.01.2026" }],
  },
  {
    key: "miete",
    label: "Miete / Finanzierung",
    icon: Home,
    entries: [{ name: "Kredit Altstadt Apartment", amount: 2100, rhythm: "pro Monat", since: "01.01.2026" }],
  },
  {
    key: "versicherung",
    label: "Versicherung",
    icon: Shield,
    entries: [{ name: "Gebäudeversicherung", amount: 245, rhythm: "pro Monat", since: "01.01.2026" }],
  },
  { key: "grundsteuer", label: "Grundsteuer", icon: Receipt, entries: [] },
  { key: "hausgeld", label: "Hausgeld", icon: Building2, entries: [] },
  { key: "software", label: "Software", icon: Monitor, entries: [] },
  { key: "buchhaltung", label: "Buchhaltung / Steuerberatung", icon: Calculator, entries: [] },
  { key: "mitarbeiter", label: "Mitarbeiter / Gehälter", icon: Users, entries: [] },
  { key: "instandhaltung", label: "Instandhaltung & Reparaturen", icon: Wrench, entries: [] },
  { key: "sonstiges", label: "Sonstiges", icon: Box, entries: [] },
];

const monthly = (e: Entry) =>
  e.rhythm === "pro Monat" ? e.amount : e.rhythm === "pro Woche" ? Math.round(e.amount * 4.42) : 0;

const fmt = (n: number) => `€${n.toLocaleString("de-DE")}`;

export function OwnerCosts() {
  const [categories, setCategories] = useState(initialCategories);
  const [expanded, setExpanded] = useState<string | null>("miete");
  const [addingFor, setAddingFor] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", amount: "", rhythm: "pro Monat" as Rhythm });
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const total = categories.reduce(
    (sum, c) => sum + c.entries.reduce((s, e) => s + monthly(e), 0),
    0
  );

  const startAdd = (key: string) => {
    setExpanded(key);
    setAddingFor(key);
    setForm({ name: "", amount: "", rhythm: "pro Monat" });
  };

  const saveEntry = (key: string) => {
    const amount = parseFloat(form.amount.replace(",", "."));
    if (!form.name.trim() || !amount) return;
    setCategories((prev) =>
      prev.map((c) =>
        c.key === key
          ? {
              ...c,
              entries: [
                ...c.entries,
                { name: form.name.trim(), amount, rhythm: form.rhythm, since: "01.08.2026" },
              ],
            }
          : c
      )
    );
    setAddingFor(null);
  };

  const removeEntry = (key: string, idx: number) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.key === key ? { ...c, entries: c.entries.filter((_, i) => i !== idx) } : c
      )
    );
  };

  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    const key = `custom-${newCategoryName.trim().toLowerCase().replace(/\s+/g, "-")}`;
    setCategories((prev) => [
      ...prev,
      { key, label: newCategoryName.trim(), icon: Box, entries: [] },
    ]);
    setNewCategoryName("");
    setAddingCategory(false);
    startAdd(key);
  };

  return (
    <div className="bg-white border border-line rounded-[24px] p-7 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-[16px] font-medium">Deine Kostenpositionen</h3>
          <p className="text-[14px] text-muted mt-1">
            Jede Position ist ein Kostenpunkt: fix pro Monat, pro Woche oder einmalig. Alles
            fließt in deinen echten Netto-Gewinn ein.
          </p>
        </div>
        <div className="text-right shrink-0 ml-6">
          <div className="text-[12px] tracking-[1.5px] uppercase text-muted">Kosten / Monat</div>
          <div className="text-[30px] tracking-[-0.5px]">{fmt(total)}</div>
        </div>
      </div>

      {/* Unit selector */}
      <div className="bg-panel rounded-[18px] px-5 py-4 mt-5 flex items-center gap-5 flex-wrap">
        <div>
          <div className="text-[13px] text-muted mb-1.5">Kosten bearbeiten für</div>
          <button className="flex items-center gap-2 bg-white border border-line rounded-full px-5 py-2.5 text-[15px]">
            <Building size={15} />
            Alle Einheiten
            <ChevronDown size={15} className="text-muted" />
          </button>
        </div>
        <p className="flex items-center gap-2 text-[13px] text-muted flex-1 min-w-[280px]">
          <Info size={14} className="shrink-0" />
          Diese Beträge gelten für jede Einheit. Wähle eine Einheit, um einen abweichenden Wert
          nur für sie festzulegen.
        </p>
      </div>

      {/* Locked Arbio categories */}
      <div className="mt-7">
        <div className="flex items-center gap-2 text-[12px] tracking-[1.5px] uppercase text-muted">
          <Lock size={12} />
          Von Arbio erfasst
        </div>
        <div className="flex flex-col mt-2">
          {lockedCategories.map(({ label, icon: Icon, value, note }, i) => (
            <div
              key={label}
              className={`flex items-center gap-4 py-3.5 ${i > 0 ? "border-t border-line" : ""}`}
            >
              <span className="w-10 h-10 rounded-full bg-panel flex items-center justify-center text-muted shrink-0">
                <Icon size={16} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[15px]">{label}</div>
                <div className="text-[13px] text-muted mt-0.5">{note}</div>
              </div>
              <span className="text-[15px]">{value}</span>
              <span className="flex items-center gap-1.5 bg-panel rounded-full px-3 py-1 text-[12px] text-muted">
                <Lock size={11} />
                automatisch
              </span>
            </div>
          ))}
        </div>
        <p className="text-[13px] text-muted mt-2">
          Diese Kosten entstehen durch Arbio-Services und fließen automatisch in deine P&L ein —
          du musst hier nichts pflegen.
        </p>
      </div>

      {/* Editable categories */}
      <div className="mt-7">
        <div className="text-[12px] tracking-[1.5px] uppercase text-muted">
          Deine eigenen Kosten
        </div>
        <div className="flex flex-col gap-2.5 mt-3">
          {categories.map(({ key, label, icon: Icon, entries }) => {
            const catTotal = entries.reduce((s, e) => s + monthly(e), 0);
            const isOpen = expanded === key;
            return (
              <div key={key} className="border border-line rounded-[20px] overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? null : key)}
                  className="w-full flex items-center gap-4 px-5 py-3.5 text-left hover:bg-panel transition-colors"
                >
                  <span className="w-10 h-10 rounded-full bg-panel flex items-center justify-center text-muted shrink-0">
                    <Icon size={16} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="text-[15px]">{label}</span>
                    <span className="text-[14px] text-muted ml-3">
                      {entries.length === 0
                        ? "Noch nicht eingetragen"
                        : `${entries.length} Position${entries.length > 1 ? "en" : ""} · ${fmt(catTotal)}/Monat`}
                    </span>
                  </div>
                  {entries.length > 0 && <span className="text-[15px]">{fmt(catTotal)}</span>}
                  {entries.length === 0 && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        startAdd(key);
                      }}
                      className="border border-line rounded-full px-4 py-1.5 text-[13px] text-muted hover:bg-white"
                    >
                      + Eintragen
                    </span>
                  )}
                  {isOpen ? (
                    <ChevronUp size={16} className="text-muted shrink-0" />
                  ) : (
                    <ChevronDown size={16} className="text-muted shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 border-t border-line">
                    {entries.map((e, idx) => (
                      <div
                        key={`${e.name}-${idx}`}
                        className={`flex items-center gap-4 py-3 ${idx > 0 ? "border-t border-line" : ""}`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-[15px]">{e.name}</div>
                          <div className="text-[13px] text-muted mt-0.5">
                            €{e.amount.toLocaleString("de-DE")} {e.rhythm} · ab {e.since}
                          </div>
                        </div>
                        <button className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:bg-panel">
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => removeEntry(key, idx)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:bg-panel"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}

                    {addingFor === key ? (
                      <div className="flex items-end gap-3 flex-wrap pt-3">
                        <div className="flex-1 min-w-[180px]">
                          <label className="block text-[13px] text-muted mb-1">Bezeichnung</label>
                          <input
                            autoFocus
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="z.B. Kreditrate"
                            className="w-full bg-white border border-line rounded-[14px] px-4 py-2.5 text-[15px] outline-none focus:border-[#c9c9c9]"
                          />
                        </div>
                        <div className="w-[120px]">
                          <label className="block text-[13px] text-muted mb-1">Betrag (€)</label>
                          <input
                            value={form.amount}
                            onChange={(e) => setForm({ ...form, amount: e.target.value })}
                            placeholder="0"
                            className="w-full bg-white border border-line rounded-[14px] px-4 py-2.5 text-[15px] outline-none focus:border-[#c9c9c9]"
                          />
                        </div>
                        <div>
                          <label className="block text-[13px] text-muted mb-1">Rhythmus</label>
                          <select
                            value={form.rhythm}
                            onChange={(e) =>
                              setForm({ ...form, rhythm: e.target.value as Rhythm })
                            }
                            className="bg-white border border-line rounded-[14px] px-4 py-2.5 text-[15px] outline-none"
                          >
                            <option>pro Monat</option>
                            <option>pro Woche</option>
                            <option>einmalig</option>
                          </select>
                        </div>
                        <button
                          onClick={() => saveEntry(key)}
                          className="bg-[#2a2a2a] text-white rounded-full px-5 py-2.5 text-[14px] hover:bg-black"
                        >
                          Speichern
                        </button>
                        <button
                          onClick={() => setAddingFor(null)}
                          className="border border-line rounded-full px-4 py-2.5 text-[14px] text-muted hover:bg-panel"
                        >
                          Abbrechen
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startAdd(key)}
                        className="flex items-center gap-2 text-[14px] text-muted hover:text-foreground pt-3"
                      >
                        <Plus size={14} />
                        {label}-Kosten hinzufügen
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Add custom category */}
          {addingCategory ? (
            <div className="border border-line rounded-[20px] px-5 py-4 flex items-center gap-3">
              <input
                autoFocus
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCategory()}
                placeholder="Name der Kostenart, z.B. Gartenpflege"
                className="flex-1 bg-white border border-line rounded-[14px] px-4 py-2.5 text-[15px] outline-none focus:border-[#c9c9c9]"
              />
              <button
                onClick={addCategory}
                className="bg-[#2a2a2a] text-white rounded-full px-5 py-2.5 text-[14px] hover:bg-black"
              >
                Anlegen
              </button>
              <button
                onClick={() => setAddingCategory(false)}
                className="border border-line rounded-full px-4 py-2.5 text-[14px] text-muted hover:bg-panel"
              >
                Abbrechen
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAddingCategory(true)}
              className="border border-line rounded-[20px] px-5 py-4 flex items-center justify-center gap-2 text-[15px] text-muted hover:bg-panel transition-colors"
            >
              <Plus size={15} />
              Eigene Kostenart hinzufügen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
