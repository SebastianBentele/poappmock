"use client";

import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  ReferenceLine,
  CartesianGrid,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { useLang, type Lang } from "@/components/lang";

const GREEN = "#7db86c";
const GREEN_LIGHT = "#b9d9ae";
const GRAY = "#9a9a9a";

// Month axis labels are stored canonically in English (e.g. "Mar", "Aug '25").
// For German we map the month part back; the year suffix is preserved.
const MONTH_DE: Record<string, string> = {
  Jan: "Jan", Feb: "Feb", Mar: "Mär", Apr: "Apr", May: "Mai", Jun: "Jun",
  Jul: "Jul", Aug: "Aug", Sep: "Sep", Oct: "Okt", Nov: "Nov", Dec: "Dez",
};
const monthTick = (lang: Lang) => (m: string) => {
  if (lang === "en") return m;
  const [mon, ...rest] = m.split(" ");
  return [MONTH_DE[mon] ?? mon, ...rest].join(" ");
};

const rollingRevenue = [
  { m: "Apr", dj: 21000, fc: null, lj: 6200, vj: 5800 },
  { m: "May", dj: 24500, fc: null, lj: 7400, vj: 6300 },
  { m: "Jun", dj: 29000, fc: null, lj: 6900, vj: 6100 },
  { m: "Jul", dj: 43400, fc: 43400, lj: 7100, vj: 6600 },
  { m: "Aug", dj: null, fc: 39800, lj: 6800, vj: 6400 },
  { m: "Sep", dj: null, fc: 24500, lj: 6500, vj: 6200 },
  { m: "Oct", dj: null, fc: 10800, lj: 6900, vj: 2200 },
  { m: "Nov", dj: null, fc: 1600, lj: 1400, vj: 1300 },
  { m: "Dec", dj: null, fc: 1500, lj: 1600, vj: 1400 },
  { m: "Jan", dj: null, fc: 1400, lj: 1500, vj: 1300 },
  { m: "Feb", dj: null, fc: 1500, lj: 1800, vj: 1400 },
  { m: "Mar", dj: null, fc: 1600, lj: 2100, vj: 1500 },
];

export function RollingRevenueChart() {
  const { lang, t } = useLang();
  return (
    <div className="h-[360px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={rollingRevenue} margin={{ top: 24, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="m"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#717171", fontSize: 13 }}
            tickFormatter={monthTick(lang)}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#717171", fontSize: 13 }}
            tickFormatter={(v: number) => (v === 0 ? "€0" : `€${Math.round(v / 1000)}k`)}
            ticks={[0, 17000, 34000, 50000]}
          />
          <ReferenceLine
            x="Jul"
            stroke="#c5c5c5"
            label={{ value: t("Heute", "Today"), position: "top", fill: "#717171", fontSize: 12 }}
          />
          <Area type="monotone" dataKey="dj" fill="url(#greenFade)" stroke="none" />
          <Line type="monotone" dataKey="dj" stroke={GREEN} strokeWidth={2.5} dot={{ r: 3.5, fill: GREEN }} />
          <Line type="monotone" dataKey="fc" stroke={GREEN} strokeWidth={2} strokeDasharray="6 6" dot={{ r: 3.5, fill: GREEN }} />
          <Line type="monotone" dataKey="lj" stroke={GRAY} strokeWidth={1.5} dot={false} />
          <Line type="monotone" dataKey="vj" stroke={GRAY} strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
          <defs>
            <linearGradient id="greenFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GREEN} stopOpacity={0.25} />
              <stop offset="100%" stopColor={GREEN} stopOpacity={0.02} />
            </linearGradient>
          </defs>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

const dailyRevenue = Array.from({ length: 62 }, (_, i) => {
  const wave = Math.sin(i / 4.5) * 0.4 + 0.9;
  const spike = i % 13 === 0 ? 1.6 : 1;
  return {
    d: i,
    dj: Math.round((420 + ((i * 137) % 700)) * wave * spike),
    vj: Math.round((360 + ((i * 91) % 520)) * wave),
  };
});

