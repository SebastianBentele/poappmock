# Page dependency trees

## / (Ask Arbio home)
Entry: src/app/page.tsx
Dependencies:
- src/components/chat-input.tsx
- src/components/arbio-chat.tsx (chat overlay + seeds; 991 lines, mostly content seeds)
- src/components/lang.tsx
- src/components/ask-ai.tsx
- src/components/metric-insights.ts (chat seed content)

## /einheiten (Portfolio units)
Entry: src/app/einheiten/page.tsx  (963 lines: L46-175 unit data, L303-460 popup, L462-573 CityMapSvg, L577-962 views)
Dependencies:
- src/components/chat-input.tsx
- src/components/arbio-chat.tsx
- src/components/lang.tsx

## /portfolio (Revenue)
Entry: src/app/portfolio/page.tsx
Dependencies:
- src/components/kpi-card.tsx
- src/components/ai-card.tsx
- src/components/chat-input.tsx
- src/components/filter-bar.tsx
- src/components/charts.tsx (RollingRevenueChart, DailyRevenueChart, DailyOccupancyChart, DailyRateChart, ChannelDonut, GrowthChart, LosChart)
- src/components/lang.tsx
- src/components/ask-ai.tsx

## /finanzen (Finance)
Entry: src/app/finanzen/page.tsx  (L23-69 payout trackers, L71-114 costs/statements/funnel data)
Dependencies:
- src/components/ai-card.tsx
- src/components/chat-input.tsx
- src/components/filter-bar.tsx
- src/components/charts.tsx (ProfitChart, PayoutChart)
- src/components/pnl-table.tsx
- src/components/owner-costs.tsx
- src/components/arbio-chat.tsx (costExplainSeed)
- src/components/lang.tsx
- src/components/ask-ai.tsx

## /operativ (Operations)
Entry: src/app/operativ/page.tsx
Dependencies: chat-input, arbio-chat, lang, ask-ai, charts

## /kalender (Calendar)
Entry: src/app/kalender/page.tsx
Dependencies: chat-input, arbio-chat, lang
