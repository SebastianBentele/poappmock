import type { Msg, Tr } from "@/components/arbio-chat";

// Central, on-brand summaries for every KPI, chart and quick-chip. Keyed by a
// stable metric key (language-independent) so the same key works in DE and EN.
type Insight = { q: [string, string]; a: [string, string] };

const INSIGHTS: Record<string, Insight> = {
  // ---- KPIs (shared between home and the revenue page) ----
  revenue: {
    q: ["Fass mir meinen Umsatz zusammen.", "Summarize my revenue for me."],
    a: [
      "Dein Umsatz im Juli liegt bei 41.451 € — 7,6 % über dem Vorjahr. Getragen wird das vor allem von einer höheren Durchschnittsrate (241 €), die die saisonal etwas niedrigere Auslastung mehr als ausgleicht. Preise und Verfügbarkeiten steuert das Revenue-Team täglich für dich — du musst nichts tun.",
      "Your July revenue is €41,451 — 7.6% above last year. It's driven mainly by a higher average rate (€241), which more than offsets the seasonally lower occupancy. Prices and availability are managed daily by the Revenue team — you don't need to do anything.",
    ],
  },
  occupancy: {
    q: ["Wie steht es um meine Auslastung?", "How's my occupancy doing?"],
    a: [
      "Deine Auslastung liegt bei 55,5 % — 9 % unter dem Vorjahr zum gleichen Stichtag. Das ist bewusst so: Arbio schützt margenstarke Nächte über die Preissteuerung, statt Auslastung um jeden Preis zu kaufen. Netto steigt dein Umsatz trotzdem, weil die Durchschnittsrate deutlich höher liegt.",
      "Your occupancy is 55.5% — 9% below last year at the same date. That's by design: Arbio protects high-margin nights through pricing rather than buying occupancy at any cost. Net revenue still rises because the average rate is considerably higher.",
    ],
  },
  adr: {
    q: ["Wie entwickelt sich meine Tagesrate?", "How's my daily rate developing?"],
    a: [
      "Deine durchschnittliche Tagesrate (ADR) liegt bei 241 € — 37 € über dem Vorjahr. Das Revenue-Team hebt die Rate dynamisch in Nachfragespitzen an und stützt so deinen Umsatz auch bei etwas geringerer Auslastung.",
      "Your average daily rate (ADR) is €241 — €37 above last year. The Revenue team raises the rate dynamically during demand peaks, supporting your revenue even at slightly lower occupancy.",
    ],
  },
  profit: {
    q: ["Wie profitabel bin ich gerade?", "How profitable am I right now?"],
    a: [
      "Dein operativer Gewinn im Juli liegt bei rund 27.300 € — etwa 66 % operative Marge nach Arbio-Management-Fee und allen Betriebskosten. Über die letzten Monate zeigt der Gewinn einen klaren Aufwärtstrend in die Sommersaison. Die Gesamtkosten liegen bei 11.439 €, dein Umsatz wuchs aber schneller.",
      "Your operating profit in July is around €27,300 — roughly a 66% operating margin after the Arbio management fee and all operating costs. Over recent months profit shows a clear upward trend into the summer season. Total costs are €11,439, but your revenue grew faster.",
    ],
  },
  los: {
    q: ["Was sagt meine Aufenthaltsdauer?", "What does my length of stay tell me?"],
    a: [
      "Deine durchschnittliche Aufenthaltsdauer liegt bei 6,5 Nächten — stabil zum Vorjahr. Längere Aufenthalte senken deine Reinigungs- und Turnover-Kosten pro Nacht. Nur 8 % sind 1-Nacht-Buchungen, was auf eine gesunde Buchungsstruktur hindeutet.",
      "Your average length of stay is 6.5 nights — stable versus last year. Longer stays lower your cleaning and turnover costs per night. Only 8% are one-night bookings, which points to a healthy booking structure.",
    ],
  },

  // ---- Home quick-chips ----
  "weekly-revenue": {
    q: ["Gib mir eine Zusammenfassung zum wöchentlichen Umsatz.", "Give me a summary of my weekly revenue."],
    a: [
      "Dein wöchentlicher Umsatz liegt aktuell bei rund 9.600 € und damit stabil über den letzten vier Wochen. Die laufende Woche liegt leicht über dem Schnitt — getragen von zwei längeren Buchungen im Altstadt Apartment und Kiez Apartment. Für die nächsten zwei Wochen ist die Pipeline zu ~56 % gefüllt; das Revenue-Team justiert die Preise laufend nach.",
      "Your weekly revenue is currently around €9,600, stable over the last four weeks. The current week is slightly above average — driven by two longer bookings at Altstadt Apartment and Kiez Apartment. The pipeline for the next two weeks is ~56% filled; the Revenue team keeps adjusting prices.",
    ],
  },
  "top-performer": {
    q: ["Wer sind meine Top-Performer?", "Who are my top performers?"],
    a: [
      "Dein stärkstes Objekt im Juli ist das Altstadt Apartment mit 15.400 € Umsatz, 82 % Auslastung und 265 € ADR — auch bei der Bewertung führend (4,9 ★). Dahinter folgen Garten Apartment (12.900 €) und Altbau Suite Eppendorf (11.600 €). Das Studio Universität liegt wegen des laufenden Wasserschadens temporär zurück.",
      "Your strongest unit in July is Altstadt Apartment with €15,400 revenue, 82% occupancy and a €265 ADR — also the rating leader (4.9 ★). Garten Apartment (€12,900) and Altbau Suite Eppendorf (€11,600) follow. Studio Universität is temporarily behind due to the ongoing water damage.",
    ],
  },
  "booking-pace": {
    q: ["Wie ist mein Buchungstempo?", "How's my booking pace?"],
    a: [
      "Aktuell sind 55,5 % der Nächte des Zeitraums gebucht — zum gleichen Zeitpunkt im Vorjahr waren es 61 %. In den Buchungsfenstern liegst du 8–12 % unter Vorjahr (z. B. 56 % auf 30 Tage vs. 65 % VJ). Das Revenue-Team reagiert mit gezielten Preisanpassungen für die noch offenen Nächte.",
      "Currently 55.5% of the period's nights are booked — versus 61% at the same point last year. Across the booking windows you're 8–12% below last year (e.g. 56% at 30 days vs. 65% LY). The Revenue team responds with targeted price adjustments for the still-open nights.",
    ],
  },
  profitability: {
    q: ["Fass meine Profitabilität zusammen.", "Summarize my profitability."],
    a: [
      "Deine operative Marge liegt bei ~66 %. Aus 41.451 € Bruttoumsatz werden nach USt./Steuern 38.700 € Nettoumsatz und nach allen Kosten rund 27.300 € operativer Gewinn. Größte Kostenblöcke sind die Arbio-Management-Fee (14 % vom GBV) und die OTA-Provision (13 %); alle übrigen Kosten zusammen bleiben unter 1 %.",
      "Your operating margin is ~66%. From €41,451 gross booking value, €38,700 net revenue remains after VAT/taxes, and roughly €27,300 operating profit after all costs. The largest cost blocks are the Arbio management fee (14% of GBV) and OTA commission (13%); everything else combined stays under 1%.",
    ],
  },

  // ---- Revenue-page charts ----
  "rolling-revenue": {
    q: ["Erklär mir den rollierenden Umsatz.", "Explain the rolling revenue."],
    a: [
      "Der rollierende Umsatz zeigt deine letzten 12 Monate inklusive Forecast: bis heute 117.856 € realisiert, mit klarem Sommer-Peak im Juli (43.400 €). Die gestrichelte Linie ist der Forecast, die grauen Linien das Vorjahr zum Vergleich — du liegst durchgehend darüber.",
      "Rolling revenue shows your last 12 months including the forecast: €117,856 realized to date, with a clear summer peak in July (€43,400). The dashed line is the forecast, the grey lines are last year for comparison — you're consistently above them.",
    ],
  },
  growth: {
    q: ["Wie hat sich mein Portfolio mit Arbio entwickelt?", "How has my portfolio grown with Arbio?"],
    a: [
      "Seit der Übernahme durch Arbio ist dein Portfolio-Jahresumsatz von 198.000 € (2023, vor Arbio) auf 337.000 € YTD 2026 gewachsen — +70 %. Treiber sind eine um 34 % höhere ADR (180 → 241 €) und +11 Prozentpunkte Auslastung (61 → 72 %).",
      "Since Arbio took over, your portfolio's annual revenue has grown from €198,000 (2023, pre-Arbio) to €337,000 YTD 2026 — +70%. The drivers are a 34% higher ADR (€180 → €241) and +11 percentage points of occupancy (61 → 72%).",
    ],
  },
  "los-optimization": {
    q: ["Was macht die Aufenthaltsdauer-Optimierung?", "What does length-of-stay optimization do?"],
    a: [
      "Die Verteilung zeigt: 39 % deiner Buchungen sind 4–6 Nächte, nur 8 % Ein-Nacht-Buchungen. Arbio steuert die Mindestaufenthaltsdauer dynamisch — kurze Lücken werden für 1–2-Nächte geöffnet, Hochsaison-Wochenenden für längere Aufenthalte geschützt. Das senkt deine Reinigungskosten pro Nacht bei hoher Auslastung.",
      "The distribution shows 39% of your bookings are 4–6 nights, only 8% one-night stays. Arbio steers the minimum length of stay dynamically — short gaps open for 1–2 nights, peak-season weekends are protected for longer stays. This lowers your cleaning cost per night while keeping occupancy high.",
    ],
  },
  "daily-revenue": {
    q: ["Erklär mir den täglichen Umsatz.", "Explain the daily revenue."],
    a: [
      "Der Chart vergleicht deinen Tagesumsatz dieses Jahr mit dem gleichen Zeitraum im Vorjahr. Im Zeitraum liegst du bei 39.903 € gegenüber 38.534 € Vorjahr — ein Plus, getragen von einzelnen Nachfragespitzen an Wochenenden und um Events.",
      "The chart compares your daily revenue this year against the same period last year. For the period you're at €39,903 versus €38,534 last year — a gain driven by individual demand peaks on weekends and around events.",
    ],
  },
  "daily-occupancy": {
    q: ["Was zeigt die tägliche Auslastung?", "What does the daily occupancy show?"],
    a: [
      "Der Verlauf zeigt deine tägliche Auslastung im Monat gegen das Vorjahr (gestrichelt). Sie schwankt nachfrageabhängig zwischen rund 40 und 88 %, mit stärkeren Wochenenden. Arbio glättet Lücken über Preis und Mindestaufenthalt.",
      "The line shows your daily occupancy over the month versus last year (dashed). It fluctuates with demand between roughly 40 and 88%, with stronger weekends. Arbio smooths gaps via pricing and minimum stay.",
    ],
  },
  "daily-rate": {
    q: ["Was zeigt die tägliche Tagesrate?", "What does the daily rate show?"],
    a: [
      "Der Verlauf zeigt deine erzielte Tagesrate pro Tag gegen das Vorjahr. Sie bewegt sich um rund 240 € und steigt gezielt an nachfragestarken Tagen — so wird Marge statt reiner Auslastung optimiert.",
      "The line shows your achieved daily rate per day versus last year. It sits around €240 and rises deliberately on high-demand days — optimizing margin rather than raw occupancy.",
    ],
  },
  "channel-mix": {
    q: ["Wie ist mein Kanal-Mix?", "What's my channel mix?"],
    a: [
      "71,1 % deines Umsatzes kommen über Booking.com, 17 % über Airbnb und 11,9 % direkt. Direktbuchungen haben mit ~100 % die beste Marge, deshalb baut Arbio den Direktanteil gezielt aus. Die durchschnittliche Netto-Marge über alle Kanäle liegt bei 88,8 %.",
      "71.1% of your revenue comes via Booking.com, 17% via Airbnb and 11.9% direct. Direct bookings have the best margin (~100%), so Arbio deliberately grows the direct share. The average net margin across all channels is 88.8%.",
    ],
  },

  // ---- Finance-page charts ----
  "cost-structure": {
    q: ["Erklär mir meine Kostenstruktur.", "Explain my cost structure."],
    a: [
      "Deine Gesamtkosten liegen bei 13,6 % vom GBV. Größter Block ist die OTA-Provision mit 13,0 % — alle übrigen Positionen (z. B. Reinigung) zusammen unter 1 %. Genau deshalb lohnt sich der Ausbau margenstarker Direktbuchungen.",
      "Your total costs are 13.6% of GBV. The largest block is OTA commission at 13.0% — all other items (e.g. cleaning) combined stay under 1%. That's exactly why growing high-margin direct bookings pays off.",
    ],
  },
  payouts: {
    q: ["Wie sehen meine Auszahlungen aus?", "How do my payouts look?"],
    a: [
      "Deine monatlichen Auszahlungen bewegen sich saisonal zwischen rund 8.000 € (Winter) und 35.000 € (Sommer). Für Juli sind bereits 18.450 € aufgelaufen; die reguläre Auszahlung erfolgt kostenlos am 05.08. Bei Bedarf ist jederzeit eine Sofortauszahlung möglich.",
      "Your monthly payouts move seasonally between roughly €8,000 (winter) and €35,000 (summer). €18,450 has already accrued for July; the regular payout is free on Aug 5. An instant payout is available anytime if you need it.",
    ],
  },
};

export function metricSeed(key: string, t: Tr): Msg[] {
  const ins = INSIGHTS[key];
  if (!ins) {
    return [{ kind: "bot", text: t("Frag mich alles zu diesem Wert.", "Ask me anything about this metric.") }];
  }
  return [
    { kind: "user", text: t(ins.q[0], ins.q[1]) },
    { kind: "bot", text: t(ins.a[0], ins.a[1]) },
  ];
}
