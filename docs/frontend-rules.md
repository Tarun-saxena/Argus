# Argus — Frontend Implementation Rules

> **This document is the constitution of the Argus frontend.**
> Every developer — human or AI — must follow these rules when writing code in `apps/web`.
> No exceptions. No shortcuts. No "just this once."
>
> Reference documents:
> - [Architecture Blueprint](./architecture.md) — information architecture, routes, component hierarchy
> - [UI Specification](./ui-spec.md) — visual design, tokens, component styles, states

---

## 1. Architecture Rules

### 1.1 Next.js App Router

Argus uses **Next.js 16 with the App Router**. There is no Pages Router. There is no `src/` directory — the `app/` directory lives at `apps/web/app/`.

```
RULE: Every route is a directory inside app/ with a page.tsx.
RULE: Layouts are defined in layout.tsx files at route group boundaries.
RULE: Never create API routes unless proxying to the HTTP server — the backend is apps/http-server.
```

### 1.2 Server Components by Default

Every component is a **React Server Component (RSC)** unless it absolutely cannot be.

```
SERVER COMPONENT (default):
  ✓ Fetches data
  ✓ Reads from database (via @repo/db)
  ✓ Renders static content
  ✓ Has no interactivity
  ✓ Has no browser APIs
  ✓ Has no useState, useEffect, useRef, or event handlers

CLIENT COMPONENT (opt-in — add "use client"):
  ✓ Uses useState, useEffect, useRef, or any React hook
  ✓ Handles onClick, onChange, onSubmit, or any event
  ✓ Uses browser APIs (localStorage, window, navigator)
  ✓ Uses framer-motion for animation
  ✓ Uses third-party client libraries (cmdk, sonner)

RULE: "use client" goes on the SMALLEST possible component.
      Never put "use client" on a page.tsx or layout.tsx.
      Instead, extract the interactive part into a child component.

WRONG:
  // app/(app)/dashboard/page.tsx
  "use client"                     ← entire page is now client
  export default function Dashboard() { ... }

RIGHT:
  // app/(app)/dashboard/page.tsx  (server component — fetches data)
  export default async function Dashboard() {
    const issues = await getRecommendations()
    return <FeedView issues={issues} />   ← pass data down
  }

  // components/issues/feed-view.tsx
  "use client"                     ← only the interactive shell
  export function FeedView({ issues }) { ... }
```

### 1.3 Feature-Based Folder Structure

Components are organized by **feature domain**, not by component type.

```
apps/web/
├── app/                          ← ROUTES ONLY. Minimal logic. Thin wrappers.
│   ├── (public)/                 ← Public pages (landing, login)
│   ├── (app)/                    ← Authenticated app shell
│   └── onboarding/               ← Onboarding flow
│
├── components/
│   ├── ui/                       ← shadcn primitives (Button, Card, Input, etc.)
│   │                                NEVER put custom components here.
│   │                                This directory is managed by shadcn CLI.
│   │
│   ├── layout/                   ← App shell components
│   │   ├── sidebar.tsx
│   │   ├── nav-item.tsx
│   │   ├── topbar.tsx
│   │   ├── page-header.tsx
│   │   ├── command-palette.tsx
│   │   └── user-menu.tsx
│   │
│   ├── issues/                   ← Issue-related components
│   │   ├── issue-card.tsx
│   │   ├── issue-card-skeleton.tsx
│   │   ├── issue-row.tsx
│   │   ├── issue-row-skeleton.tsx
│   │   ├── difficulty-badge.tsx
│   │   ├── match-score.tsx
│   │   ├── time-estimate.tsx
│   │   └── ai-analysis-card.tsx
│   │
│   ├── repos/                    ← Repo-related components
│   │   ├── repo-card.tsx
│   │   ├── repo-card-skeleton.tsx
│   │   └── add-repo-dialog.tsx
│   │
│   ├── onboarding/               ← Onboarding-specific components
│   │   ├── skill-picker.tsx
│   │   └── interest-picker.tsx
│   │
│   └── shared/                   ← Cross-cutting components used everywhere
│       ├── empty-state.tsx
│       ├── error-state.tsx
│       ├── language-dot.tsx
│       ├── skill-tag.tsx
│       └── filter-bar.tsx
│
├── hooks/                        ← Custom React hooks
│   ├── use-user.ts
│   ├── use-issues.ts
│   ├── use-recommendations.ts
│   ├── use-repos.ts
│   └── use-bookmarks.ts
│
├── lib/                          ← Pure utility code (no React)
│   ├── utils.ts                  ← shadcn utility (cn function)
│   ├── api.ts                    ← Typed fetch wrapper for http-server
│   ├── constants.ts              ← Difficulty colors, language map, etc.
│   └── types.ts                  ← Shared TypeScript interfaces
│
└── providers/                    ← Context providers (wrap the app)
    ├── auth-provider.tsx
    └── theme-provider.tsx
```

### 1.4 File Placement Rules

