"use client";

import { Info } from "lucide-react";
import { KpiCard } from "@/components/kpi-card";
import { AiCard } from "@/components/ai-card";
import { ChatInput } from "@/components/chat-input";
import { FilterBar } from "@/components/filter-bar";
import {
  RollingRevenueChart,
  DailyRevenueChart,
  DailyOccupancyChart,
  DailyRateChart,
  ChannelDonut,
  GrowthChart,
  LosChart,
} from "@/components/charts";
import { Info as InfoIcon } from "lucide-react";
import { useLang } from "@/components/lang";
import { AskAi } from "@/components/ask-ai";

export default function Portfolio() {
  const { t } = useLang();

  const growthStats = [
    { label: t("Umsatz p.a.", "Revenue p.a."), then: "€198k", now: "€337k", delta: "+70 %" },
    { label: t("Ø Tagesrate (ADR)", "Avg. daily rate (ADR)"), then: "€180", now: "€241", delta: "+34 %" },
    { label: t("Auslastung", "Occupancy"), then: "61 %", now: "72 %", delta: t("+11 Pp.", "+11 pts") },
  ];

  const channelRows = [
    { color: "#f5455c", name: "Booking.com", marge: t("85% Marge", "85% margin"), share: "71,1%", value: "€29.475", width: "71%" },
    { color: "#1e3a75", name: "Airbnb", marge: t("97% Marge", "97% margin"), share: "17,0%", value: "€7.040", width: "17%" },
    { color: "#2fbf4f", name: "Direct", marge: t("100% Marge", "100% margin"), share: "11,9%", value: "€4.936", width: "12%" },
  ];

  const bookingWindows = [
    { label: t("90 Tage vorher", "90 days out"), value: "39%", delta: "-12,5%", vj: t("Gleicher Zeitraum VJ: 52%", "Same period LY: 52%") },
    { label: t("60 Tage vorher", "60 days out"), value: "51%", delta: "-8,2%", vj: t("Gleicher Zeitraum VJ: 59%", "Same period LY: 59%") },
    { label: t("30 Tage vorher", "30 days out"), value: "56%", delta: "-9,7%", vj: t("Gleicher Zeitraum VJ: 65%", "Same period LY: 65%") },
  ];

  const DjVjLegend = () => (
    <div className="flex gap-5 text-[13px] text-muted">
      <span className="flex items-center gap-2">
        <span className="w-4 h-[2.5px] bg-accent inline-block rounded" /> {t("DJ", "TY")}
      </span>
      <span className="flex items-center gap-2">
        <span className="w-4 h-[2px] inline-block rounded border-t-2 border-dashed border-[#b5b5b5]" /> {t("VJ", "LY")}
      </span>
    </div>
  );

  return (
    <div className="relative min-h-screen px-8 py-6 pb-32">
      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <FilterBar />
        <div className="flex items-center border border-line rounded-full p-1">
          <button className="bg-[#2a2a2a] text-white rounded-full px-5 py-1.5 text-[15px]">
            {t("Alle", "All")}
          </button>
          <button className="px-4 py-1.5 text-[15px] text-muted">L2L</button>
          <button className="px-4 py-1.5 text-[15px] text-muted">{t("Neue", "New")}</button>
        </div>
        <button className="w-10 h-10 border border-line rounded-full flex items-center justify-center text-muted">
          <Info size={15} />
        </button>
      </div>

      {/* KPI grid + AI card */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.15fr] gap-4">
        <div className="grid grid-cols-2 gap-4">
          <KpiCard label={t("Umsatz", "Revenue")} value="€41.451" delta="7,6%" deltaDirection="up" />
          <KpiCard label={t("Auslastung", "Occupancy")} value="55,5%" delta="9,0%" deltaDirection="down" />
          <KpiCard label={t("Ø Tagesrate", "Avg. daily rate")} value="€241" delta="€37" deltaDirection="up" />
          <KpiCard label={t("Ø Aufenthaltsdauer", "Avg. length of stay")} value={t("6,5 Nächte", "6.5 nights")} delta={t("0,0 Nächte", "0.0 nights")} deltaDirection="up" />
        </div>
        <AiCard
          title={t("Dein Portfolio. Auf einen Blick.", "Your portfolio. At a glance.")}
          rows={[
            {
              label: t("Ergebnis", "Result"),
              text: t(
                "Dein Umsatz steigt auf 41.451 € — 7,6 % über dem Vorjahr. Dein Portfolio läuft großartig.",
                "Your revenue rises to €41,451 — 7.6% above last year. Your portfolio is performing great."
              ),
            },
            {
              label: t("Warum", "Why"),
              text: t(
                "Arbio hat die Durchschnittsrate auf 241 € optimiert — das gleicht die saisonal geringere Auslastung bei stabilen 6,5 Nächten mehr als aus.",
                "Arbio optimized the average rate to €241 — more than offsetting the seasonally lower occupancy at a stable 6.5 nights."
              ),
            },
            {
              label: t("Arbio kümmert sich", "Arbio takes care of it"),
              text: t(
                "Preise und Verfügbarkeiten werden täglich vom Revenue-Team überprüft — du musst nichts tun.",
                "Prices and availability are reviewed daily by the Revenue team — you don't need to do anything."
              ),
            },
          ]}
          chatHint={t("Details im Chat fragen", "Ask for details in chat")}
        />
      </div>

      {/* Rolling revenue */}
      <div className="group relative bg-white border border-line rounded-[24px] p-7 mt-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <AskAi label={t("Rollierender Umsatz", "Rolling revenue")} />
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-[16px]">{t("Rollierender Umsatz", "Rolling revenue")}</h3>
            <p className="text-[13px] text-muted mt-0.5">Apr 2026 - Mar 2027</p>
          </div>
          <div className="text-right">
            <div className="text-[15px] text-muted">{t("Ist-Wert bis heute", "Actual to date")}</div>
            <div className="text-[30px] tracking-[-0.5px]">€117.856</div>
          </div>
        </div>
        <RollingRevenueChart />
        <div className="flex gap-7 mt-3 text-[13px] text-muted">
          <span className="flex items-center gap-2">
            <span className="w-4 h-[2.5px] bg-accent inline-block rounded" /> {t("Dieses Jahr", "This year")}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-[2.5px] inline-block rounded border-t-[2.5px] border-dashed border-accent" /> {t("Forecast", "Forecast")}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-[2px] bg-[#9a9a9a] inline-block rounded" /> {t("Letztes Jahr", "Last year")}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-[2px] inline-block rounded border-t-2 border-dashed border-[#9a9a9a]" /> {t("Vorjahr", "Prior year")}
          </span>
        </div>
      </div>

      {/* Growth with Arbio (YoY, accented) */}
      <div className="group relative bg-white border border-line rounded-[24px] p-7 mt-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <AskAi label={t("Dein Wachstum mit Arbio", "Your growth with Arbio")} />
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.3fr] gap-8">
          <div>
            <h3 className="text-[16px]">{t("Dein Wachstum mit Arbio", "Your growth with Arbio")}</h3>
            <p className="text-[13px] text-muted mt-0.5">{t("Seit Beginn 2024 · über alle Einheiten", "Since 2024 · across all units")}</p>
            <div className="flex flex-col gap-3 mt-5">
              {growthStats.map(({ label, then, now, delta }) => (
                <div
                  key={label}
                  className="flex items-center justify-between bg-panel rounded-[16px] px-5 py-4"
                >
                  <div>
                    <div className="text-[14px]">{label}</div>
                    <div className="text-[13px] text-muted mt-0.5">
                      {then} → <span className="text-foreground">{now}</span>
                    </div>
                  </div>
                  <span className="text-[22px] tracking-[-0.5px] text-accent-text">{delta}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-start justify-between">
              <span className="text-[15px] text-muted">{t("Portfolio-Umsatz pro Jahr", "Portfolio revenue per year")}</span>
              <span className="text-[13px] text-muted">{t("seit Beginn +70 %", "since start +70%")}</span>
            </div>
            <div className="mt-2">
              <GrowthChart />
            </div>
          </div>
        </div>
      </div>

      {/* Length-of-stay optimization */}
      <div className="group relative bg-white border border-line rounded-[24px] p-7 mt-5 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
        <AskAi label={t("Aufenthaltsdauer-Optimierung", "Length-of-stay optimization")} />
        <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-8">
          <div>
            <h3 className="text-[16px]">{t("Aufenthaltsdauer-Optimierung", "Length-of-stay optimization")}</h3>
            <p className="text-[13px] text-muted mt-0.5">
              {t("Verteilung der Buchungen nach Aufenthaltsdauer · Juli", "Distribution of bookings by length of stay · July")}
            </p>
            <div className="mt-4">
              <LosChart />
            </div>
          </div>
          <div className="flex flex-col justify-center gap-4">
            <div className="flex gap-6">
              <div className="flex-1 bg-panel rounded-[16px] px-5 py-4">
                <div className="text-[13px] text-muted">{t("Ø Aufenthaltsdauer", "Avg. length of stay")}</div>
                <div className="text-[26px] tracking-[-0.5px] mt-0.5">{t("6,5 Nächte", "6.5 nights")}</div>
              </div>
              <div className="flex-1 bg-panel rounded-[16px] px-5 py-4">
                <div className="text-[13px] text-muted">{t("1-Nacht-Anteil", "1-night share")}</div>
                <div className="text-[26px] tracking-[-0.5px] mt-0.5">8 %</div>
              </div>
            </div>
            <div className="bg-[#f1f6ee] rounded-[16px] px-5 py-4">
              <div className="flex items-center gap-2 text-[13px] text-accent-text">
                <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[11px]">
                  A
                </span>
                {t("Was Arbio hier tut", "What Arbio does here")}
              </div>
              <p className="text-[14px] leading-snug mt-2">
                {t(
                  "Arbio steuert deine Mindestaufenthaltsdauer dynamisch: kurze Lücken werden für 1–2-Nächte-Buchungen geöffnet, Hochsaison-Wochenenden für längere Aufenthalte geschützt. So sinken deine Reinigungs- und Turnover-Kosten pro Nacht, während die Auslastung hoch bleibt.",
                  "Arbio steers your minimum length of stay dynamically: short gaps are opened for 1–2-night bookings, peak-season weekends protected for longer stays. This lowers your cleaning and turnover costs per night while keeping occupancy high."
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Daily revenue + side stats */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-4 mt-5">
        <div className="group relative bg-white border border-line rounded-[24px] p-7 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <AskAi label={t("Täglicher Umsatz", "Daily revenue")} />
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[16px]">{t("Täglicher Umsatz", "Daily revenue")}</h3>
              <p className="text-[14px] text-muted mt-0.5">
                {t("Dieses Jahr im Vergleich zum gleichen Zeitraum Vorjahr", "This year vs. the same period last year")}
              </p>
            </div>
            <div className="flex gap-4 text-[13px] text-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-accent inline-block" /> {t("DJ", "TY")}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#b9d9ae] inline-block" /> {t("VJ", "LY")}
              </span>
            </div>
          </div>
          <div className="mt-4">
            <DailyRevenueChart />
          </div>
        </div>
        <div className="bg-white border border-line rounded-[24px] p-7 shadow-[0_1px_4px_rgba(0,0,0,0.03)] flex flex-col justify-end gap-6">
          <div>
            <div className="text-[15px] text-muted">{t("Umsatz gleicher Zeitraum VJ", "Revenue same period LY")}</div>
            <div className="text-[32px] tracking-[-0.5px] mt-1">€38.534</div>
          </div>
          <div>
            <div className="text-[15px] text-muted">{t("Zuwachs", "Growth")}</div>
            <div className="text-[32px] tracking-[-0.5px] mt-1 text-accent-text">€39.903</div>
          </div>
        </div>
      </div>

      {/* Daily occupancy + daily rate */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-5">
        {[
          { title: t("Tägliche Auslastung", "Daily occupancy"), chart: <DailyOccupancyChart /> },
          { title: t("Tägliche Tagesrate", "Daily rate"), chart: <DailyRateChart /> },
        ].map(({ title, chart }) => (
          <div
            key={title}
            className="group relative bg-white border border-line rounded-[24px] p-7 shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
          >
            <AskAi label={title} />
            <div className="flex items-start justify-between">
              <h3 className="text-[13px] tracking-[1.5px] uppercase text-muted">{title}</h3>
              <DjVjLegend />
            </div>
            <div className="mt-4">{chart}</div>
            <p className="text-[12px] text-muted mt-3">{t("* DJ = Dieses Jahr · VJ = Vorjahr", "* TY = This year · LY = Last year")}</p>
          </div>
        ))}
      </div>

      {/* Channel mix + booking pace */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.5fr] gap-4 mt-5">
        <div className="group relative bg-white border border-line rounded-[24px] p-7 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <AskAi label={t("Kanal-Mix", "Channel mix")} />
          <div className="flex items-start justify-between">
            <h3 className="text-[17px]">{t("Kanal-Mix", "Channel mix")}</h3>
            <div className="text-right">
              <span className="flex items-center gap-1.5 text-[15px] text-muted justify-end">
                {t("Ø Netto-Marge", "Avg. net margin")} <InfoIcon size={13} />
              </span>
              <div className="text-[24px] tracking-[-0.5px] mt-1">88,8%</div>
            </div>
          </div>
          <div className="mt-4">
            <ChannelDonut />
          </div>
          <div className="flex flex-col mt-6">
            {channelRows.map(({ color, name, marge, share, value, width }, i) => (
              <div key={name} className={`py-4 ${i > 0 ? "border-t border-line" : ""}`}>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-[16px]">{name}</span>
                    <span className="flex items-center gap-1 text-[14px] text-muted">
                      {marge} <InfoIcon size={12} />
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="block text-[16px]">{share}</span>
                    <span className="block text-[15px] text-muted">{value}</span>
                  </span>
                </div>
                <div className="h-[5px] bg-panel rounded-full overflow-hidden mt-3 max-w-[75%]">
                  <div
                    className="h-full rounded-full"
                    style={{ width, backgroundColor: color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="group relative bg-white border border-line rounded-[24px] p-7 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
          <AskAi label={t("Buchungstempo", "Booking pace")} />
          <h3 className="text-[17px]">{t("Buchungstempo", "Booking pace")}</h3>
          <p className="text-[14px] text-muted mt-1">
            {t(
              "Zeigt, wie stark der Zeitraum heute und in den 30/60/90-Tage-Buchungsfenstern gebucht ist.",
              "Shows how strongly the period is booked today and in the 30/60/90-day booking windows."
            )}
          </p>

          <div className="flex items-end justify-between mt-7">
            <div>
              <div className="text-[44px] leading-none tracking-[-1px]">55,5%</div>
              <div className="text-[16px] mt-1.5">{t("der Nächte bisher gebucht", "of nights booked so far")}</div>
            </div>
            <div className="text-right">
              <div className="text-[14px] text-muted">{t("Gleicher Zeitpunkt im Vorjahr", "Same point last year")}</div>
              <div className="text-[30px] tracking-[-0.5px]">61,0%</div>
              <div className="text-[14px] text-accent-text">{t("-5,5% ggü. gleichem Zeitraum VJ", "-5.5% vs. same period LY")}</div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-[16px] bg-panel rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: "55.5%" }} />
              </div>
              <span className="text-[13px] text-muted w-[70px]">{t("DJ", "TY")} 55,5%</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-[16px] bg-panel rounded-full overflow-hidden">
                <div className="h-full bg-[#c9c9c9] rounded-full" style={{ width: "61%" }} />
              </div>
              <span className="text-[13px] text-muted w-[70px]">{t("VJ", "LY")} 61,0%</span>
            </div>
          </div>

          <h4 className="text-[17px] mt-8">{t("Buchungsfenster", "Booking windows")}</h4>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {bookingWindows.map(({ label, value, delta, vj }) => (
              <div key={label} className="border border-line rounded-[18px] px-5 py-4">
                <div className="text-[14px] text-muted">{label}</div>
                <div className="text-[34px] tracking-[-0.5px] mt-2">{value}</div>
                <div className="text-[14px] text-accent-text mt-1">{delta}</div>
                <div className="text-[13px] text-muted mt-1">{vj}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating chat */}
      <div className="fixed bottom-6 left-[290px] right-0 flex justify-center px-8 pointer-events-none">
        <ChatInput
          placeholder={t("Frag alles über deinen Umsatz...", "Ask anything about your revenue...")}
          className="w-full max-w-[620px] pointer-events-auto"
        />
      </div>
    </div>
  );
}
