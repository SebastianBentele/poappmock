# Arbio Property Owner App — Design System

AI-first portal where property owners track revenue, occupancy, finance and operations for their short-term-rental units. Two surfaces: a conversational home ("Ask Arbio") and analysis dashboards. Bilingual DE/EN. Trust, calm and clarity over decoration — owners check money here.

## Brand feel

Quietly premium, editorial, Scandinavian-calm. Whitespace does the work. No gradients on content surfaces, no glassmorphism, no drop shadows heavier than `0 1px 3px rgba(0,0,0,0.04)`. The single dramatic element per page is the dark "Portfolio context" AI card.

## Hard rules (explicit owner decisions — never override)

1. Numbers, KPIs and headings are ALWAYS regular weight — no bold/semibold anywhere.
2. Blue (`#3D7BE5`) lives ONLY inside chart graphics (lines, areas, bars, legend swatches). Nav items, active menu states, buttons, links, icons, badges and any clickable chrome are monochrome dark (`#2a2a2a`) — never blue.
3. The AI/chat avatar is the Arbio "A" mark (white A in a dark or translucent circle) — never a sparkles/stars "gemini-style" icon.
4. The brand is the Arbio wordmark logo image, never plain text "Arbio".
5. No tinted backgrounds (green or any color) behind charts, hero figures or KPI cards — white with hairline border, or neutral `#f7f7f7`. Green tint is acceptable only on small status badges (e.g. "Live" pill).
6. Floating/fixed elements (chat pill) must never overlap content at rest — containers get generous bottom padding (≥ pb-32 desktop, ≥ 120px mobile).

## Color

| Token | Value | Use |
|---|---|---|
| background | `#ffffff` | page |
| canvas | `#fafafa` | sidebar, login backdrop |
| panel | `#f7f7f7` | soft cards, KPI tiles, icon chips |
| border | `#ededed` | hairlines everywhere |
| foreground | `#2a2a2a` | text; also solid buttons (hover `#000`) |
| muted | `#717171` | secondary text |
| accent green | `#7db86c` / text `#4f9d4f` | positive deltas, progress |
| negative red | `#c62828` | negative deltas only |
| dark card | `#16171a` | AI/portfolio-context card, white text, warm photo backdrop allowed |
| chart blue | `#3D7BE5` | primary chart series — matched to the designer's screens; area fill `rgba(61,123,229,0.10)`, dotted comparison lines `#A9C3EF` |

Semantic color only in data: green = good delta, red = bad delta, blue = this-year series, dotted gray = comparison series (LY/STLY/forecast). Channel mix: Airbnb `#f43f5e`, Booking `#1e3a8a`, Direct `#22c55e`.

## Typography

"Neue Haas Grotesk Text Pro", Helvetica Neue fallback. Letter-spacing -0.2px body, -0.5px headings.
- Hero greeting: 48px
- Page title: ~24px
- KPI value: 28–34px, tracking -0.5px
- Body/labels: 15px; secondary 13–14px; micro-labels 11px uppercase tracking +1px
- Numbers are the heroes — big, dark, and ALWAYS regular weight. Never bold/semibold/extrabold on KPI values, chart figures or headings; size and tight tracking carry the hierarchy, not weight. (Explicit owner decision — do not override.)

## Shape & spacing

Very round: cards 24px radius, inputs/buttons full-pill (30px+), nav items 22px, icon chips full circle. Generous padding (cards ~px-7 py-5). Hairline borders instead of shadows.

## Components

- **KPI tile**: panel-gray or white+hairline card, 15px label on top, big value, small delta line with ▲/▼ + green/red text and absolute change (e.g. "▲ 7,6 %").
- **Portfolio context card (signature)**: dark `#16171a`, rounded 24px, rows of `label → text` (Signal / Driver / Next step), monospace-ish 11px uppercase label column in muted gray, embedded pill chat input at the bottom ("Ask Arbio AI anything…"). May carry a warm blurred photo in the top-right.
- **Filter bar**: row of pill dropdowns (period, units, city) + segmented pill toggle (All / L2L / New).
- **Charts**: minimal — no gridlines beyond faint horizontals, no axis boxes; blue filled area for this-year, dotted lines for comparisons; legend as small inline items; hover tooltip = white rounded card, hairline border.
- **Chat input**: full-pill, hairline border, mic + submit circle buttons right-aligned.
- **Sidebar (desktop)**: 290px, `#fafafa`, icon-in-circle + label nav items, active = white card + dark filled icon circle; collapsible to 76px.
- **Buttons**: solid dark pill (white text) primary; hairline pill secondary; never blue CTAs.

## Mobile rules (target — the app is being made mobile-ready)

- No sidebar. Single column, full-bleed cards with 16px gutters.
- Top bar: logo left, hamburger right; filters collapse into one horizontally scrollable pill row.
- KPI tiles go 2-up grid, then full-width cards for charts stacked vertically in priority order: KPIs → portfolio context → forecast chart → daily revenue → occupancy/ADR → channel mix → booking pace → breakdown table (as cards, not table).
- Persistent chat entry: floating pill input or bottom bar — chat is the product's spine, must stay one tap away.
- Tap targets ≥ 44px. Tables become stacked rows with label:value pairs.

## Voice

Sentences, not jargon: "Arbio takes care of it — prices are reviewed daily by the revenue team." Numbers formatted EU style (41.451 €, comma decimals). DE and EN both first-class.