```
RULE: If it's a route, it goes in app/.
RULE: If it's a shadcn primitive, it goes in components/ui/.
RULE: If it's used by ONE feature, it goes in components/<feature>/.
RULE: If it's used by TWO OR MORE features, it goes in components/shared/.
RULE: If it's a React hook, it goes in hooks/.
RULE: If it's a non-React utility, it goes in lib/.
RULE: If it's a context provider, it goes in providers/.
RULE: Never create a components/common/ or components/misc/ folder. Ever.
```

### 1.5 Composition Over Inheritance

```
RULE: Never use class inheritance for components. React components compose.
RULE: Never use React.cloneElement or render props unless absolutely necessary.
RULE: Prefer children + slots over complex prop APIs.

WRONG:
  <Card variant="issue" showDifficulty showMatchScore showActions />

RIGHT:
  <Card>
    <CardHeader>
      <DifficultyBadge difficulty={issue.aiDifficulty} />
      <RepoName>{issue.repo.fullName}</RepoName>
    </CardHeader>
    <CardBody>
      <IssueTitle>{issue.title}</IssueTitle>
      <IssueSummary>{issue.aiSummary}</IssueSummary>
    </CardBody>
    <CardFooter>
      <MatchScore score={recommendation.score} />
      <QuickActions issueId={issue.id} />
    </CardFooter>
  </Card>
```

### 1.6 Import Rules

```
RULE: Use path aliases. Never use relative paths that go up more than one level.

  ✓ import { Button } from "@/components/ui/button"
  ✓ import { IssueCard } from "@/components/issues/issue-card"
  ✓ import { cn } from "@/lib/utils"
  ✓ import { useUser } from "@/hooks/use-user"

  ✗ import { Button } from "../../../components/ui/button"

RULE: Import order (enforced by ESLint):
  1. React / Next.js
  2. External libraries (framer-motion, lucide-react, etc.)
  3. @/ aliases (components, hooks, lib)
  4. Relative imports (./sibling)
  5. Styles (if any)

RULE: Barrel exports (index.ts) are PROHIBITED.
  Every component is imported by its direct file path.
  Barrel files destroy tree-shaking and create circular dependencies.
```

---

## 2. Component Rules

### 2.1 Never Duplicate Components

```
RULE: Before creating ANY component, search the codebase.
  1. Check components/ui/ — does shadcn already have it?
  2. Check components/shared/ — does a shared version exist?
  3. Check components/<feature>/ — does a feature-specific version exist?
  4. If it exists, USE IT. If it's almost right, EXTEND IT.
  5. Only create a new component if nothing exists.

RULE: If you need a component that's a slight variation of an existing one,
      add a variant/prop to the existing component. Do NOT fork it.
```

### 2.2 Single Responsibility

```
RULE: A component does ONE thing.
  - IssueCard renders a single issue card. It does not fetch data.
  - DifficultyBadge renders a difficulty indicator. It does not determine difficulty.
  - FilterBar renders filter controls. It does not manage filter state.

RULE: If a component file exceeds 200 lines, it probably does too much.
  Split it into smaller components within the same feature folder.
  The 200-line limit includes imports, types, and JSX.

RULE: A component never fetches its own data.
  Data is always passed via props (from a Server Component) or consumed
  from a hook (in a Client Component that explicitly "use client").
```

### 2.3 Naming Conventions

```
FILES:
  kebab-case.tsx for all component files.
  kebab-case.ts for all non-component files.

  ✓ issue-card.tsx
  ✓ difficulty-badge.tsx
  ✓ use-recommendations.ts
  ✗ IssueCard.tsx
  ✗ DifficultyBadge.tsx

COMPONENTS:
  PascalCase for all React component names.
  The component name matches the file name (converted to PascalCase).

  issue-card.tsx → export function IssueCard()
  ai-analysis-card.tsx → export function AIAnalysisCard()

HOOKS:
  camelCase starting with "use".
  The hook name matches the file name (converted to camelCase).

  use-user.ts → export function useUser()
  use-recommendations.ts → export function useRecommendations()

TYPES:
  PascalCase. Suffix with Props for component prop types.

  ✓ IssueCardProps
  ✓ DifficultyBadgeProps
  ✓ Issue, Repo, User, Recommendation (domain types)

CONSTANTS:
  SCREAMING_SNAKE_CASE for true constants.
  camelCase for configuration objects.

  ✓ const MAX_VISIBLE_TAGS = 3
  ✓ const difficultyColors = { BEGINNER: "...", ... }
```

### 2.4 Props Conventions

```
RULE: Every component has a named Props type.
  type IssueCardProps = {
    issue: Issue
    recommendation?: Recommendation
    onBookmark?: (issueId: string) => void
  }

RULE: Props types are defined in the SAME FILE as the component.
  Not in a separate types.ts unless shared across multiple components.

RULE: Use destructuring in the function signature.
  export function IssueCard({ issue, recommendation, onBookmark }: IssueCardProps) {}

RULE: Boolean props are never negative.
  ✓ disabled, loading, open
  ✗ notDisabled, isNotLoading, isClosed

RULE: Event handler props start with "on".
  ✓ onClick, onBookmark, onDismiss, onFilterChange
  ✗ handleClick, bookmarkCallback, dismissHandler

RULE: Always pass className as an optional prop on leaf components.
  This allows consumers to add positioning/spacing.
  Use cn() to merge with internal classes.

  type BadgeProps = {
    difficulty: Difficulty
    className?: string
  }
```

