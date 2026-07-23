# Argus — UI Specification

> The definitive visual and interaction specification for every surface in Argus.
> This document is the single source of truth for how Argus looks, feels, and behaves.

---

## Table of Contents

1. [Brand Personality](#1-brand-personality)
2. [Visual Direction](#2-visual-direction)
3. [Color Palette](#3-color-palette)
4. [Typography](#4-typography)
5. [Spacing & Layout Grid](#5-spacing--layout-grid)
6. [Border Radius](#6-border-radius)
7. [Shadows & Elevation](#7-shadows--elevation)
8. [Border Styles](#8-border-styles)
9. [Card Styles](#9-card-styles)
10. [Table Styles](#10-table-styles)
11. [Form Styles](#11-form-styles)
12. [Button Styles](#12-button-styles)
13. [Badge Styles](#13-badge-styles)
14. [Empty States](#14-empty-states)
15. [Skeletons](#15-skeletons)
16. [Loading Animations](#16-loading-animations)
17. [Toast Style](#17-toast-style)
18. [Modal & Dialog Style](#18-modal--dialog-style)
19. [Command Palette](#19-command-palette)
20. [Sidebar & Navigation](#20-sidebar--navigation)
21. [Responsive Breakpoints](#21-responsive-breakpoints)
22. [Mobile Behavior](#22-mobile-behavior)
23. [Tablet Behavior](#23-tablet-behavior)
24. [Micro-interactions & Motion](#24-micro-interactions--motion)
25. [Iconography](#25-iconography)
26. [Accessibility Baseline](#26-accessibility-baseline)

---

## 1. Brand Personality

### Who is Argus?

Argus is the **intelligent eye** over open-source. Named after the hundred-eyed giant of Greek myth, it watches everything so developers don't have to. It distills signal from noise.

### Brand Attributes

| Attribute | Description |
|-----------|-------------|
| **Intelligent** | AI is the core value prop. The UI should feel like it's *thinking* — not decorative, but purposeful. Every AI insight is surfaced with quiet confidence, never with hype. |
| **Precise** | Every pixel matters. Tight spacing, consistent alignment, no visual waste. Like a well-formatted codebase. |
| **Fast** | The interface should feel instant. No unnecessary transitions. Skeletons over spinners. Optimistic updates over loading screens. |
| **Trustworthy** | Developers are skeptical. The UI earns trust through clarity, not through flashiness. Data is always transparent. AI confidence is never overstated. |
| **Developer-native** | This is a tool built by developers, for developers. Keyboard shortcuts, monospace where it matters, information density that respects intelligence. |

### Voice & Tone

| Context | Tone | Example |
|---------|------|---------|
| **Page headings** | Direct, no fluff | "Feed" not "Your personalized issue discovery feed ✨" |
| **Empty states** | Helpful, not cute | "No bookmarks yet. Save issues from your feed to find them here." |
| **Error messages** | Honest, actionable | "Couldn't load recommendations. Check your connection and try again." |
| **AI analysis labels** | Factual, measured | "Estimated difficulty: Intermediate" not "This one's a bit tricky! 🤔" |
| **Tooltips** | Terse, informative | "Match score based on your skills and this issue's requirements" |

### Brand comparisons

| Reference | What we borrow | What we avoid |
|-----------|---------------|---------------|
| **Linear** | Information density, sidebar nav, keyboard-first UX, monochrome palette with color accents only for status | Their custom cursor, excessive custom components |
| **Vercel** | Clean dark backgrounds, premium typography, generous whitespace on marketing pages, subtle gradients | Over-animation on dashboard, too much whitespace in app |
| **Stripe Dashboard** | Table design, card elevation system, structured data presentation, professional tone | Light-mode-first approach, complex multi-panel layouts |
| **GitHub** | Issue/PR mental model, label system, repository cards, developer familiarity | Visual clutter, inconsistent spacing, dated component patterns |

---

## 2. Visual Direction

### Design Principles

```
1. CONTENT FIRST
   The UI is a frame, not a painting.
   Issue data, AI insights, and match scores are the stars.
   Chrome (sidebar, topbar, borders) should recede.

2. DARK CANVAS
   Dark mode is the default and primary experience.
   The background is near-black. Content floats on
   elevated surfaces. Light mode exists but is secondary.

3. MONOCHROME + SIGNAL COLOR
   The base palette is grayscale (oklch neutral axis).
   Color is used ONLY to encode meaning:
   - Green = beginner / open / success
   - Amber = intermediate / warning
   - Red = advanced / error / destructive
   - Blue = accent / interactive / match score

4. DENSITY WITH BREATHING ROOM
   Information-dense but never cramped.
   Cards have 16-20px internal padding.
   List items have 12px vertical rhythm.
   Sections are separated by 32-48px.

5. MOTION AS COMMUNICATION
   Animation exists to communicate state change,
   not to decorate. Entrances are fast (200ms).
   Exits are faster (150ms). Nothing bounces.
```

### Visual Hierarchy

```
Layer 0 — Page background         oklch(0.09 0 0)
Layer 1 — Sidebar, content area   oklch(0.09 0 0)  (same, flat)
Layer 2 — Cards, panels            oklch(0.13 0 0)  (lifted)
Layer 3 — Popovers, dropdowns     oklch(0.16 0 0)  (floating)
Layer 4 — Dialogs, command palette oklch(0.14 0 0)  (with shadow-lg + backdrop)
Layer 5 — Toasts                   oklch(0.18 0 0)  (highest, with border)
```

Visual inspiration: imagine Vercel's dashboard darkness combined with Linear's information density and Stripe's structured data precision.

---

## 3. Color Palette

### 3.1 Neutral Scale (Dark Mode — Primary)

The entire grayscale uses `oklch` on the neutral axis (chroma = 0).

| Token | OKLCH Value | Hex Approx. | Usage |
|-------|-------------|-------------|-------|
| `neutral-1` | `oklch(0.09 0 0)` | `#121212` | Page background, root |
| `neutral-2` | `oklch(0.11 0 0)` | `#181818` | Sidebar background |
| `neutral-3` | `oklch(0.13 0 0)` | `#1e1e1e` | Card background, surface |
| `neutral-4` | `oklch(0.16 0 0)` | `#262626` | Hover backgrounds, elevated surface |
| `neutral-5` | `oklch(0.20 0 0)` | `#2f2f2f` | Active/pressed backgrounds |
| `neutral-6` | `oklch(0.25 0 0)` | `#3a3a3a` | Strong borders, focus rings |
| `neutral-7` | `oklch(0.35 0 0)` | `#525252` | Disabled text, placeholder icons |
| `neutral-8` | `oklch(0.45 0 0)` | `#666666` | Placeholder text |
| `neutral-9` | `oklch(0.55 0 0)` | `#808080` | Secondary text, labels |
| `neutral-10` | `oklch(0.65 0 0)` | `#999999` | Tertiary text, timestamps |
| `neutral-11` | `oklch(0.82 0 0)` | `#c4c4c4` | Body text |
| `neutral-12` | `oklch(0.93 0 0)` | `#ebebeb` | Headings, primary text |
| `neutral-13` | `oklch(0.97 0 0)` | `#f5f5f5` | Emphasized text, active nav |

### 3.2 Neutral Scale (Light Mode — Secondary)

| Token | OKLCH Value | Hex Approx. | Usage |
|-------|-------------|-------------|-------|
| `neutral-1` | `oklch(0.99 0 0)` | `#fcfcfc` | Page background |
| `neutral-2` | `oklch(0.97 0 0)` | `#f5f5f5` | Sidebar background |
| `neutral-3` | `oklch(0.95 0 0)` | `#eeeeee` | Card background |
| `neutral-4` | `oklch(0.92 0 0)` | `#e5e5e5` | Hover backgrounds |
| `neutral-9` | `oklch(0.45 0 0)` | `#666666` | Secondary text |
| `neutral-12` | `oklch(0.15 0 0)` | `#1a1a1a` | Headings, primary text |

### 3.3 Signal Colors

Color is never decorative. Each hue has exactly one semantic meaning.

#### Blue — Accent / Interactive

| Token | Value | Usage |
|-------|-------|-------|
| `accent-dim` | `oklch(0.40 0.12 250)` | Subtle backgrounds for accent badges |
| `accent-muted` | `oklch(0.55 0.14 250)` | Secondary accent text |
| `accent-base` | `oklch(0.65 0.16 250)` | Default accent — links, active indicators |
| `accent-bright` | `oklch(0.75 0.15 250)` | Primary buttons, high match scores |
| `accent-hover` | `oklch(0.80 0.14 250)` | Button hover state |
| `accent-glow` | `oklch(0.75 0.15 250 / 15%)` | Glow effects on accent elements |

#### Green — Beginner / Open / Success

| Token | Value | Usage |
|-------|-------|-------|
| `green-dim` | `oklch(0.25 0.06 155)` | Badge background (dark mode) |
| `green-base` | `oklch(0.72 0.19 155)` | Badge text, status dots, difficulty indicator |
| `green-bright` | `oklch(0.82 0.16 155)` | Emphasized success text |

#### Amber — Intermediate / Warning

| Token | Value | Usage |
|-------|-------|-------|
| `amber-dim` | `oklch(0.28 0.06 80)` | Badge background |
| `amber-base` | `oklch(0.80 0.15 80)` | Badge text, difficulty indicator |
| `amber-bright` | `oklch(0.88 0.13 80)` | Warning emphasis |

#### Red — Advanced / Error / Destructive

| Token | Value | Usage |
|-------|-------|-------|
| `red-dim` | `oklch(0.25 0.06 25)` | Badge background, error card borders |
| `red-base` | `oklch(0.65 0.20 25)` | Badge text, error text, destructive buttons |
| `red-bright` | `oklch(0.75 0.18 25)` | Error emphasis |

### 3.4 Semantic Aliases

These are the tokens components actually consume:

```
// Backgrounds
--bg-root:          neutral-1
--bg-sidebar:       neutral-2
--bg-surface:       neutral-3
--bg-elevated:      neutral-4
--bg-active:        neutral-5
--bg-overlay:       oklch(0 0 0 / 60%)

// Text
--text-primary:     neutral-12
--text-secondary:   neutral-9
--text-tertiary:    neutral-7
--text-inverted:    neutral-1

// Borders
--border-default:   oklch(1 0 0 / 7%)
--border-strong:    oklch(1 0 0 / 12%)
--border-focus:     accent-base
--border-error:     red-base

// Interactive
--interactive-default:  accent-bright
--interactive-hover:    accent-hover
--interactive-active:   accent-base
--interactive-disabled: neutral-5
```

### 3.5 Match Score Color Scale

The recommendation match score (0–100%) maps to a continuous color scale:

```
90–100%    accent-bright      "Excellent match"
70–89%     accent-base        "Good match"
50–69%     amber-base         "Partial match"
0–49%      neutral-9          "Low match"      (de-emphasized)
```

---

## 4. Typography

### 4.1 Font Families

| Token | Family | Source | Usage |
|-------|--------|--------|-------|
| `--font-sans` | **Geist Sans** | Google Fonts (already loaded) | All UI text, headings, body, labels |
| `--font-mono` | **Geist Mono** | Local woff (already loaded) | Code snippets, file paths, issue numbers, repo names (`owner/repo`), match percentages, time estimates |

**Why Geist?** It's the Vercel system font. Designed for interfaces, not documents. Excellent legibility at small sizes. Monospace variant shares the same visual rhythm.

### 4.2 Type Scale

All sizes are in `rem` (base = 16px). Line-heights are unitless ratios.

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `text-2xs` | `0.6875rem` (11px) | 1.45 | 500 | Micro-labels, keyboard shortcut hints |
| `text-xs` | `0.75rem` (12px) | 1.5 | 400–500 | Timestamps, badge text, sidebar labels |
| `text-sm` | `0.8125rem` (13px) | 1.55 | 400 | Nav items, table cells, secondary info |
| `text-base` | `0.875rem` (14px) | 1.6 | 400 | Body text, card descriptions, inputs |
| `text-md` | `1rem` (16px) | 1.6 | 400 | Paragraphs, issue body text |
| `text-lg` | `1.125rem` (18px) | 1.45 | 500 | Card titles, section headings |
| `text-xl` | `1.25rem` (20px) | 1.35 | 600 | Page titles |
| `text-2xl` | `1.5rem` (24px) | 1.3 | 600 | Large page titles |
| `text-3xl` | `2rem` (32px) | 1.2 | 700 | Landing page subheading |
| `text-4xl` | `2.75rem` (44px) | 1.1 | 700 | Landing page hero headline |
| `text-5xl` | `3.5rem` (56px) | 1.05 | 800 | Landing page hero (desktop only) |

### 4.3 Font Weight Usage

| Weight | Name | Usage |
|--------|------|-------|
| 400 | Regular | Body text, descriptions, table cells |
| 500 | Medium | Labels, nav items, badge text, secondary headings |
| 600 | Semibold | Page titles, card titles, emphasis |
| 700 | Bold | Landing page headings only |
| 800 | Extrabold | Landing page hero only |

### 4.4 Type Pairing Rules

```
PAGE TITLE (text-xl, 600, --text-primary)
  Page description (text-sm, 400, --text-secondary)

CARD TITLE (text-lg, 500, --text-primary)
  Card body (text-base, 400, --text-secondary)
  Card meta (text-xs, 500, --text-tertiary, font-mono)

TABLE HEADER (text-xs, 500, --text-secondary, uppercase, tracking-wider)
  Table cell (text-sm, 400, --text-primary)

LABEL (text-xs, 500, --text-secondary, uppercase, letter-spacing: 0.05em)
  Value (text-base, 400, --text-primary)
```

### 4.5 Specific type treatments

| Element | Treatment |
|---------|-----------|
| Repo full name (`vercel/next.js`) | `font-mono`, `text-sm`, `--text-primary` |
| Issue number (`#48291`) | `font-mono`, `text-xs`, `--text-secondary` |
| File paths (`packages/next/src/...`) | `font-mono`, `text-xs`, `--text-secondary` |
| Match score (`94%`) | `font-mono`, `text-sm`, `600 weight`, color from match scale |
| Time estimate (`~3 hours`) | `font-mono`, `text-xs`, `--text-secondary` |
| Keyboard shortcuts (`⌘K`) | `font-mono`, `text-2xs`, surface border pill |
| Sidebar nav labels (`NAVIGATION`) | `text-2xs`, `500`, uppercase, `letter-spacing: 0.08em`, `--text-tertiary` |

---

## 5. Spacing & Layout Grid

### 5.1 Spacing Scale

4px base unit. Consistent across all components.

```
--space-0:    0px
--space-0.5:  2px       micro-gaps (badge padding horizontal)
--space-1:    4px       tightest spacing (icon-to-text inline)
--space-1.5:  6px       badge vertical padding
--space-2:    8px       small gaps (between badges, inline spacing)
--space-3:    12px      default gap (form field spacing, list item padding)
--space-4:    16px      component internal padding (card padding, cell padding)
--space-5:    20px      card padding (comfortable)
--space-6:    24px      section spacing within a page
--space-8:    32px      between major sections
--space-10:   40px      page-level vertical rhythm
--space-12:   48px      large section separation
--space-16:   64px      landing page section gaps
--space-20:   80px      landing page hero spacing
--space-24:   96px      landing page major breaks
```

### 5.2 Layout Dimensions

| Element | Dimension | Behavior |
|---------|-----------|----------|
| Sidebar expanded | `240px` width | Fixed position, full viewport height |
| Sidebar collapsed | `64px` width | Icon-only mode, tooltips on hover |
| Topbar | `56px` height | Fixed position, full width minus sidebar |
| Content max-width | `1120px` | Centered with `auto` margins |
| Content padding | `24px` horizontal, `32px` top | Consistent on all pages |
| Card grid | `1–3 columns` | Responsive grid, `16px` gap |
| Table max-width | `100%` of content area | Horizontally scrollable on overflow |
| Dialog width | `480px` default, `640px` large | Centered vertically, `20vh` from top |
| Command palette | `560px` wide | Centered, `20%` from top |

### 5.3 Content Density Zones

```
HIGH DENSITY                    MEDIUM DENSITY                LOW DENSITY
(Tables, Sidebar)               (Cards, Forms)                (Landing, Empty states)
──────────────────              ──────────────────            ──────────────────
padding: 8-12px                 padding: 16-20px              padding: 32-64px
gap: 0-4px                      gap: 12-16px                  gap: 24-48px
text: text-xs to text-sm        text: text-sm to text-base    text: text-lg to text-4xl
line-height: 1.4-1.5            line-height: 1.5-1.6          line-height: 1.2-1.3
```

---

## 6. Border Radius

### Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-xs` | `4px` | Small inline elements: color dots, status indicators |
| `--radius-sm` | `6px` | Badges, chips, tags, small pills |
| `--radius-md` | `8px` | Buttons, inputs, dropdowns, table cells (inner) |
| `--radius-lg` | `10px` | Cards, panels, dialog inner content |
| `--radius-xl` | `12px` | Dialogs, sheets, large containers |
| `--radius-2xl` | `16px` | Hero cards, landing page feature panels |
| `--radius-full` | `9999px` | Avatars, toggle pills, circular buttons |

### Radius Rules

```
RULE 1: Nested radius
  Outer container radius - padding = inner element radius
  Example: Card (radius-lg: 10px) with 16px padding
           → inner elements get radius-md (8px) maximum

RULE 2: Never round one side
  All corners of an element share the same radius.
  No top-left-only or bottom-right-only rounding.
  Exception: table first/last rows inherit container radius.

RULE 3: Inputs match buttons
  Both use radius-md (8px) for consistent inline alignment.

RULE 4: Interactive elements
  Buttons, inputs, badges, and tags share radius-md.
  This creates visual cohesion in toolbars and filter rows.
```

---

## 7. Shadows & Elevation

### Shadow Scale

Dark mode shadows require higher opacity and cooler tones than light mode. True black (`oklch(0 0 0)`) casts against the near-black background.

| Token | Value (Dark Mode) | Usage |
|-------|-------------------|-------|
| `--shadow-none` | `none` | Default state for flat elements |
| `--shadow-xs` | `0 1px 2px oklch(0 0 0 / 30%)` | Badges on colored backgrounds |
| `--shadow-sm` | `0 1px 3px oklch(0 0 0 / 40%), 0 1px 2px oklch(0 0 0 / 30%)` | Buttons, input focus |
| `--shadow-md` | `0 4px 8px oklch(0 0 0 / 45%), 0 2px 4px oklch(0 0 0 / 35%)` | Cards on hover, dropdown menus |
| `--shadow-lg` | `0 8px 24px oklch(0 0 0 / 50%), 0 4px 8px oklch(0 0 0 / 40%)` | Popovers, active dialogs |
| `--shadow-xl` | `0 16px 48px oklch(0 0 0 / 60%), 0 8px 16px oklch(0 0 0 / 45%)` | Command palette, modal dialogs |
| `--shadow-glow-accent` | `0 0 20px oklch(0.65 0.16 250 / 12%)` | Focused accent elements, active CTA |
| `--shadow-glow-success` | `0 0 16px oklch(0.72 0.19 155 / 10%)` | Beginner badge glow (subtle) |

### Shadow Rules

```
RULE 1: Cards do NOT have shadows at rest
  Cards are distinguished from the background by
  surface color (neutral-3 vs neutral-1), not shadow.
  Shadow appears ONLY on hover (shadow-md) as a lift effect.

  Reference: Linear issue cards — flat at rest, subtle lift on hover.

RULE 2: Floating elements always have shadows
  Dropdowns, popovers, command palette, dialogs
  always render with shadow-lg or shadow-xl.

RULE 3: No shadow in light mode means no shadow in dark mode
  Shadows are additive. If something is flat in light mode,
  it stays flat in dark mode.

RULE 4: Glow is used sparingly
  Only on: primary CTA button (landing page), active accent
  input focus rings, and the AI Analysis card accent line.
```

---

## 8. Border Styles

### Border Tokens

| Token | Value (Dark Mode) | Usage |
|-------|-------------------|-------|
| `--border-default` | `1px solid oklch(1 0 0 / 7%)` | Card borders, separators, table cell borders |
| `--border-strong` | `1px solid oklch(1 0 0 / 12%)` | Focused input borders, section dividers, sidebar border |
| `--border-focus` | `1px solid accent-base` + `0 0 0 3px accent-glow` | Input/button focus ring |
| `--border-error` | `1px solid red-base` | Validation error inputs |
| `--border-accent` | `1px solid oklch(0.65 0.16 250 / 30%)` | AI Analysis card left accent border |

### Border Rules

```
RULE 1: Borders are barely visible at rest
  7% white opacity. You should squint to see them.
  They provide structure, not decoration.

  Reference: Vercel dashboard card borders — barely perceptible.

RULE 2: Sidebar right border
  The sidebar uses --border-default on its right edge.
  This is the ONLY use of a single-side border in the app.

RULE 3: Table borders
  Horizontal borders between rows: --border-default
  No vertical column borders. Never.
  Table header bottom: --border-strong

  Reference: Stripe Dashboard tables.

RULE 4: Dividers / Separators
  Horizontal dividers use --border-default.
  They span the full width of their container.
  Vertical spacing above and below: --space-6 (24px).

RULE 5: Cards
  All four sides, --border-default, uniform.
  On hover: border transitions to --border-strong over 150ms.

RULE 6: Focus rings
  2px accent-base ring with 3px accent-glow spread.
  Always visible on keyboard focus (:focus-visible).
  Never visible on mouse click.
```

---

## 9. Card Styles

Cards are the primary content container in Argus. They appear on Dashboard (issue cards), Repos (repo cards), and Issue Detail (AI Analysis card).

### 9.1 Base Card

```
┌─────────────────────────────────────────────┐
│                                             │  Background:  neutral-3
│     Card content                            │  Border:      --border-default
│                                             │  Radius:      --radius-lg (10px)
│                                             │  Padding:     --space-5 (20px)
│                                             │  Shadow:      none (at rest)
└─────────────────────────────────────────────┘

HOVER STATE:
  border-color → --border-strong (150ms ease)
  background → neutral-4 (150ms ease)
  shadow → --shadow-md (200ms ease)
  transform → translateY(-1px) (200ms ease)

ACTIVE/PRESSED STATE:
  transform → translateY(0)
  shadow → --shadow-sm
  background → neutral-5

TRANSITION:
  all transitions use --duration-fast (150ms)
  easing: cubic-bezier(0.16, 1, 0.3, 1)
```

### 9.2 Issue Card (Dashboard Feed)

```
┌─────────────────────────────────────────────────────┐
│  [🟢 BEGINNER]                 vercel/next.js       │ ← row: badge left, repo right
│                                                     │
│  Fix hydration mismatch in Image component          │ ← title: text-lg, 500, text-primary
│                                                     │
│  The next/image component renders different          │ ← summary: text-sm, 400, text-secondary
│  attributes on server vs client, causing a           │    max 2 lines, truncate with ellipsis
│  hydration warning in React 19...                   │
│                                                     │
│  [TypeScript]  [React]  [Next.js]                   │ ← skill tags: badge style
│                                                     │
│  ⏱ ~2 hrs    Match: 94%         [☆]  [→ GitHub]    │ ← footer: meta left, actions right
└─────────────────────────────────────────────────────┘

Structure:
  header row    → DifficultyBadge + repo name (font-mono)
  title         → Issue title (single line, truncate)
  summary       → AI summary (2 lines max, line-clamp-2)
  skills row    → SkillTag badges (horizontal wrap, gap-2)
  footer row    → TimeEstimate + MatchScore + QuickActions

Card-specific:
  min-height: none (natural content height)
  gap between sections: --space-3 (12px)
  AI summary text: text-sm, --text-secondary, line-clamp-2
  Repo name: font-mono, text-xs, --text-secondary
  Footer: flex, justify-between, items-center
```

### 9.3 Repo Card

```
┌─────────────────────────────────────────┐
│  vercel / next.js                       │ ← owner dim, name bright
│                                         │
│  ★ 128,402                              │ ← star count, amber tint
│  ● TypeScript                           │ ← language dot + label
│  284 open issues                        │ ← issue count
│                                         │
│  [react]  [web]  [framework]            │ ← topic badges
│                                         │
│  Polled 2 min ago                       │ ← timestamp, text-xs, tertiary
└─────────────────────────────────────────┘

Card-specific:
  grid layout: 1 column on mobile, 2 on tablet, 3 on desktop
  gap: --space-4 (16px)
  owner text: text-sm, 400, --text-secondary
  repo name: text-lg, 600, --text-primary
  star count: text-sm, font-mono, amber-base
  language dot: 8px circle, colored per language map
```

### 9.4 AI Analysis Card (Issue Detail Page)

This is the **signature component** of Argus. It deserves special visual treatment.

```
┌─ AI Analysis ────────────────────────────────────────┐
│                                                      │
│  ◆ Analyzed by Argus AI                              │ ← header with accent icon
│                                                      │
│  Summary                                             │ ← section label
│  The next/image component renders width and height   │
│  as inline styles on server but recalculates them    │
│  on the client, causing a hydration mismatch...      │
│                                                      │
│  ─────────────────────────────────────────────────   │
│                                                      │
│  Difficulty        ███░░  Intermediate               │ ← visual meter
│  Est. Time         ~3 hours                          │
│                                                      │
│  Skills Required                                     │
│  [TypeScript]  [React]  [Next.js]  [CSS]             │
│                                                      │
│  Relevant Files                                      │
│  📄 packages/next/src/client/image.tsx               │
│  📄 packages/next/src/server/image.tsx               │
│  📄 test/integration/image/test/index.test.js        │
│                                                      │
└──────────────────────────────────────────────────────┘

Visual treatment:
  Left border: 3px solid accent-base (the ONLY colored border in the app)
  Background: oklch(0.65 0.16 250 / 4%) — barely perceptible blue tint
  Header icon (◆): accent-bright, 16px
  Header text: text-xs, 500, --text-secondary
  Section labels: text-xs, 500, uppercase, tracking-wider, --text-tertiary
  Difficulty meter: 5-segment bar, filled segments use difficulty color
  File paths: font-mono, text-xs, --text-secondary, hover → --text-primary
```

---

## 10. Table Styles

Tables appear on the Explore page. Inspired by Stripe Dashboard's clean data tables.

### Base Table

```
┌─────────────────────────────────────────────────────────────────┐
│  TITLE                  REPO          DIFF      SKILLS    TIME  │ ← header
├─────────────────────────────────────────────────────────────────┤
│  Fix modal a11y         shadcn/ui     🟢 BEG    TS React  ~1h  │ ← row
│─────────────────────────────────────────────────────────────────│
│  Add i18n support       nextjs        🟡 INT    TS i18n   ~4h  │
│─────────────────────────────────────────────────────────────────│
│  Perf regression        turbo         🔴 ADV    Go Rust   ~8h  │
└─────────────────────────────────────────────────────────────────┘
```

### Table Tokens

| Property | Value |
|----------|-------|
| **Header background** | `transparent` (no fill — Stripe style) |
| **Header text** | `text-xs`, `500`, `uppercase`, `letter-spacing: 0.05em`, `--text-tertiary` |
| **Header border-bottom** | `--border-strong` |
| **Header padding** | `--space-3` vertical, `--space-4` horizontal |
| **Row background** | `transparent` |
| **Row hover** | `neutral-3` (150ms ease) |
| **Row border-bottom** | `--border-default` |
| **Row padding** | `--space-3` vertical, `--space-4` horizontal |
| **Row text** | `text-sm`, `400`, `--text-primary` |
| **Row height** | `44px` minimum |
| **Last row** | No bottom border |
| **Cell alignment** | Left-aligned by default. Numbers right-aligned. |
| **Clickable rows** | `cursor: pointer`, hover shows background change |

### Table Column Behavior

| Column | Width | Alignment | Style |
|--------|-------|-----------|-------|
| Title | `flex: 1` (grows) | Left | `text-sm`, `500`, `--text-primary`, truncate |
| Repo | `160px` fixed | Left | `font-mono`, `text-xs`, `--text-secondary` |
| Difficulty | `100px` fixed | Left | DifficultyBadge component |
| Skills | `180px` fixed | Left | Inline SkillTag badges (max 3, +N overflow) |
| Time | `80px` fixed | Right | `font-mono`, `text-xs`, `--text-secondary` |

### Sortable Columns

```
Inactive: "TITLE" (no icon)
Hover:    "TITLE" + subtle arrow icon (--text-tertiary, opacity 0.5)
Active:   "TITLE ↑" or "TITLE ↓" (--text-secondary, full opacity)
```

---

## 11. Form Styles

### 11.1 Text Input

```
┌──────────────────────────────────────┐
│  owner/repo                         │
└──────────────────────────────────────┘

Resting state:
  background: neutral-3
  border: --border-default
  border-radius: --radius-md (8px)
  height: 40px
  padding: 0 --space-3 (0 12px)
  font: text-base, 400, --text-primary
  placeholder: text-base, 400, --text-tertiary

Hover state:
  border-color: --border-strong

Focus state:
  border-color: accent-base
  box-shadow: 0 0 0 3px accent-glow
  outline: none

Error state:
  border-color: red-base
  box-shadow: 0 0 0 3px oklch(0.65 0.20 25 / 10%)

Disabled state:
  opacity: 0.5
  cursor: not-allowed
  background: neutral-2
```

### 11.2 Search Input

```
┌──────────────────────────────────────┐
│  🔍  Search issues...               │
└──────────────────────────────────────┘

Same as text input, plus:
  padding-left: 40px (to clear icon)
  Search icon: 16px, --text-tertiary, positioned absolute left 12px
  Clear button (×): appears on the right when value is non-empty
```

### 11.3 Select / Dropdown Trigger

```
┌──────────────────────────────────────┐
│  Newest first                    ▾   │
└──────────────────────────────────────┘

Same dimensions and states as text input.
Chevron icon: 14px, --text-tertiary, right 12px
```

### 11.4 Labels

```
Label text
┌──────────────────────────────────────┐
│  value                               │
└──────────────────────────────────────┘
Helper or error text

Label: text-sm, 500, --text-primary, margin-bottom: --space-1.5
Helper: text-xs, 400, --text-secondary, margin-top: --space-1
Error: text-xs, 400, red-base, margin-top: --space-1
```

### 11.5 Toggle / Chip Selection (Onboarding)

Used for skill and interest selection:

```
UNSELECTED:
┌──────────────┐
│  TypeScript   │  bg: neutral-3, border: --border-default
└──────────────┘   text: --text-secondary, cursor: pointer

HOVER:
┌──────────────┐
│  TypeScript   │  bg: neutral-4, border: --border-strong
└──────────────┘

SELECTED:
┌──────────────┐
│  ✓ TypeScript │  bg: accent-dim, border: accent-base (30% opacity)
└──────────────┘   text: accent-bright, checkmark icon prepended

Chip properties:
  border-radius: --radius-full (pill)
  padding: --space-1.5 vertical, --space-3 horizontal
  font: text-sm, 500
  transition: all 150ms ease
```

### 11.6 Filter Pills (Dashboard, Explore)

```
INACTIVE:
  [Beginner]      bg: transparent, border: --border-default
                   text: --text-secondary

ACTIVE:
  [Beginner ×]    bg: neutral-4, border: --border-strong
                   text: --text-primary, × icon on right

Properties:
  height: 28px
  border-radius: --radius-sm (6px)
  padding: 0 --space-2.5
  font: text-xs, 500
  gap between pills: --space-2
```

---

## 12. Button Styles

### 12.1 Variants

| Variant | Background | Text | Border | Usage |
|---------|-----------|------|--------|-------|
| **Primary** | `accent-bright` | `neutral-1` | none | Primary CTAs — "Get Started", "Track Repository", "Continue" |
| **Secondary** | `neutral-3` | `--text-primary` | `--border-default` | Secondary actions — "Cancel", "Clear Filters" |
| **Ghost** | `transparent` | `--text-secondary` | none | Tertiary actions — icon buttons, nav items |
| **Destructive** | `red-dim` | `red-bright` | `1px solid red-base (30%)` | Dangerous actions — "Delete Account", "Remove Repo" |
| **Link** | `transparent` | `accent-base` | none | Inline text links — "View all", "Learn more" |

### 12.2 Sizes

| Size | Height | Padding (h) | Font | Icon size | Usage |
|------|--------|-------------|------|-----------|-------|
| `xs` | `28px` | `--space-2` | `text-xs` | 14px | Table actions, inline buttons |
| `sm` | `32px` | `--space-3` | `text-sm` | 16px | Card actions, filter toggles |
| `md` | `36px` | `--space-4` | `text-sm` | 16px | Default — most buttons |
| `lg` | `40px` | `--space-5` | `text-base` | 18px | Dialog CTAs, form submits |
| `xl` | `48px` | `--space-6` | `text-md` | 20px | Landing page hero CTA only |

### 12.3 Button States

```
RESTING → HOVER → ACTIVE/PRESSED → DISABLED → LOADING

Primary:
  Rest:     bg accent-bright
  Hover:    bg accent-hover, shadow-sm
  Active:   bg accent-base, shadow-none
  Disabled: bg neutral-5, text neutral-7, cursor not-allowed
  Loading:  bg accent-bright (dimmed), spinner replaces text/icon

Secondary:
  Rest:     bg neutral-3, border --border-default
  Hover:    bg neutral-4, border --border-strong
  Active:   bg neutral-5
  Disabled: opacity 0.5, cursor not-allowed
  Loading:  same bg, spinner replaces content

Ghost:
  Rest:     bg transparent
  Hover:    bg neutral-3
  Active:   bg neutral-4
  Disabled: opacity 0.5

All transitions: 120ms ease
```

### 12.4 Icon Buttons

```
Square icon-only buttons:
  size: width = height (from size scale above)
  border-radius: --radius-md
  icon centered, no padding adjustment needed
  tooltip required (accessible label)

Examples: Bookmark (☆), Sidebar toggle, Close button
```

---

## 13. Badge Styles

### 13.1 Difficulty Badge

The most important badge in the system. It encodes AI-analyzed difficulty.

| Difficulty | Background | Text | Dot Color |
|-----------|-----------|------|-----------|
| **Beginner** | `green-dim` | `green-base` | `green-base` |
| **Intermediate** | `amber-dim` | `amber-base` | `amber-base` |
| **Advanced** | `red-dim` | `red-base` | `red-base` |

```
[🟢 BEGINNER]

Properties:
  height: 22px
  padding: 0 --space-2
  border-radius: --radius-sm (6px)
  font: text-2xs (11px), 600, uppercase, letter-spacing: 0.04em
  dot: 6px circle, margin-right: --space-1
  border: 1px solid (badge text color at 20% opacity)
```

### 13.2 Label Badge (GitHub Issue Labels)

```
[good first issue]    [bug]    [area: next/image]

Properties:
  height: 22px
  padding: 0 --space-2
  border-radius: --radius-sm (6px)
  background: neutral-4
  text: text-2xs, 500, --text-secondary
  border: --border-default
  
  No custom colors from GitHub labels.
  All labels render in the same neutral style for consistency.
```

### 13.3 Skill Tag Badge

```
[TypeScript]    [React]    [Next.js]

Properties:
  height: 24px
  padding: --space-1 --space-2.5
  border-radius: --radius-sm (6px)
  background: neutral-3
  text: text-xs, 500, --text-primary
  border: --border-default

Hover (when interactive, e.g., filter):
  background: neutral-4
  border: --border-strong
```

### 13.4 Status Badge

```
● Open       green-base dot, "Open" text
● Closed     neutral-7 dot, "Closed" text
● In Progress amber-base dot, "In Progress" text

Properties:
  dot: 6px circle
  text: text-xs, 500, same color as dot
  no background, no border (inline status indicator)
```

### 13.5 Topic Badge (Repos)

```
[react]   [web]   [framework]

Properties:
  Same as Label Badge.
  Lowercase text, no transformation.
```

---

## 14. Empty States

### Design Pattern

Every empty state follows this exact structure:

```
          ┌──────────────────────────────────┐
          │                                  │
          │            [ icon ]              │  48px, --text-tertiary
          │                                  │
          │          Headline Text           │  text-lg, 500, --text-primary
          │                                  │
          │     One line of helpful copy     │  text-sm, 400, --text-secondary
          │     that explains what to do.    │  max-width: 320px, centered
          │                                  │
          │          [ CTA Button ]          │  Button.secondary, size md
          │                                  │
          └──────────────────────────────────┘

Container:
  display: flex, flex-direction: column, align-items: center
  padding: --space-16 (64px) vertical
  text-align: center
  gap: --space-3 between elements
  gap: --space-6 between text and button
```

### Per-page empty states

| Page | Icon | Headline | Copy | CTA |
|------|------|----------|------|-----|
| **Dashboard** (no recommendations) | `Sparkles` | No recommendations yet | Add some repositories and set your skills so Argus can find issues that match you. | Add a Repository |
| **Dashboard** (skills incomplete) | `UserCog` | Complete your profile | Set your languages and skills so Argus can match you with the right issues. | Update Profile |
| **Explore** (no results) | `SearchX` | No issues found | Try adjusting your filters or broadening your search criteria. | Clear Filters |
| **Bookmarks** (empty) | `BookmarkX` | No bookmarks | Save issues from your feed to access them here later. | Go to Feed |
| **Repos** (none tracked) | `GitFork` | No repositories tracked | Start tracking GitHub repositories to discover issues Argus can analyze. | Add Repository |
| **Explore** (zero total issues) | `Inbox` | No issues yet | Tracked repositories haven't surfaced any issues yet. Check back soon. | *(no CTA — auto-resolves)* |

### Empty state rules

```
RULE 1: Always provide a CTA
  The user should never be stuck. Always give them
  a next action — even if it navigates to another page.

RULE 2: Copy is honest, not cute
  "No bookmarks yet" — not "Looks like your bookmarks
  are feeling lonely! 🥺"

RULE 3: Icon matches the context
  Use the same icon that represents this section
  in the sidebar. Maintains visual consistency.

RULE 4: No illustrations
  We use Lucide icons at 48px, not custom SVG illustrations.
  This keeps the aesthetic developer-focused, not consumer-app.
  Reference: Linear empty states.
```

---

## 15. Skeletons

### Design Pattern

Skeletons are the primary loading pattern. They preserve layout structure and reduce perceived load time.

### Skeleton Base

```
Properties:
  background: neutral-3
  border-radius: --radius-sm (6px)
  animation: shimmer 1.5s ease-in-out infinite

Shimmer animation:
  A subtle brightness wave moving left to right.
  Uses a pseudo-element with a linear-gradient:
    transparent → oklch(1 0 0 / 5%) → transparent
  Translates from -100% to 100% on x-axis.
  
  Reference: GitHub's skeleton loading pattern.
```

### Skeleton Shapes

| Shape | Dimensions | Usage |
|-------|-----------|-------|
| `skeleton-text` | `height: 14px`, `width: varies` | Text lines |
| `skeleton-text-sm` | `height: 12px`, `width: varies` | Small text |
| `skeleton-heading` | `height: 20px`, `width: 60%` | Page/card titles |
| `skeleton-badge` | `height: 22px`, `width: 72px` | Badges |
| `skeleton-avatar` | `height: 32px`, `width: 32px`, `border-radius: full` | User avatars |
| `skeleton-button` | `height: 36px`, `width: 100px` | Button placeholders |
| `skeleton-line` | `height: 1px`, `width: 100%` | Divider placeholders |

### Per-Component Skeletons

#### Issue Card Skeleton

```
┌──────────────────────────────────────────────┐
│  ████████░░░░                  ████████░░░   │ ← badge + repo
│                                              │
│  ████████████████████████████░░░░░░░░░       │ ← title
│                                              │
│  ████████████████████████████████████████░░   │ ← summary line 1
│  ████████████████████░░░░░░░░░░░░░░░░░       │ ← summary line 2
│                                              │
│  ██████░░ ██████░░ ██████░░                  │ ← skill tags
│                                              │
│  ████░░░░   ████████░░░░       ██░░ ████░░   │ ← footer
└──────────────────────────────────────────────┘

Render 3 of these stacked, with stagger delay:
  card 1: delay 0ms
  card 2: delay 75ms
  card 3: delay 150ms
```

#### Issue Table Row Skeleton

```
│  ████████████████░░░  ██████░░  ████░░  ██████░░  ██░░  │

Render 8 rows.
```

#### Repo Card Skeleton

```
┌─────────────────────────────┐
│  ████████░░ / ████████░░    │
│                             │
│  ★ ██████░░                 │
│  ● █████░░░                 │
│  ██████████░░               │
│                             │
│  ████░░ ████░░ ████░░       │
│                             │
│  ████████████░░░            │
└─────────────────────────────┘

Render 4 in a grid.
```

### Skeleton Rules

```
RULE 1: Match the real layout exactly
  Every skeleton must be pixel-for-pixel identical
  in height and spacing to the loaded state.
  This eliminates layout shift (CLS = 0).

RULE 2: Vary widths
  Text skeleton widths should vary (60%, 80%, 40%)
  to look organic. Never make all lines the same width.

RULE 3: Stagger entrance
  Multiple skeleton items (cards, rows) should stagger
  their entrance by 50-75ms each.

RULE 4: No skeleton for < 200ms loads
  If data loads in < 200ms, show nothing (avoid flash).
  Use a 200ms delay before showing skeletons.
  Reference: React Suspense best practices.

RULE 5: Skeleton replaces content, not overlays it
  Skeletons ARE the component. They don't float on top.
  The IssueCardSkeleton is rendered in place of IssueCard.
```

---

## 16. Loading Animations

### 16.1 Component-Level Loading

| Context | Animation | Duration |
|---------|-----------|----------|
| **Button loading** | Content replaced by `Loader2` icon spinning. Button remains same dimensions. Disabled state. | Infinite spin, 700ms per rotation |
| **Inline loading** | Small spinner (16px) next to text: "Adding repository..." | Same as button |
| **Table loading** | Skeleton rows replace content | Until data arrives |
| **Card list loading** | Skeleton cards with stagger | Until data arrives |

### 16.2 Page-Level Loading

For full-page loads (initial app shell, route transitions):

```
Centered in viewport:

       ◆
     Argus

  (pulsing animation)

Properties:
  Argus logo mark (◆): 32px, accent-bright
  "Argus" text: text-sm, 500, --text-secondary
  Pulse: opacity oscillates 0.4 → 1.0, duration 1.2s, ease-in-out
  No spinner. No progress bar. Just a calm pulse.

  Reference: Linear's initial load — minimal, confident.
```

### 16.3 Route Transition

```
Between page navigations within the app shell:
  Content area fades out (opacity 1 → 0, 100ms)
  New content fades in (opacity 0 → 1, 200ms, ease-out)
  No slide. No scale. Just a clean crossfade.

  Using framer-motion AnimatePresence.
```

### 16.4 Optimistic Updates

| Action | Optimistic behavior |
|--------|-------------------|
| **Bookmark an issue** | Icon fills immediately. Reverts on error. |
| **Skip/dismiss issue** | Card fades out immediately. Reverts on error with toast. |
| **Add repository** | Dialog closes immediately. Repo card appears with "Polling..." status. |

---

## 17. Toast Style

Using `sonner` (already installed). Toasts appear in the **bottom-right** corner.

### Toast Variants

| Variant | Left accent | Icon | Usage |
|---------|------------|------|-------|
| **Success** | `green-base` (3px left border) | `CheckCircle2` | "Repository added", "Preferences saved" |
| **Error** | `red-base` (3px left border) | `XCircle` | "Failed to add repository", "Network error" |
| **Warning** | `amber-base` (3px left border) | `AlertTriangle` | "GitHub rate limit approaching" |
| **Info** | `accent-base` (3px left border) | `Info` | "New issues found in vercel/next.js" |

### Toast Styling

```
┌────────────────────────────────────────────┐
│ ▎ ⓘ  Repository added successfully        │
│ ▎    vercel/next.js is now being tracked.  │
│ ▎                              [ Dismiss ] │
└────────────────────────────────────────────┘

Properties:
  background: neutral-3
  border: --border-default (top, right, bottom)
  left border: 3px solid (variant color)
  border-radius: --radius-lg (10px)
  padding: --space-4
  shadow: --shadow-lg
  max-width: 380px
  min-width: 320px

Text:
  Title: text-sm, 500, --text-primary
  Description: text-xs, 400, --text-secondary
  Dismiss link: text-xs, 500, --text-secondary, hover → --text-primary

Animation:
  Enter: slide in from right + fade (250ms, ease-out)
  Exit: fade out + slide right (150ms, ease-in)
  Auto-dismiss: 5 seconds (errors: 8 seconds)
  Stacking: max 3 visible, newest on bottom

Positioning:
  bottom: 24px
  right: 24px
  z-index: 9999
```

---

## 18. Modal & Dialog Style

### 18.1 Base Dialog

```
         ┌─────────────────────────────────────────┐
         │                                         │
         │  Dialog Title                    [ × ]  │ ← header
         │  Optional description text              │
         │                                         │
         │─────────────────────────────────────────│ ← divider
         │                                         │
         │  Dialog body content goes here.         │
         │  Forms, confirmations, information.     │
         │                                         │
         │─────────────────────────────────────────│ ← divider
         │                                         │
         │              [ Cancel ]  [ Confirm ]    │ ← footer, right-aligned
         │                                         │
         └─────────────────────────────────────────┘

Properties:
  width: 480px (default), 640px (large variant)
  max-width: calc(100vw - 32px)
  max-height: calc(100vh - 64px)
  background: neutral-3
  border: --border-default
  border-radius: --radius-xl (12px)
  shadow: --shadow-xl
  padding: 0 (sections handle their own padding)

Sections:
  Header padding: --space-5 horizontal, --space-4 vertical
  Body padding: --space-5
  Footer padding: --space-4 --space-5

  Title: text-lg, 600, --text-primary
  Description: text-sm, 400, --text-secondary, margin-top: --space-1
  Close button: Ghost icon button, top-right, 18px X icon

  Dividers: --border-default, full width

Overlay:
  background: oklch(0 0 0 / 60%)
  backdrop-filter: blur(4px)

Animation:
  Overlay: fade in 200ms
  Dialog: scale(0.96) → scale(1) + opacity 0 → 1, 200ms, ease-out
  Exit: scale(1) → scale(0.98) + fade out, 150ms

  Reference: Linear's dialogs — fast, no bounce, professional.
```

### 18.2 Add Repository Dialog

```
         ┌─────────────────────────────────────────┐
         │                                         │
         │  Track Repository                [ × ]  │
         │  Add a GitHub repo to discover issues   │
         │                                         │
         │─────────────────────────────────────────│
         │                                         │
         │  Repository                             │
         │  ┌─────────────────────────────────────┐│
         │  │  owner/repo                         ││
         │  └─────────────────────────────────────┘│
         │  Enter the full name, e.g. vercel/next.js│
         │                                         │
         │─────────────────────────────────────────│
         │                                         │
         │                 [ Cancel ]  [ Track ]   │
         │                                         │
         └─────────────────────────────────────────┘
```

### 18.3 Confirmation Dialog

```
         ┌─────────────────────────────────────────┐
         │                                         │
         │  Remove Repository                      │
         │                                         │
         │─────────────────────────────────────────│
         │                                         │
         │  Are you sure you want to stop tracking │
         │  vercel/next.js? This will remove all   │
         │  associated issue recommendations.      │
         │                                         │
         │─────────────────────────────────────────│
         │                                         │
         │              [ Cancel ]  [ Remove ]     │
         │                                         │
         └─────────────────────────────────────────┘

  Remove button: Destructive variant
  Width: 420px (narrower for simple confirms)
```

### 18.4 Sheet (Mobile Sidebar)

```
Properties:
  Slides in from left edge
  width: 280px
  background: neutral-2
  border-right: --border-default
  shadow: --shadow-xl
  Overlay same as dialog

Animation:
  Enter: translateX(-100%) → translateX(0), 250ms, ease-out
  Exit: translateX(0) → translateX(-100%), 200ms, ease-in
  Overlay fades independently

Dismissal:
  Click overlay, swipe left (mobile), Escape key
```

---

## 19. Command Palette

Global action launcher triggered by `⌘K` (macOS) or `Ctrl+K` (Windows/Linux).

```
         ┌─────────────────────────────────────────────┐
         │  🔍  Type a command or search...            │ ← search input
         │─────────────────────────────────────────────│
         │                                             │
         │  NAVIGATION                                 │ ← group label
         │  ▸ Feed                              ⌘ 1   │
         │  ▸ Explore                           ⌘ 2   │
         │  ▸ Repos                             ⌘ 3   │
         │  ▸ Bookmarks                         ⌘ 4   │
         │  ▸ Settings                          ⌘ ,   │
         │                                             │
         │  ACTIONS                                    │ ← group label
         │  ▸ Add Repository...                        │
         │  ▸ Toggle theme                      ⌘ D   │
         │  ▸ Sign out                                 │
         │                                             │
         └─────────────────────────────────────────────┘

Properties:
  width: 560px
  max-height: 380px (scrollable)
  position: centered horizontally, 20% from top
  background: neutral-3
  border: --border-strong
  border-radius: --radius-xl (12px)
  shadow: --shadow-xl
  overflow: hidden

Search input:
  No border, full width
  height: 48px
  padding: 0 --space-4
  icon: Search, 18px, --text-tertiary
  placeholder: "Type a command or search..."
  font: text-base, 400

Group labels:
  text-2xs, 500, uppercase, letter-spacing: 0.08em
  color: --text-tertiary
  padding: --space-2 --space-4, margin-top: --space-2

Items:
  height: 36px
  padding: 0 --space-4
  font: text-sm, 400, --text-primary
  hover: bg neutral-4
  active (keyboard): bg neutral-4 + left accent bar (2px, accent-base)
  shortcut hint: font-mono, text-2xs, --text-tertiary, right-aligned

Animation:
  Enter: same as dialog (scale-in + fade)
  Exit: fade out 100ms (faster than dialog — snappy)
  Result filtering: items fade out/in, no layout animation

  Reference: Linear's ⌘K — fast, no frills, keyboard-navigable.
```

---

## 20. Sidebar & Navigation

### 20.1 Sidebar Container

```
Properties:
  EXPANDED (default):
    width: 240px
    padding: --space-3 (12px)
    background: neutral-2
    border-right: --border-default

  COLLAPSED:
    width: 64px
    padding: --space-2 (8px)
    Only icons visible, labels hidden
    Tooltip on hover (shows label)

  Transition: width 200ms ease-in-out
  Toggle: Click collapse button or press [ key
  Persistence: collapsed state saved to localStorage
```

### 20.2 Sidebar Header

```
EXPANDED:
  ┌────────────────────────────┐
  │  ◆ Argus            [ ◀ ] │  ← logo mark + wordmark + collapse button
  └────────────────────────────┘

COLLAPSED:
  ┌──────┐
  │  ◆   │  ← logo mark only
  └──────┘

Logo mark (◆):
  18px, accent-bright
  Custom SVG or Unicode diamond

Wordmark "Argus":
  text-sm, 700, --text-primary, letter-spacing: -0.01em

Collapse button:
  Ghost icon button, ChevronLeft icon
  Only visible on sidebar hover (expanded mode)
  In collapsed mode, clicking anywhere on header expands
```

### 20.3 Nav Items

```
EXPANDED:
  ┌────────────────────────────┐
  │  ◎  Feed                   │
  └────────────────────────────┘

COLLAPSED:
  ┌──────┐
  │  ◎   │  (tooltip: "Feed")
  └──────┘

States:
  Default:
    bg: transparent
    icon: 18px, --text-tertiary
    text: text-sm, 400, --text-secondary
    padding: --space-2 --space-3
    border-radius: --radius-md

  Hover:
    bg: oklch(1 0 0 / 6%)
    text: --text-primary
    icon: --text-secondary

  Active (current page):
    bg: oklch(1 0 0 / 8%)
    text: --text-primary, weight 500
    icon: --text-primary
    left border: 2px solid accent-base (inside the item, not on the sidebar edge)

Transition: background 120ms ease, color 120ms ease
```

### 20.4 Section Dividers

```
NAVIGATION                        ← group label
◎  Feed
◎  Explore
◎  Repos
◎  Bookmarks
────────────────────              ← thin separator
◎  Settings
◎  Send Feedback                  ← external link icon appended

Group label:
  text-2xs (11px), 500, uppercase
  letter-spacing: 0.08em
  color: --text-tertiary
  padding: --space-4 top, --space-2 bottom, --space-3 left
  Only visible in expanded mode
```

### 20.5 Sidebar Footer (User Pill)

```
EXPANDED:
  ┌────────────────────────────┐
  │  [👤]  tarux-saxena    ▾   │  ← avatar + username + dropdown trigger
  └────────────────────────────┘

COLLAPSED:
  ┌──────┐
  │  [👤] │  ← avatar only, click opens dropdown
  └──────┘

Properties:
  height: 44px
  padding: --space-2 --space-3
  border-top: --border-default
  margin-top: auto (pushed to bottom via flexbox)

Avatar: 28px, --radius-full
Username: text-sm, 500, --text-primary, truncate
Dropdown chevron: 12px, --text-tertiary

Dropdown menu (on click):
  [Profile & Settings]
  [─────────────────]
  [Sign Out]
```

---

## 21. Responsive Breakpoints

### Breakpoint Scale

| Token | Width | Name | Columns | Layout Change |
|-------|-------|------|---------|---------------|
| `xs` | `0–479px` | Mobile (small) | 1 | Sheet sidebar, stacked everything |
| `sm` | `480–639px` | Mobile (large) | 1 | Sheet sidebar, slightly more horizontal space |
| `md` | `640–767px` | Tablet (portrait) | 1–2 | Sheet sidebar, 2-col card grids begin |
| `lg` | `768–1023px` | Tablet (landscape) | 2 | Sidebar appears (collapsed by default) |
| `xl` | `1024–1279px` | Desktop | 2–3 | Sidebar expanded, full layout |
| `2xl` | `1280px+` | Desktop (wide) | 3 | Max content width (1120px), centered |

### Breakpoint Philosophy

```
MOBILE-AWARE, NOT MOBILE-FIRST.

Argus is a desktop productivity tool used by developers.
The primary experience is desktop (1024px+).
Mobile is supported but not optimized for primary workflows.

This means:
  - We design for desktop FIRST
  - We ensure mobile doesn't break
  - We don't sacrifice desktop density for mobile simplicity
  
  Reference: Linear — desktop-first, mobile is functional but secondary.
```

---

## 22. Mobile Behavior

### Navigation

```
< 768px:
  - Sidebar is HIDDEN by default
  - Hamburger icon (☰) appears in topbar, left side
  - Tapping ☰ opens sidebar as a Sheet (slides from left)
  - Sheet has full sidebar content
  - Overlay behind sheet, tap to dismiss
  - Swipe left on sheet to dismiss (gesture)
```

### Topbar (Mobile)

```
┌────────────────────────────────────┐
│  ☰   ◆ Argus                 [👤] │  ← hamburger, logo, avatar
└────────────────────────────────────┘

Height: 48px (reduced from 56px)
Command palette trigger hidden (no ⌘K on mobile)
Breadcrumbs hidden
User avatar remains visible (opens dropdown)
```

### Content (Mobile)

```
- Content padding: 16px horizontal (reduced from 24px)
- Cards: full width, single column
- Issue table: switches to card view (IssueCard stacked)
  Tables are NOT horizontally scrollable. They transform.
- Repo grid: single column
- Dialogs: full-width (max-width: calc(100vw - 32px))
- Command palette: full-width, positioned from top
- Filter bar: horizontally scrollable row
- Page titles: text-lg (reduced from text-xl)
```

### Touch Targets

```
All interactive elements: minimum 44×44px touch area
  (even if visually smaller, expand the hit target with padding)

Buttons: min-height 44px on mobile (up from 36px default)
Nav items: min-height 44px on mobile
Table rows: min-height 48px on mobile
```

### Gestures

```
- Swipe left on sidebar sheet → dismiss
- Pull-to-refresh on feed page → reload recommendations
- Swipe left on issue card → reveal quick actions (bookmark, skip)
  (only on mobile, not on desktop)
```

---

## 23. Tablet Behavior

### Portrait (768px–1023px)

```
Layout:
  - Sidebar: collapsed (64px, icon-only) by default
  - User can expand to full 240px
  - Content area: fills remaining width
  - Card grid: 2 columns
  - Table: visible but with fewer columns
    - Hide: Skills column, Time column
    - Show: Title, Repo, Difficulty
  - Dialogs: max-width 480px, centered
```

### Landscape (1024px–1279px)

```
Layout:
  - Sidebar: expanded (240px) by default
  - Content max-width: 1120px
  - Card grid: 2 columns
  - Table: all columns visible
  - Full desktop behavior (just slightly narrower)
```

### Tablet-Specific Adjustments

```
- Touch targets: same as mobile (44px minimum)
- Hover states: still functional (most tablets handle hover via stylus or hover detection)
- Command palette: fully functional (keyboard likely attached)
- No gesture-specific interactions (unlike mobile swipe actions)
```

---

## 24. Micro-interactions & Motion

### 24.1 Motion Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Elements entering (fade in, scale in) |
| `--ease-in` | `cubic-bezier(0.5, 0, 0.75, 0)` | Elements leaving (fade out) |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Layout changes (sidebar, resize) |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy elements (avoid in most cases) |
| `--duration-instant` | `80ms` | Color changes, opacity micro-shifts |
| `--duration-fast` | `120ms` | Hover states, focus states |
| `--duration-normal` | `200ms` | Card interactions, dropdown open |
| `--duration-slow` | `300ms` | Page transitions, sidebar toggle |
| `--duration-slower` | `400ms` | Dialog enter, onboarding step transitions |

### 24.2 Interaction Catalog

| Interaction | Animation | Easing | Duration |
|-------------|-----------|--------|----------|
| **Card hover** | `translateY(-1px)` + shadow lift | ease-out | 200ms |
| **Card click** | `translateY(0)` + shadow flatten | ease-in | 100ms |
| **Button hover** | Background color shift | ease-out | 120ms |
| **Button click** | `scale(0.98)` | ease-in | 80ms |
| **Button release** | `scale(1)` | ease-out | 120ms |
| **Nav item hover** | Background fade in | ease-out | 120ms |
| **Nav item active** | Left border slides in (height 0→100%) | ease-out | 200ms |
| **Dialog open** | `scale(0.96) → scale(1)` + fade | ease-out | 250ms |
| **Dialog close** | `scale(1) → scale(0.98)` + fade | ease-in | 150ms |
| **Toast enter** | Slide from right + fade | ease-out | 250ms |
| **Toast exit** | Slide right + fade | ease-in | 150ms |
| **Skeleton shimmer** | Gradient sweep left→right | linear | 1500ms loop |
| **Page transition** | Opacity crossfade | ease-in-out | 200ms |
| **Sidebar collapse** | Width interpolation | ease-in-out | 200ms |
| **Filter pill add** | `scale(0.8) → scale(1)` + fade | ease-out | 150ms |
| **Filter pill remove** | `scale(1) → scale(0.8)` + fade | ease-in | 100ms |
| **Card list stagger** | Each card delays `index × 50ms` | ease-out | 200ms each |
| **Bookmark toggle** | Icon `scale(1.2) → scale(1)` bounce | ease-spring | 300ms |
| **Command palette open** | `scale(0.95) → scale(1)` + fade | ease-out | 150ms |
| **Dropdown open** | `translateY(-4px) → translateY(0)` + fade | ease-out | 150ms |

### 24.3 Motion Rules

```
RULE 1: No gratuitous animation
  Every animation must communicate a state change.
  If removing the animation doesn't change understanding, remove it.

RULE 2: Exits are faster than entrances
  Enter: 200-300ms. Exit: 100-150ms. The user wants to move on.

RULE 3: Never animate layout properties
  No animating width/height on content areas (causes reflow).
  Use transform (translate, scale) and opacity ONLY.
  Exception: sidebar width (handled via will-change and GPU layer).

RULE 4: Respect prefers-reduced-motion
  If prefers-reduced-motion is set:
    - All transitions: duration → 0ms
    - Skeleton shimmer: static background, no animation
    - Page transitions: instant swap
    - Cards: no hover lift
    - Everything still works, just without animation.

RULE 5: No loading spinners in the main content area
  Spinners are allowed ONLY inside buttons and inline indicators.
  Page and component loading uses skeletons exclusively.
```

---

## 25. Iconography

### Icon Library

**Lucide React** (already installed as `lucide-react`).

### Icon Sizing

| Context | Size | Stroke Width |
|---------|------|-------------|
| Inline with text-xs/text-sm | `14px` | 1.5px |
| Inline with text-base | `16px` | 1.75px |
| Nav items (sidebar) | `18px` | 1.75px |
| Page header icons | `20px` | 1.75px |
| Empty state illustrations | `48px` | 1.25px |
| Landing page feature icons | `32px` | 1.5px |

### Icon Color

```
Default: --text-tertiary
Hover: --text-secondary
Active: --text-primary
Interactive (buttons): inherits button text color
Accent: accent-base (used sparingly — AI icon, match score)
```

### Icon–Text Spacing

```
Icon left of text: gap --space-2 (8px)
Icon right of text: gap --space-1.5 (6px)
Icon inside button: gap --space-2 (8px)
Vertically: icons are optically centered with text baseline
```

### Specific Icon Mapping

| Concept | Icon | Notes |
|---------|------|-------|
| Feed/Dashboard | `Sparkles` | Represents AI-powered recommendations |
| Explore | `Compass` | Discovery, browsing |
| Repos | `GitFork` | Repository tracking |
| Bookmarks | `Bookmark` / `BookmarkCheck` | Toggle states |
| Settings | `Settings` | Gear icon |
| Search | `Search` | Magnifying glass |
| External link | `ExternalLink` | "Open on GitHub" |
| AI/Analysis | `Sparkles` or `Zap` | AI-powered features |
| Difficulty: Beginner | `Circle` (filled, green) | Solid circle, not an icon |
| Difficulty: Intermediate | `Circle` (filled, amber) | Solid circle |
| Difficulty: Advanced | `Circle` (filled, red) | Solid circle |
| Time estimate | `Clock` | Inline with estimate text |
| Close/Dismiss | `X` | Dialogs, toasts, filters |
| Expand sidebar | `ChevronRight` | |
| Collapse sidebar | `ChevronLeft` | |
| Dropdown trigger | `ChevronDown` | |
| Sort ascending | `ArrowUp` | Table headers |
| Sort descending | `ArrowDown` | Table headers |
| Error | `AlertTriangle` | Error states, warnings |
| Success | `CheckCircle2` | Toast success |
| Info | `Info` | Toast info |
| Add/Create | `Plus` | "Add Repository" button |
| Back | `ArrowLeft` | Issue detail back button |
| Star count | `Star` | Repo cards |
| User/Profile | `User` | Fallback avatar |
| Logout | `LogOut` | User dropdown |
| Feedback | `MessageSquare` | Sidebar link |

---

## 26. Accessibility Baseline

### Minimum Requirements

| Standard | Target |
|----------|--------|
| **WCAG Level** | AA (2.1) |
| **Color contrast** | 4.5:1 for body text, 3:1 for large text and UI components |
| **Focus indicators** | Visible on all interactive elements via `:focus-visible` |
| **Keyboard navigation** | All functionality accessible without a mouse |
| **Screen reader** | All images have alt text, all icons have `aria-label`, all interactive elements have accessible names |
| **Motion** | Respects `prefers-reduced-motion` |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` / `Ctrl+K` | Open command palette |
| `⌘1` – `⌘4` | Navigate to Feed, Explore, Repos, Bookmarks |
| `⌘,` | Open Settings |
| `[` | Toggle sidebar |
| `Escape` | Close dialog / command palette / dropdown |
| `j` / `k` | Navigate up/down in issue list (vim-style) |
| `o` or `Enter` | Open selected issue |
| `b` | Bookmark selected issue |
| `g` | Open selected issue on GitHub |

### Focus Order

```
Skip link → Sidebar nav → Topbar → Main content → Dialogs (when open)

Tab order within content follows DOM order.
Focus trapping inside dialogs and command palette.
Focus returns to trigger element when dialog closes.
```

### Color Accessibility

```
All difficulty badge colors tested against their backgrounds:
  green-base on green-dim:  contrast ratio ≥ 4.5:1 ✓
  amber-base on amber-dim:  contrast ratio ≥ 4.5:1 ✓
  red-base on red-dim:      contrast ratio ≥ 4.5:1 ✓

Body text (neutral-11) on background (neutral-1): ≥ 7:1 ✓
Secondary text (neutral-9) on background (neutral-1): ≥ 4.5:1 ✓
Tertiary text (neutral-7) on background (neutral-1): ≥ 3:1 ✓ (used only for non-essential labels)
```

---

## Summary

This specification defines every visual and behavioral aspect of the Argus frontend. It is built on these five pillars:

| Pillar | Implementation |
|--------|---------------|
| **Dark, minimal, premium** | Near-black backgrounds, monochrome palette, color only for meaning |
| **Developer-native** | Monospace for data, keyboard shortcuts, information density |
| **AI as a quiet feature** | AI Analysis card is prominent but not flashy — subtle accent border, factual labels |
| **Consistent & systematic** | Every token is derived from a scale. No ad-hoc values anywhere. |
| **Fast & responsive** | Skeleton loading, optimistic updates, no unnecessary transitions |

Reference this document for every component implementation. When in doubt, ask: *"Would this feel at home in Linear?"* If yes, proceed. If no, simplify.
