"use client";

import { useState } from "react";
import { Calendar, MapPin, Building2, ChevronDown, Check, ChevronLeft, ChevronRight } from "lucide-react";

const ALL_UNITS = [
  { name: "Altstadt Apartment", city: "München" },
  { name: "Studio Universität", city: "München" },
  { name: "Garten Apartment", city: "Berlin" },
];

const CITIES = ["München", "Berlin"];

const periodPresets = [
  "Dieser Monat",
  "Letzter Monat",
  "Dieses Quartal",
  "Dieses Jahr",
  "Letzte 12 Monate",
];

type Open = "period" | "units" | "city" | null;

export function FilterBar({ showStepper = true }: { showStepper?: boolean }) {
  const [open, setOpen] = useState<Open>(null);
  const [period, setPeriod] = useState("Dieser Monat");
  const [custom, setCustom] = useState(false);
  const [units, setUnits] = useState<string[]>([]); // empty = all
  const [city, setCity] = useState<string | null>(null);

  const unitLabel =
    units.length === 0
      ? "Alle Einheiten"
      : units.length === 1
        ? units[0]
        : `${units.length} Einheiten`;

  const toggleUnit = (name: string) =>
    setUnits((u) => (u.includes(name) ? u.filter((x) => x !== name) : [...u, name]));

  const close = () => setOpen(null);

  const btn =
    "flex items-center gap-2 border border-line rounded-full h-11 px-5 text-[15px] bg-white hover:bg-panel";

  return (
    <div className="relative flex items-center gap-3 flex-wrap">
      {/* Backdrop to close dropdowns */}
      {open && <div className="fixed inset-0 z-30" onClick={close} />}

      {/* Period */}
      <div className="relative z-40">
        <div className="flex items-center gap-1 border border-line rounded-full bg-white h-11 pl-1 pr-1">
          {showStepper && (
            <button className="w-8 h-8 rounded-full hover:bg-panel flex items-center justify-center text-muted">
              <ChevronLeft size={16} />
            </button>
          )}
          <button
            onClick={() => setOpen(open === "period" ? null : "period")}
            className="flex items-center gap-2 px-3 text-[15px]"
          >
            <Calendar size={15} />
            {period}
            <ChevronDown size={15} className="text-muted" />
          </button>
          {showStepper && (
            <button className="w-8 h-8 rounded-full hover:bg-panel flex items-center justify-center text-muted">
              <ChevronRight size={16} />
            </button>
          )}
        </div>
        {open === "period" && (
          <div className="absolute left-0 top-12 w-[300px] bg-white border border-line rounded-[20px] shadow-[0_16px_50px_rgba(0,0,0,0.14)] p-2 z-40">
            {periodPresets.map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPeriod(p);
                  setCustom(false);
                  close();
                }}
                className="w-full flex items-center justify-between rounded-[12px] px-4 py-2.5 text-[15px] text-left hover:bg-panel"
              >
                {p}
                {period === p && !custom && <Check size={15} className="text-accent-text" />}
              </button>
            ))}
            <div className="border-t border-line mt-2 pt-2">
              <button
                onClick={() => setCustom(true)}
                className="w-full flex items-center justify-between rounded-[12px] px-4 py-2.5 text-[15px] text-left hover:bg-panel"
              >
                Eigener Zeitraum
                {custom && <Check size={15} className="text-accent-text" />}
              </button>
              {custom && (
                <div className="px-2 pt-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="border border-line rounded-[12px] px-3 py-2">
                      <div className="text-[11px] text-muted">Von</div>
                      <input
                        type="text"
                        defaultValue="01.04.2026"
                        className="w-full text-[14px] outline-none bg-transparent"
                      />
                    </div>
                    <div className="border border-line rounded-[12px] px-3 py-2">
                      <div className="text-[11px] text-muted">Bis</div>
                      <input
                        type="text"
                        defaultValue="30.06.2026"
                        className="w-full text-[14px] outline-none bg-transparent"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setPeriod("01.04. – 30.06.2026");
                      close();
                    }}
                    className="w-full mt-2 bg-[#2a2a2a] text-white rounded-full py-2.5 text-[14px] hover:bg-black"
                  >
                    Anwenden
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Units multi-select */}
      <div className="relative z-40">
        <button onClick={() => setOpen(open === "units" ? null : "units")} className={btn}>
          <MapPin size={15} />
          {unitLabel}
          <ChevronDown size={15} className="text-muted" />
        </button>
        {open === "units" && (
          <div className="absolute left-0 top-12 w-[280px] bg-white border border-line rounded-[20px] shadow-[0_16px_50px_rgba(0,0,0,0.14)] p-2 z-40">
            <button
              onClick={() => setUnits([])}
              className="w-full flex items-center justify-between rounded-[12px] px-4 py-2.5 text-[15px] text-left hover:bg-panel"
            >
              Alle Einheiten
              {units.length === 0 && <Check size={15} className="text-accent-text" />}
            </button>
            <div className="border-t border-line mt-1 pt-1">
              {ALL_UNITS.map((u) => (
                <button
                  key={u.name}
                  onClick={() => toggleUnit(u.name)}
                  className="w-full flex items-center gap-3 rounded-[12px] px-4 py-2.5 text-[15px] text-left hover:bg-panel"
                >
                  <span
                    className={`w-4 h-4 rounded-[5px] border flex items-center justify-center shrink-0 ${
                      units.includes(u.name)
                        ? "bg-[#2a2a2a] border-[#2a2a2a] text-white"
                        : "border-line"
                    }`}
                  >
                    {units.includes(u.name) && <Check size={11} />}
                  </span>
                  <span className="flex-1">{u.name}</span>
                  <span className="text-[12px] text-muted">{u.city}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* City */}
      <div className="relative z-40">
        <button onClick={() => setOpen(open === "city" ? null : "city")} className={btn}>
          <Building2 size={15} />
          {city ?? "Alle Städte"}
          <ChevronDown size={15} className="text-muted" />
        </button>
        {open === "city" && (
          <div className="absolute left-0 top-12 w-[220px] bg-white border border-line rounded-[20px] shadow-[0_16px_50px_rgba(0,0,0,0.14)] p-2 z-40">
            <button
              onClick={() => {
                setCity(null);
                close();
              }}
              className="w-full flex items-center justify-between rounded-[12px] px-4 py-2.5 text-[15px] text-left hover:bg-panel"
            >
              Alle Städte
              {city === null && <Check size={15} className="text-accent-text" />}
            </button>
            {CITIES.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCity(c);
                  close();
                }}
                className="w-full flex items-center justify-between rounded-[12px] px-4 py-2.5 text-[15px] text-left hover:bg-panel"
              >
                {c}
                {city === c && <Check size={15} className="text-accent-text" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