### 2.5 Export Rules

```
RULE: Use named exports. NEVER use default exports.
  Exception: page.tsx and layout.tsx (required by Next.js).

  ✓ export function IssueCard() {}
  ✗ export default function IssueCard() {}

RULE: One component per file.
  Small helper sub-components are allowed in the same file
  ONLY if they are not exported and used nowhere else.
```

### 2.6 Accessibility Rules (Component Level)

```
RULE: Every interactive element has an accessible name.
  Buttons with only an icon MUST have aria-label.
  <button aria-label="Bookmark this issue"><BookmarkIcon /></button>

RULE: Every image has alt text. No exceptions.

RULE: Never use <div> or <span> for interactive elements.
  Use <button> for actions, <a> for navigation, <input> for data entry.

RULE: All form inputs have associated <label> elements.
  Use htmlFor + id, or wrap the input inside the label.

RULE: Dialogs trap focus. Always.
  When a dialog opens, focus moves to the first focusable element.
  Tab cycles within the dialog. Escape closes it.
  On close, focus returns to the trigger element.

RULE: Color is never the ONLY indicator.
  Difficulty uses color AND text ("BEGINNER" not just a green dot).
  Status uses color AND text ("Open" not just a green circle).
```

---

## 3. State Management

### 3.1 State Decision Tree

```
Is the state URL-representable (filters, sort, page, search query)?
  └─ YES → URL state (searchParams). Stop.
  └─ NO ↓

Is the state fetched from the server (issues, repos, user data)?
  └─ YES → Server state (RSC data fetching or SWR). Stop.
  └─ NO ↓

Is the state shared across many unrelated components?
  └─ YES → React Context (via providers/). Stop.
  └─ NO ↓

Is it local UI state (open/closed, input value, hover)?
  └─ YES → useState / useRef. Stop.
```

### 3.2 URL State

```
RULE: Filters, sort order, pagination, and search queries ALWAYS live in the URL.
  This makes every view shareable, bookmarkable, and back-button friendly.

  /explore?difficulty=BEGINNER&language=TypeScript&sort=newest&page=2

RULE: Use Next.js useSearchParams() to read, and useRouter().push() to write.
  Wrap this in a custom hook for each page:

  useExploreFilters() → reads/writes /explore?... params
  useDashboardFilters() → reads/writes /dashboard?... params

RULE: Default values are NOT stored in the URL.
  If sort=newest is the default, the URL is /explore, not /explore?sort=newest.
  The absence of a param means "use default."
```

### 3.3 Server State

```
RULE: Data that comes from the HTTP server is fetched in Server Components
      whenever possible.

  // app/(app)/dashboard/page.tsx (Server Component)
  export default async function DashboardPage() {
    const recommendations = await api.getRecommendations()
    return <FeedView recommendations={recommendations} />
  }

RULE: When a Client Component needs fresh data or mutations, use SWR.
  Not React Query. Not raw fetch in useEffect.
  SWR is lightweight, has built-in cache, revalidation, and optimistic updates.

RULE: SWR hooks are defined in hooks/.
  Each hook wraps one API endpoint.

  hooks/use-recommendations.ts → calls GET /recommendations
  hooks/use-repos.ts → calls GET /repos, POST /repos
  hooks/use-bookmarks.ts → calls GET /bookmarks, POST /bookmarks
```

### 3.4 Local State

```
RULE: useState for simple UI toggles and form inputs.
  - Sidebar collapsed/expanded
  - Dialog open/closed
  - Input value before submission
  - Currently hovered card

RULE: useRef for values that don't trigger re-renders.
  - Scroll position tracking
  - DOM element references
  - Timer IDs
  - Previous values

RULE: Never store derived data in state.
  If it can be computed from props or other state, compute it inline.

  WRONG:
    const [filteredIssues, setFilteredIssues] = useState([])
    useEffect(() => {
      setFilteredIssues(issues.filter(...))
    }, [issues, filters])

  RIGHT:
    const filteredIssues = useMemo(
      () => issues.filter(...),
      [issues, filters]
    )
```

### 3.5 Optimistic Updates

```
RULE: Bookmark, dismiss, and similar single-entity mutations are optimistic.
  Update the UI immediately. Revert on error with a toast.

RULE: Mutations that create new entities (add repo) are NOT optimistic.
  Show a loading state on the button. Update UI on success.
  Reason: the server may reject the input (repo not found, etc.).

RULE: Never show stale data without indication.
  If SWR is revalidating, don't flash a loading state for < 200ms.
  If data is > 30s old and revalidation fails, show a subtle "offline" indicator.
```

