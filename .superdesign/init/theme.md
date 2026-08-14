# Theme tokens

## Part 1 — Compact token summary

- Font: "Neue Haas Grotesk Text Pro", Helvetica Neue fallback; letter-spacing -0.2px body, -0.5px on h1/h2
- Colors: background #ffffff · foreground/text #2a2a2a · canvas/sidebar #fafafa · panel #f7f7f7 · border/hairline #ededed · muted #717171 · accent green #7db86c (text #4f9d4f) · negative red #c62828 · dark AI card #16171a · chart blue (approved direction) #3D7BE5, area fill rgba(61,123,229,0.10), dotted comparison #A9C3EF
- Channel colors: Booking.com #f5455c · Airbnb #1e3a75 · Direct #2fbf4f
- Radii: cards 24px · inner cards 16-18px · nav items 22px · inputs/buttons full pill (30px+)
- Shadows: hairline borders preferred; max card shadow 0 1px 4px rgba(0,0,0,0.03); floating chat 0 4px 20px rgba(0,0,0,0.06)
- Type scale: hero 48px · page title 24px · KPI value 28-34px (ALWAYS regular weight) · body 15px · secondary 13-14px · micro-labels 11px uppercase +1px tracking
- Sidebar width: var(--sidebar-w) 290px (collapsed 76px)
- HARD RULES (owner decisions): no bold on numbers/headings; blue only inside charts; monochrome dark chrome; Arbio wordmark image not text; AI avatar = Arbio "A"; no tinted card backgrounds; see .superdesign/design-system.md

## Part 2 — Raw sources

### src/app/globals.css

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #2a2a2a;
  --sidebar-w: 290px;
  --panel: #f7f7f7;
  --border: #ededed;
  --muted: #717171;
  --green: #7db86c;
  --green-text: #4f9d4f;
  --red: #c62828;
  --dark-card: #16171a;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-panel: var(--panel);
  --color-line: var(--border);
  --color-muted: var(--muted);
  --color-accent: var(--green);
  --color-accent-text: var(--green-text);
  --color-negative: var(--red);
  --font-sans: "Neue Haas Grotesk Text Pro", "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: "Neue Haas Grotesk Text Pro", "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif;
  letter-spacing: -0.2px;
}

h1,
h2 {
  letter-spacing: -0.5px;
}

/* No focus outline anywhere — the portal should never show a ring on click
   (neither the browser's default blue on charts/SVG nor any custom one). */
*:focus,
*:focus-visible {
  outline: none !important;
}

```

### postcss.config.mjs (Tailwind v4 — no tailwind.config file)

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;

```
