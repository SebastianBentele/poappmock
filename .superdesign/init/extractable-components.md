# Extractable components

## Sidebar
- Source: `src/components/sidebar.tsx`
- Category: layout
- Description: 290px left nav; icon-in-circle items, active = white card + dark icon circle; collapsible; past chats; feedback modal; profile card
- Extractable props: activeItem (string, default "/"), collapsed (boolean, default false)
- Hardcoded: Arbio logo image, nav labels/icons, all CSS

## TopBar
- Source: `src/components/top-bar.tsx`
- Category: layout
- Description: page title + subtitle row with language toggle and notification bell
- Extractable props: title (string), subtitle (string), badgeCount (number, default 4)
- Hardcoded: bell icon, toggle styles

## ChatInput
- Source: `src/components/chat-input.tsx`
- Category: basic
- Description: full-pill chat input with mic + submit circle; floats bottom-center on every page offset by var(--sidebar-w)
- Extractable props: placeholder (string)
- Hardcoded: icons, pill styles

## KpiCard
- Source: `src/components/kpi-card.tsx`
- Category: basic
- Description: panel-gray KPI tile; label, big regular-weight value, green/red delta line
- Extractable props: label, value, delta, deltaDirection ("up"|"down")
- Hardcoded: styles

## AiCard
- Source: `src/components/ai-card.tsx`
- Category: basic
- Description: dark #16171a rounded card with A avatar, label→text rows (Result/Why/Arbio takes care), chat hint footer
- Extractable props: title, rows (label+text[]), chatHint
- Hardcoded: dark styling, avatar