### 3.6 Error Handling (State Level)

```
RULE: Every data fetch has three states: loading, success, error.
  All three MUST be handled in the UI.
  A component that fetches data but has no error state is incomplete.

RULE: Use error boundaries at the page level.
  Each page in app/(app)/ should have an error.tsx file.
  This catches unhandled rendering errors and shows ErrorState.

RULE: SWR errors are caught in the hook and surfaced via the return value.
  const { data, error, isLoading } = useRecommendations()
  Components check error and render ErrorState or a toast.
```

---

## 4. Styling Rules

### 4.1 Tailwind v4

Argus uses **Tailwind CSS v4** with the PostCSS plugin. Configuration is in `app/globals.css` using `@theme` blocks, not in `tailwind.config.js`.

```
RULE: All styling is done via Tailwind utility classes.
RULE: Never write custom CSS unless absolutely necessary.
  The ONLY custom CSS allowed is in globals.css for:
  - Design token definitions (@theme block)
  - Base layer resets (@layer base)
  - Animations that Tailwind can't express (@keyframes)

RULE: Never use inline style={{ }} on any element.
  Exception: dynamic values that genuinely cannot be expressed as classes
  (e.g., style={{ "--progress": `${score}%` }} for CSS custom properties).
```

### 4.2 shadcn/ui

```
RULE: shadcn components are the UI primitive layer.
  They live in components/ui/ and are installed via the shadcn CLI.
  NEVER manually edit files in components/ui/ unless adding a variant.

RULE: When you need a new primitive (Tabs, Tooltip, Popover, etc.),
      install it via shadcn CLI:
        npx shadcn@latest add <component>

RULE: Custom components COMPOSE shadcn primitives.
  IssueCard uses <Card>, <Badge>, <Button> from components/ui/.
  It does not reimplement card borders or button styles.
```

### 4.3 Design Tokens

```
RULE: Never hardcode colors. Always use CSS variables or Tailwind theme tokens.

  WRONG:
    className="bg-[#1e1e1e] text-[#ebebeb] border-[rgba(255,255,255,0.07)]"

  RIGHT:
    className="bg-card text-card-foreground border-border"

RULE: Never hardcode spacing. Use Tailwind's spacing scale.

  WRONG:
    className="p-[13px] mt-[7px]"

  RIGHT:
    className="p-3 mt-2"       (12px, 8px — on the 4px grid)

RULE: Never hardcode font sizes. Use the type scale.

  WRONG:
    className="text-[13px]"

  RIGHT:
    className="text-sm"        (13px via the type scale defined in globals.css)

RULE: Never hardcode border radius. Use the radius tokens.

  WRONG:
    className="rounded-[10px]"

  RIGHT:
    className="rounded-lg"     (10px via the radius scale)

RULE: Every color, spacing, font, radius, and shadow value must trace back
      to a token defined in globals.css or Tailwind's default scale.
      If a value isn't in the system, it's wrong — adjust the design, not the code.
```

### 4.4 The `cn()` Function

```
RULE: Always use cn() for conditional class merging.
  import { cn } from "@/lib/utils"

  cn("base-classes", conditional && "conditional-classes", className)

RULE: cn() is the ONLY way to merge classes. Never string concatenate.

  WRONG:
    className={`px-4 py-2 ${isActive ? "bg-accent" : ""} ${className}`}

  RIGHT:
    className={cn("px-4 py-2", isActive && "bg-accent", className)}
```

### 4.5 Dark Mode

```
RULE: Dark mode is the DEFAULT. Design dark first, then check light.

RULE: Dark mode is toggled via the .dark class on <html> (next-themes).
  Use Tailwind's dark: variant ONLY when overriding for light mode.
  Since we design dark-first, the base styles ARE the dark styles.

RULE: Never use dark: to define the primary experience.
  The base classes should look correct in dark mode.
  Use dark: only in the rare case where you need to override for light.

RULE: All color tokens switch automatically via CSS custom properties.
  --background, --foreground, --card, --border, etc. change
  between :root (light) and .dark (dark). Components don't need
  to know which mode they're in.
```

### 4.6 Responsive Styling

```
RULE: Desktop-first. Use Tailwind's responsive prefixes for smaller screens.
  Since Tailwind v4 is mobile-first by default, use max-* variants:
    max-lg:hidden → hidden below 1024px
    max-md:flex-col → stack below 768px

  OR define custom breakpoints in globals.css and use standard prefixes.

RULE: Never hide critical functionality on mobile.
  You can simplify the layout, but every feature must be accessible.
  Tables transform to card lists on mobile — they don't just get cut off.

RULE: Touch targets are minimum 44×44px on screens < 768px.
  Add padding to increase hit area even if the visual element is smaller.
```

---

## 5. Performance Rules

### 5.1 Code Splitting

