# Routes (Next.js App Router, src/app)

| URL | File | Nav label (EN) | Renders |
|---|---|---|---|
| `/` | src/app/page.tsx | Ask Arbio | Conversational home: greeting, 4 KPI pills, suggestion chips, chat input |
| `/einheiten` | src/app/einheiten/page.tsx | Portfolio | Units: Map (draggable SVG city map + markers + popup) / Overview (carousel) / List views |
| `/portfolio` | src/app/portfolio/page.tsx | Revenue | KPIs + AI card, rolling revenue, growth, LOS optimization, daily revenue/occupancy/rate, channel mix, booking pace |
| `/finanzen` | src/app/finanzen/page.tsx | Finance | Tabs: Profitability (profit hero, funnel, cost structure, P&L) / Payouts (accrued, trackers, history, statements) / Costs |
| `/operativ` | src/app/operativ/page.tsx | Operations | Review insights, tickets chart+list, guest comms |
| `/kalender` | src/app/kalender/page.tsx | Calendar | Unit booking timeline with hover tooltips, own-stay modal |
| `/profil` | src/app/profil/page.tsx | Profile | Account settings |

All pages are wrapped by the sidebar shell in layout.tsx; every page has a floating chat input pinned bottom-center offset by `var(--sidebar-w)`.

## next.config.ts (redirects)

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/profitability", destination: "/finanzen", permanent: false },
      { source: "/payouts", destination: "/finanzen", permanent: false },
      { source: "/anfrage", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;

```