export function DailyRevenueChart() {
  return (
    <div className="h-[230px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={dailyRevenue} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={0}>
          <XAxis dataKey="d" hide />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#717171", fontSize: 13 }}
            tickFormatter={(v: number) => (v === 0 ? "€0" : `€${Math.round(v / 1000)}k`)}
            ticks={[0, 1000, 2000]}
          />
          <Bar dataKey="dj" fill={GREEN} radius={[2, 2, 0, 0]} />
          <Bar dataKey="vj" fill={GREEN_LIGHT} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const payouts = [
  { m: "Aug '25", v: 31200, current: false },
  { m: "Sep", v: 27400, current: false },
  { m: "Oct", v: 19800, current: false },
  { m: "Nov", v: 8200, current: false },
  { m: "Dec", v: 9400, current: false },
  { m: "Jan '26", v: 8100, current: false },
  { m: "Feb", v: 11600, current: false },
  { m: "Mar", v: 21500, current: false },
  { m: "Apr", v: 26800, current: false },
  { m: "May", v: 30400, current: false },
  { m: "Jun", v: 34900, current: false },
  { m: "Jul", v: 18450, current: true },
];

export function PayoutChart() {
  const { lang } = useLang();
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={payouts} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="m"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#717171", fontSize: 13 }}
            tickFormatter={monthTick(lang)}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#717171", fontSize: 13 }}
            tickFormatter={(v: number) => (v === 0 ? "€0" : `€${Math.round(v / 1000)}k`)}
            ticks={[0, 12000, 24000, 36000]}
          />
          <Bar dataKey="v" radius={[10, 10, 10, 10]}>
            {payouts.map((p) => (
              <Cell key={p.m} fill={p.current ? GREEN : GREEN_LIGHT} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Two months of daily data (1..30, 1..30), deterministic
const dailyKpis = Array.from({ length: 60 }, (_, i) => {
  const day = (i % 30) + 1;
  const w1 = Math.sin(i / 3.2) * 0.5 + Math.sin(i / 8.5) * 0.3;
  const w2 = Math.sin((i + 9) / 4.1) * 0.55 + Math.sin(i / 11) * 0.35;
  return {
    d: day,
    occDj: Math.round(Math.min(88, Math.max(30, 55 + w1 * 22))),
    occVj: Math.round(Math.min(95, Math.max(22, 48 + w2 * 30))),
    rateDj: Math.round(Math.min(310, Math.max(185, 240 + w1 * 55))),
    rateVj: Math.round(Math.min(250, Math.max(160, 200 + w2 * 28))),
  };
});

function DailyKpiChart({
  djKey,
  vjKey,
  ticks,
  formatter,
  domain,
}: {
  djKey: string;
  vjKey: string;
  ticks: number[];
  formatter: (v: number) => string;
  domain: [number, number];
}) {
  return (
    <div className="h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={dailyKpis} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="d"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#717171", fontSize: 12 }}
            ticks={[1, 7, 14, 21, 28]}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#717171", fontSize: 12 }}
            ticks={ticks}
            domain={domain}
            tickFormatter={formatter}
          />
          <Area type="monotone" dataKey={djKey} fill="url(#greenFadeDaily)" stroke="none" />
          <Line type="monotone" dataKey={djKey} stroke={GREEN} strokeWidth={2} dot={false} />
          <Line
            type="monotone"
            dataKey={vjKey}
            stroke="#b5b5b5"
            strokeWidth={1.5}
            strokeDasharray="5 5"
            dot={false}
          />
          <defs>
            <linearGradient id="greenFadeDaily" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GREEN} stopOpacity={0.18} />
              <stop offset="100%" stopColor={GREEN} stopOpacity={0.02} />
            </linearGradient>
          </defs>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DailyOccupancyChart() {
  return (
    <DailyKpiChart
      djKey="occDj"
      vjKey="occVj"
      ticks={[0, 25, 50, 75, 100]}
      domain={[0, 100]}
      formatter={(v) => `${v}%`}
    />
  );
}

export function DailyRateChart() {
  return (
    <DailyKpiChart
      djKey="rateDj"
      vjKey="rateVj"
      ticks={[0, 100, 200, 300, 350]}
      domain={[0, 350]}
      formatter={(v) => `€${v}`}
    />
  );
}

const channels = [
  { name: "Booking.com", value: 71.1, color: "#f5455c" },
  { name: "Airbnb", value: 17.0, color: "#1e3a75" },
  { name: "Direct", value: 11.9, color: "#2fbf4f" },
];

export function ChannelDonut() {
  return (
    <div className="relative h-[220px] w-[220px] mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={channels}
            dataKey="value"
            innerRadius={82}
            outerRadius={96}
            startAngle={90}
            endAngle={-270}
            paddingAngle={3}
            cornerRadius={8}
            stroke="none"
          >
            {channels.map((c) => (
              <Cell key={c.name} fill={c.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[30px] tracking-[-0.5px]">€41.451</span>
      </div>
    </div>
  );
}

const tickets = [
  { m: "Feb", gelöst: 28, offen: 2 },
  { m: "Mar", gelöst: 34, offen: 3 },
  { m: "Apr", gelöst: 31, offen: 2 },
  { m: "May", gelöst: 38, offen: 4 },
  { m: "Jun", gelöst: 44, offen: 2 },
  { m: "Jul", gelöst: 41, offen: 3 },
];

export function TicketsChart() {
  const { lang } = useLang();
  return (
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={tickets} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="m"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#717171", fontSize: 13 }}
            tickFormatter={monthTick(lang)}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#717171", fontSize: 13 }}
            ticks={[0, 15, 30, 45]}
          />
          <Bar dataKey="gelöst" stackId="t" fill={GREEN_LIGHT} radius={[0, 0, 10, 10]} />
          <Bar dataKey="offen" stackId="t" fill="#d3d3d3" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const profitOverTime = [
  { m: "Aug '25", v: 3200 },
  { m: "Sep", v: 2600 },
  { m: "Oct", v: 1400 },
  { m: "Nov", v: 250 },
  { m: "Dec", v: 480 },
  { m: "Jan '26", v: 380 },
  { m: "Feb", v: 900 },
  { m: "Mar", v: 2100 },
  { m: "Apr", v: 2400 },
  { m: "May", v: 2800 },
  { m: "Jun", v: 3300 },
  { m: "Jul", v: 4300 },
];

export function ProfitChart() {
  const { lang } = useLang();
  return (
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={profitOverTime} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="m"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#717171", fontSize: 13 }}
            tickFormatter={monthTick(lang)}
            dy={8}
          />
          <YAxis hide />
          <Bar dataKey="v" fill="#b9d9ae" radius={[10, 10, 10, 10]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Year-on-year revenue trajectory since Arbio took over
const growthByYear = [
  { y: "2023", label: "vor Arbio", v: 198000, pre: true },
  { y: "2024", label: "Jahr 1", v: 246000 },
  { y: "2025", label: "Jahr 2", v: 288000 },
  { y: "2026", label: "YTD", v: 337000, ytd: true },
];

export function GrowthChart() {
  return (
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={growthByYear} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="y"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#717171", fontSize: 13 }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#717171", fontSize: 13 }}
            tickFormatter={(v: number) => `€${Math.round(v / 1000)}k`}
            ticks={[0, 100000, 200000, 300000]}
          />
          <Bar dataKey="v" radius={[10, 10, 10, 10]}>
            {growthByYear.map((d) => (
              <Cell key={d.y} fill={d.pre ? "#d3d3d3" : d.ytd ? GREEN : GREEN_LIGHT} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Length-of-stay distribution
const losShares = [8, 34, 39, 19];

export function LosChart() {
  const { t } = useLang();
  const losBuckets = [
    { b: t("1 Nacht", "1 night"), share: losShares[0] },
    { b: t("2–3 Nächte", "2–3 nights"), share: losShares[1] },
    { b: t("4–6 Nächte", "4–6 nights"), share: losShares[2] },
    { b: t("7+ Nächte", "7+ nights"), share: losShares[3] },
  ];
  return (
    <div className="h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={losBuckets} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="b"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#717171", fontSize: 13 }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#717171", fontSize: 13 }}
            tickFormatter={(v: number) => `${v}%`}
            ticks={[0, 20, 40]}
          />
          <Bar dataKey="share" radius={[10, 10, 10, 10]}>
            {losBuckets.map((d) => (
              <Cell key={d.b} fill={d.share >= 39 ? GREEN : GREEN_LIGHT} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