```
RULE: Heavy client components are dynamically imported.

  import dynamic from "next/dynamic"
  const CommandPalette = dynamic(() =>
    import("@/components/layout/command-palette").then(m => m.CommandPalette),
    { ssr: false }
  )

  Candidates for dynamic import:
  - CommandPalette (cmdk — not needed on initial render)
  - AddRepoDialog (only opened on user action)
  - Any component using framer-motion that's not above the fold

RULE: Page-level components are NEVER dynamically imported.
  Next.js handles page-level code splitting automatically.
```

### 5.2 Memoization

```
RULE: Do NOT prematurely memoize.
  React.memo, useMemo, and useCallback are optimizations.
  Add them when you measure a performance problem, not "just in case."

RULE: EXCEPTIONS — always memoize these:
  - Objects/arrays passed to dependency arrays of child hooks
  - Expensive computations (filtering/sorting large lists)
  - Callbacks passed to lists of items (to prevent full list re-renders)
  - Values passed to context providers

RULE: Never memoize primitives (strings, numbers, booleans).
  They are compared by value. Memoization adds overhead for zero benefit.
```

### 5.3 Images

```
RULE: Use next/image for ALL images. No <img> tags.
  next/image handles lazy loading, responsive sizing, and format optimization.

RULE: Always specify width and height (or fill) to prevent layout shift.

RULE: User avatars use the Avatar component (from shadcn) with a fallback.
  <Avatar>
    <AvatarImage src={user.avatarUrl} alt={user.username} />
    <AvatarFallback>{user.username[0]}</AvatarFallback>
  </Avatar>
```

### 5.4 Suspense

```
RULE: Use React Suspense for async Server Components.

  <Suspense fallback={<IssueCardSkeleton count={3} />}>
    <IssueList />     ← this component is async and fetches data
  </Suspense>

RULE: Every Suspense boundary has a skeleton fallback. Never a spinner.
  The skeleton must match the layout of the loaded content exactly.

RULE: Suspense boundaries are placed at the PAGE level, not at the component level.
  One Suspense per page for the main content area.
  Do not wrap every small component in Suspense.
```

### 5.5 Avoiding Re-renders

```
RULE: Lift state UP to the nearest common parent that needs it,
      and pass it DOWN as props. Do not use context for high-frequency updates.

RULE: Separate frequently-changing state from rarely-changing state.
  If a timer ticks every second, that state should NOT be in the same
  component (or context) as the sidebar navigation.

RULE: Event handlers defined in a parent and passed to a list of children
      should use useCallback with stable dependencies.

RULE: Never pass a new object/array literal as a prop on every render.
  WRONG: <Component style={{ padding: 16 }} />
  WRONG: <Component items={items.filter(i => i.active)} />  (in render body)
  RIGHT: Use useMemo for computed values, move constants outside the component.
```

---

## 6. Data Fetching

### 6.1 Server Component Fetching

```
RULE: The default data fetching strategy is in Server Components.
  Pages (page.tsx) are async Server Components that fetch data directly.

  export default async function DashboardPage() {
    const data = await api.getRecommendations()
    return <FeedView data={data} />
  }

RULE: Never fetch data in layout.tsx unless it's needed by ALL child pages.
  User data (for the sidebar) is an exception — fetched in the app layout.
```

### 6.2 API Layer

```RULE: All HTTP requests to the backend go through the API layer.

No React component, page, or hook should call `fetch()` directly.

The API layer is responsible for:

- Making HTTP requests
- Parsing JSON
- Throwing typed errors
- Adding authentication headers/cookies
- Setting the correct base URL
- Handling common request options

Components interact with typed API functions instead of raw HTTP.

Example:

```ts
// lib/api/repos.ts
export async function getRepos() { ... }

export async function addRepo(input) { ... }

// lib/api/issues.ts
export async function getIssue(id) { ... }

export async function getRecommendations() { ... }
```

Hooks and Server Components import these functions instead of using `fetch()`.

✓ Good

const repos = await getRepos();

✗ Bad

const repos = await fetch("/api/repos");
```
RULE: Server Component fetches use Next.js cache with explicit revalidation.

  fetch(url, { next: { revalidate: 60 } })     → revalidate every 60 seconds
  fetch(url, { next: { tags: ["repos"] } })     → revalidate by tag
  fetch(url, { cache: "no-store" })             → always fresh (use sparingly)

RULE: Recommended revalidation intervals:
  - Recommendations: 60 seconds (changes as issues are analyzed)
  - Issues list: 60 seconds
  - Issue detail: 300 seconds (individual issues change rarely)
  - Repos list: 120 seconds
  - User profile: 300 seconds
  - Explore page: 30 seconds (highly dynamic)

RULE: After a mutation (add repo, update profile), revalidate the relevant tag.
  import { revalidateTag } from "next/cache"
  revalidateTag("repos")
```

### 6.4 Error Boundaries

```
RULE: Every route group has an error.tsx file.

  app/(app)/dashboard/error.tsx
  app/(app)/explore/error.tsx
  app/(app)/repos/error.tsx

RULE: error.tsx renders the ErrorState component with a retry button.
  The retry button calls reset() (provided by Next.js).

RULE: error.tsx is always a Client Component ("use client").
  This is a Next.js requirement.

RULE: Not-found states use not-found.tsx files.
  app/(app)/issues/[id]/not-found.tsx → "Issue not found"
```

---

## 7. Accessibility

### 7.1 Keyboard Navigation

```
RULE: Every interactive element is reachable via Tab key.
  Tab order follows visual layout: sidebar → topbar → main content.

RULE: The app supports these global keyboard shortcuts:
  ⌘K / Ctrl+K  → Command palette
  ⌘1–⌘4       → Navigate to Feed, Explore, Repos, Bookmarks
  ⌘,           → Settings
  [            → Toggle sidebar
  Escape       → Close any open overlay

RULE: Issue lists support vim-style navigation:
  j / k        → Move selection down / up
  Enter / o    → Open selected issue
  b            → Bookmark selected issue
  g            → Open on GitHub

RULE: Keyboard shortcuts are registered in a single global hook: useKeyboardShortcuts().
  Do not add ad-hoc document.addEventListener("keydown") calls in random components.
```

### 7.2 ARIA

```
RULE: Every landmark region has an appropriate role or semantic element.
  <nav> for sidebar navigation
  <main> for primary content
  <header> for topbar
  <aside> for sidebar container
  <dialog> for modals (handled by shadcn Dialog)

RULE: Dynamic content changes are announced.
  When a toast appears: aria-live="polite"
  When filters change results: aria-live="polite" on the results container
  When a skeleton is loading: aria-busy="true" on the container

RULE: Never use aria-hidden="true" on focusable elements.
  If an element is hidden from screen readers, it must also be hidden from
  keyboard focus (tabindex="-1" or display:none).
```

### 7.3 Focus Management

```
RULE: When a dialog opens, focus moves to the first interactive element inside it.
RULE: When a dialog closes, focus returns to the element that triggered it.
RULE: When navigating via sidebar, focus moves to the page's h1.
RULE: Skip-to-content link is the first focusable element on the page.
  <a href="#main-content" className="sr-only focus:not-sr-only">
    Skip to content
  </a>
```

### 7.4 Contrast

```
RULE: All text meets WCAG AA contrast ratios.
  Normal text (< 18px): minimum 4.5:1
  Large text (≥ 18px or 14px bold): minimum 3:1
  UI components and graphical objects: minimum 3:1

RULE: When adding new colors, verify contrast with the oklch color checker.
  Test against --bg-root (neutral-1) and --bg-surface (neutral-3).
```

---

## 8. Animations

### 8.1 Framer Motion Rules

```
RULE: framer-motion is the ONLY animation library.
  No CSS @keyframes for component animations.
  Exception: skeleton shimmer animation (CSS is simpler for infinite loops).

RULE: Import motion components from framer-motion, not the full library.
  ✓ import { motion, AnimatePresence } from "framer-motion"

RULE: Define animation variants as constants OUTSIDE the component.
  const fadeInUp = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -4 },
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
  }

  Never define variants inline in JSX.
```

### 8.2 Duration Rules

```
RULE: Animation durations follow this strict scale.

  80ms   → Color changes, opacity micro-shifts (hover backgrounds)
  120ms  → Hover states, focus rings
  150ms  → Exit animations, filter pill remove
  200ms  → Enter animations, card hover lift, dropdown open
  250ms  → Dialog enter, toast enter
  300ms  → Sidebar toggle, page transitions
  400ms  → Onboarding step transitions (the longest allowed)

RULE: MAXIMUM animation duration is 400ms.
  Nothing in the app should animate for longer than 400ms.
  This is a developer tool. Developers don't wait.

RULE: Exits are faster than entrances.
  If enter = 200ms, exit = 150ms.
  If enter = 250ms, exit = 150ms.
  The user is moving on — get out of the way.
```

### 8.3 Easing Rules

```
RULE: Use these three easings and nothing else.

  ease-out:    [0.16, 1, 0.3, 1]     → Elements entering (appearing, expanding)
  ease-in:     [0.5, 0, 0.75, 0]     → Elements leaving (disappearing, collapsing)
  ease-in-out: [0.65, 0, 0.35, 1]    → Layout shifts (sidebar, resize)

RULE: Never use "linear" easing on visible UI elements.
  Linear feels robotic. Always use an easing curve.

RULE: Never use bouncy/springy easing on primary UI.
  No overshoot, no bounce. This is a professional tool.
  Exception: bookmark icon toggle — a subtle spring is acceptable.
```

### 8.4 What to Animate

```
ALWAYS ANIMATE:
  - Dialog/modal enter and exit
  - Toast enter and exit
  - Dropdown/popover enter and exit
  - Card list stagger on initial page load
  - Page content crossfade on route change
  - Sidebar collapse/expand

NEVER ANIMATE:
  - Text changes (just swap the text)
  - Color changes on theme toggle (instant swap)
  - Layout shifts from data loading (use skeletons instead)
  - Scroll position changes
  - Anything on a page that the user hasn't interacted with
```

### 8.5 prefers-reduced-motion

```
RULE: Respect the user's prefers-reduced-motion setting.

  @media (prefers-reduced-motion: reduce) {
    All durations → 0ms
    All transforms → none
    Skeleton shimmer → static background
    Crossfades → instant swap
  }

RULE: framer-motion's useReducedMotion hook is available.
  Use it when you need to conditionally disable an animation in JS.
```

---

## 9. Code Quality

### 9.1 TypeScript Rules

```
RULE: Strict mode is ON. No exceptions.
  "strict": true in tsconfig.json.

RULE: No `any`. Ever.
  If you don't know the type, use `unknown` and narrow it.

  WRONG: function process(data: any) {}
  RIGHT: function process(data: unknown) {}

  If a third-party library gives you `any`, wrap it in a typed function.

RULE: No type assertions (`as`) unless proven safe.
  Type assertions bypass the type checker. Use them ONLY when you have
  runtime evidence that the assertion is true (e.g., after a type guard).

  WRONG: const user = data as User
  RIGHT: if (isUser(data)) { const user = data; ... }

RULE: No non-null assertions (`!`).
  Handle the null/undefined case explicitly.

  WRONG: const name = user!.name
  RIGHT: const name = user?.name ?? "Unknown"

RULE: Use `interface` for object shapes that may be extended.
  Use `type` for unions, intersections, and computed types.

  interface IssueCardProps { ... }        ← object shape
  type Difficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED"  ← union
```

### 9.2 Utility Functions

```
RULE: Utility functions go in lib/.
  They must be pure functions with no side effects.
  They must be fully typed.
  They must NOT import React or any component.

RULE: Format functions are centralized:
  lib/format.ts → formatDate(), formatNumber(), formatTimeAgo(), formatStarCount()

RULE: Validation functions use Zod (already in the backend).
  If the frontend needs validation (forms), use Zod schemas from a shared package
  or define them in lib/validators.ts.
```

### 9.3 Hooks

```
RULE: Custom hooks go in hooks/.
RULE: A custom hook always starts with "use".
RULE: A custom hook does ONE thing.

  ✓ useUser() → returns user, isLoading, error
  ✓ useBookmark(issueId) → returns isBookmarked, toggle()
  ✗ useEverything() → returns user, repos, issues, recommendations, ...

RULE: Hooks that fetch data follow this return signature:
  {
    data: T | undefined
    isLoading: boolean
    error: Error | null
    mutate: () => void     (SWR's revalidation function)
  }

RULE: Hooks do not render UI. They return data and handlers.
  If a hook needs to render, it should be a component instead.
```

### 9.4 Error Handling

```
RULE: Never swallow errors silently.
  Every catch block either:
  1. Re-throws to an error boundary
  2. Shows a user-facing error (toast or ErrorState)
  3. Logs to console.error AND shows a user-facing error

  WRONG:
    try { ... } catch (e) {}                    ← swallowed
    try { ... } catch (e) { console.log(e) }    ← logged but user unaware

  RIGHT:
    try { ... } catch (e) {
      console.error("Failed to add repo:", e)
      toast.error("Failed to add repository. Please try again.")
    }

RULE: API errors are typed.
  lib/api.ts throws an ApiError with status code and message.
  Hooks and components can check error.status to decide what to show.
```

### 9.5 Comments

```
RULE: Code should be self-documenting. Minimize comments.
RULE: Comment the WHY, never the WHAT.

  WRONG:
    // Set the user's name
    setUserName(response.name)

  RIGHT:
    // GitHub API sometimes returns null for name even though the field
    // is documented as required. Fall back to login username.
    setUserName(response.name ?? response.login)

RULE: TODO comments include the author and a brief description.
    // TODO(tarun): Add pagination after backend supports cursor-based API

RULE: No commented-out code in committed files.
  Delete it. Git has history.
```

### 9.6 Testing Considerations

```
RULE: All interactive components should have data-testid attributes
      on key interactive elements for future E2E testing.

  <button data-testid="bookmark-button" onClick={...}>
  <input data-testid="search-input" onChange={...}>
  <div data-testid="issue-card-{id}">

RULE: Test IDs follow the pattern: <component>-<element>
  issue-card-{id}
  filter-bar-difficulty
  add-repo-dialog-input
  add-repo-dialog-submit

RULE: Utility functions in lib/ should be unit-testable (pure functions).
  Design them so they have no external dependencies.
```

---

## 10. AI Coding Rules

> **This section is addressed directly to any AI model generating code for Argus.**
> These rules are non-negotiable. Violating them wastes human review time.

### 10.1 Before Writing Any Code

```
STEP 1: Read this document (docs/frontend-rules.md).
STEP 2: Read docs/ui-spec.md for visual specifications.
STEP 3: Search the codebase for existing components that do what you need.
         grep -r "ComponentName" apps/web/components/
STEP 4: Check the component hierarchy in the architecture blueprint.
STEP 5: Only THEN start writing code.
```

### 10.2 Component Rules for AI

```
RULE: NEVER create a component that already exists.
  Search first. Always.

RULE: NEVER create a component in components/ui/.
  That directory is managed by shadcn CLI only.
  Your custom components go in components/<feature>/ or components/shared/.

RULE: NEVER duplicate styling logic.
  If DifficultyBadge already handles difficulty colors, don't re-implement
  the color logic in another component. Import and use DifficultyBadge.

RULE: NEVER create a component and "plan to refactor later."
  Build it right the first time. Follow the component rules in Section 2.
```

### 10.3 File Rules for AI

```
RULE: NEVER modify files unrelated to the current task.
  If you're building the Repos page, don't touch the Dashboard page.

RULE: NEVER create files outside the documented folder structure.
  No components/helpers/, no utils/misc.ts, no lib/helpers/.
  Follow Section 1.3 exactly.

RULE: Return COMPLETE files.
  Never return a file with "... rest of the code" or "// add more here".
  Every file you create or modify must be complete and runnable.

RULE: NEVER leave placeholder implementations.
  No <div>TODO: implement this</div>.
  No function placeholder() { throw new Error("not implemented") }.
  If you can't implement it, say so. Don't leave landmines.
```

### 10.4 Styling Rules for AI

```
RULE: Use ONLY design tokens from ui-spec.md and globals.css.
  Never invent new colors, spacing, or typography values.

RULE: Use Tailwind classes, not inline styles.

RULE: When you need a color, check ui-spec.md Section 3.
  If the color isn't defined, ask — don't guess.

RULE: When you need a spacing value, use the spacing scale (Section 5 of ui-spec.md).
  Every value must be on the 4px grid.
```

### 10.5 Data Rules for AI

```
RULE: NEVER invent API endpoints.
  The backend API is defined in apps/http-server/src/modules/.
  Only use endpoints that exist. If you need a new one, say so explicitly.
  Do NOT create a fetch call to an endpoint and assume it exists.

RULE: NEVER hardcode data.
  No mock users, no fake issue lists, no sample repo data in production code.
  If you need data for development, create it in a separate dev seed script.

RULE: NEVER store secrets or API keys in frontend code.
  Use environment variables via .env.local.
```

### 10.6 Quality Rules for AI

```
RULE: Every component you create must handle:
  1. Loading state (skeleton or spinner)
  2. Error state (ErrorState component or toast)
  3. Empty state (EmptyState component)
  4. Success state (the actual content)

  If ANY of these four states is missing, the component is incomplete.

RULE: Every interactive element must be keyboard accessible.
  Test mentally: can a keyboard-only user perform this action?

RULE: Every component must look correct in dark mode (the default).
  Don't build for light mode and "add dark later."

RULE: Code must pass TypeScript strict mode with zero errors.
  No @ts-ignore. No @ts-expect-error (unless with a documented reason).
  No type assertions without runtime validation.
```

### 10.7 Incremental Development

```
RULE: Build ONE component at a time.
  Don't build the entire page in a single response.
  Build the smallest complete unit, verify it, then build the next.

RULE: Order of implementation:
  1. Types (lib/types.ts additions)
  2. API functions (lib/api.ts additions)
  3. Hooks (hooks/ if needed)
  4. Lowest-level components first (badges, tags, dots)
  5. Composite components next (cards, rows)
  6. Page-level components last (page.tsx)

RULE: Each step should result in code that compiles and runs.
  Never leave the codebase in a broken state between steps.
```

### 10.8 What to Do When Uncertain

```
IF you're unsure which component to use → ASK.
IF you're unsure about the API shape → CHECK apps/http-server/ and packages/db/prisma/schema.prisma.
IF you're unsure about a design decision → REFER to docs/ui-spec.md.
IF you're unsure about architecture → REFER to the architecture blueprint.
IF you're unsure about anything else → ASK. Don't guess. Don't "wing it."

The cost of asking is near zero.
The cost of guessing wrong is a review cycle and a rewrite.
```

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│                     ARGUS FRONTEND RULES                    │
│                       QUICK REFERENCE                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Components      → Server by default. "use client" minimal │
│  Folder          → components/<feature>/<component>.tsx     │
│  Naming          → kebab-case files, PascalCase components  │
│  Exports         → Named exports only. No barrels.         │
│  Styling         → Tailwind only. Tokens only. cn() only.  │
│  State           → URL > Server > Context > Local          │
│  Data fetching   → RSC first. SWR for client mutations.    │
│  Errors          → Always handle. Never swallow.           │
│  Loading         → Skeletons. Never spinners in content.   │
│  Accessibility   → Keyboard-first. ARIA labels. 4.5:1.    │
│  Animation       → framer-motion. Max 400ms. No bounce.   │
│  TypeScript      → Strict. No any. No assertions.         │
│  AI: Search      → Always search before creating.         │
│  AI: Complete    → Every file must be complete & runnable. │
│  AI: Tokens      → Only use values from ui-spec.md.       │
│  AI: APIs        → Only call endpoints that exist.         │
│                                                             │
│  When in doubt → Read the docs. Ask, don't guess.         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```
