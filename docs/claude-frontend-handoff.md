# Argus frontend handoff for Claude

## Purpose and current boundary

Argus is an AI-assisted open-source contribution discovery product. The backend already ingests public GitHub repositories, polls their issues, runs AI analysis, and produces user-specific recommendations. The frontend work completed so far is primarily a production-style **public landing page** and a small reusable UI/layout foundation for the future authenticated product.

The only Next.js route that exists today is `/` (`apps/web/app/page.tsx`). There are no page files yet for `/dashboard`, `/explore`, `/repos`, `/bookmarks`, `/settings`, `/privacy`, or `/terms`. Some components link to those paths as intended future routes, but they will currently 404. Do not describe the dashboard as implemented: the dashboard-looking area on the landing page is an interactive mockup only.

## Stack and project location

- Monorepo: npm workspaces + Turborepo.
- Web app: `apps/web`, Next.js 16.2, React 19.2, TypeScript, Tailwind CSS v4.
- Component primitives: shadcn-generated components backed by Base UI (`@base-ui/react`). The shadcn configuration is `apps/web/components.json`.
- Icons: `lucide-react`.
- Animation: `framer-motion`.
- Styling helper: `cn()` in `apps/web/lib/utils.ts` wraps `clsx` and `tailwind-merge`.
- Fonts: the root layout loads Google Geist as `--font-sans` and also contains local Geist Sans/Mono font registrations. The global styling is in `apps/web/app/globals.css`.

Run the frontend with `npm run dev -- --filter=web` from the repo root, or `npm run dev` inside `apps/web` (port 3000). The API server listens on port 4000.

## Design source of truth and coding constraints

Before modifying the UI, read these two documents in full:

1. `docs/ui-spec.md` — visual system, responsive behavior, accessibility, component specifications, and app/marketing visual direction.
2. `docs/frontend-rules.md` — architecture and implementation rules.

The intended visual direction is a dark, developer-native product: near-black canvas, monochrome surfaces, blue only as an interactive/match-score accent, green/amber/red only for semantic statuses. The formal tokens use OKLCH and are documented in the UI spec. The app defaults to a near-black body (`#09090b`). Landing sections use a `max-w-7xl` container with responsive `px-4 sm:px-6 lg:px-8`, 56px sticky header, compact typography, subtle borders, and restrained motion.

Important rules from `frontend-rules.md`:

- Prefer server components; add `"use client"` only where state, browser APIs, or animation requires it.
- Use named exports and kebab-case filenames.
- Reuse existing components before adding a new one. Do not manually add components to `components/ui`; that directory is managed by shadcn.
- Use Tailwind and the existing design tokens/classes; avoid inline styles and invented values.
- Build complete loading, error, empty, and success states for data-driven product screens.
- Do not invent endpoints or production mock data. Check `apps/http-server/src/modules/` and the Prisma schema first.
- Use accessible semantic controls and add `data-testid` attributes to new key interactive elements.

## What is implemented on `/`

`apps/web/app/page.tsx` composes this public page in order:

1. `components/landing/header.tsx`
2. `components/landing/hero.tsx`
3. `components/landing/problem.tsx`
4. `components/landing/how-it-works.tsx`
5. `components/landing/features.tsx`
6. `components/landing/product-preview.tsx`
7. `components/landing/cta.tsx`
8. `components/landing/footer.tsx`

The root page uses `min-h-screen`, `bg-[#09090b]`, foreground text, antialiasing, and `overflow-x-hidden`. The page is not wired to real user/repository/recommendation data.

### Public header

`header.tsx` provides a sticky 56px header. It has the Argus diamond mark, in-page anchors (`#problem`, `#how-it-works`, `#features`, `#preview`), a GitHub external link placeholder, Sign In/Get Started buttons, and a responsive mobile menu implemented with the shared Sheet primitive. Both auth buttons use a browser redirect to the hard-coded development URL `http://localhost:4000/auth/github`.

### Hero

`hero.tsx` contains the preview badge, headline, explanatory copy, GitHub-auth CTA, and an “Explore Live Issues” button that smoothly scrolls to `#preview`. It uses Framer Motion staggered entrance animation and `useReducedMotion` support. The radial background is deliberately understated.

### Marketing content sections

- `problem.tsx`: three cards describing noisy discovery, setup friction, and unreliable labels.
- `how-it-works.tsx`: three-step Discover → AI understanding → Match & Contribute workflow.
- `features.tsx`: responsive bento grid for AI summaries, complexity, matching, discovery, scores, and bookmarks.
- `cta.tsx`: final GitHub authorization call-to-action.
- `footer.tsx`: copyright and anchor links, plus future Privacy/Terms links. Those legal routes do not exist yet.

These sections all use Framer Motion in-view/entrance effects with 150–300ms-style restrained motion and respect `prefers-reduced-motion` where implemented.

### Interactive product preview: mock only

`product-preview.tsx` is a client component that visually demonstrates the intended dashboard. It contains two hard-coded `MockIssue` records and local state only:

- Clicking a left-side issue row swaps the active detail panel.
- Bookmark icons and the detail-panel Bookmark button toggle only in-memory state. Nothing persists and there is no backend bookmark model/endpoint.
- The detail view shows intended issue fields: repository name, difficulty, match percentage, AI summary, estimated time, skills, and relevant files.
- “View on GitHub” currently redirects to the GitHub OAuth URL, not the chosen issue’s GitHub URL. Treat this as unfinished demo behavior.

The preview is useful as a visual reference for future Feed/issue-detail components, but its `MockIssue` type and difficulty-colour helper functions should not become the product data layer. Extract reusable typed components (for example a `DifficultyBadge`) when building actual product pages rather than duplicating its rendering logic.

## Reusable foundation that exists but is not mounted

`apps/web/components/layout/` contains intended authenticated-app chrome. None of these components are rendered by the current root layout or the landing page:

- `top-nav.tsx`: client-side 56px navigation to future Feed, Explore, Repositories, and Bookmarks routes; desktop tabs, mobile Sheet, search entry point, theme toggle, user menu, and command palette.
- `search-button.tsx`: visual search trigger and Cmd/Ctrl+K listener.
- `command-palette.tsx`: Cmd/Ctrl+K dialog with navigation commands, a future “Track Repository” action (`/repos?add=true`), theme toggle, and logout. It does not search issues yet.
- `theme-toggle.tsx`: uses `next-themes`.
- `user-menu.tsx`: uses an optional user/onLogout API, but falls back to a hard-coded `tarun-saxena` avatar and directly calls the local logout endpoint.

These files show the intended navigation IA, but they are not production-ready integration code. In particular, no `ThemeProvider` is mounted in `app/layout.tsx`, so `useTheme()` components should not be mounted until a provider is added. The dark token declarations in `globals.css` are class-based, whereas the root HTML element currently does not set `.dark`; the landing page looks dark largely because of explicit near-black styles and body styling.

## Shared UI components

`apps/web/components/ui/` contains shadcn/Base UI primitives: avatar, badge, button, card, command, dialog, dropdown-menu, input/input-group, scroll-area, separator, sheet, skeleton, sonner, table, and textarea. Reuse them. The landing page currently uses Button, Sheet, and class utilities most visibly.

The project uses Base UI’s `render` prop in places such as `SheetTrigger` and `SheetClose`; preserve that pattern when extending these primitives. Do not replace it with a different component API without a deliberate migration.

## Current frontend API helper and actual server contract

`apps/web/lib/api.ts` is uncommitted work currently present in the workspace. It centralizes fetches against `NEXT_PUBLIC_API_URL`, falling back to `http://localhost:4000`, and enables `credentials: "include"`. It exposes:

| Helper | Intended endpoint | Current server status |
| --- | --- | --- |
| `api.getMe()` | `GET /users/me` | **Not implemented**; only PATCH exists. |
| `api.updateMe(data)` | `PATCH /users/me` | Implemented, auth required. |
| `api.logout()` | `POST /auth/logout` | Implemented, but cross-origin credential CORS needs fixing. |
| `api.addRepo(fullName)` | `POST /repos` | Implemented, auth required. |
| `api.getRepos()` | `GET /repos` | Implemented, currently public/no auth middleware. |
| `api.getRecommendations(filters)` | `GET /recommendations` | Implemented, auth required; server ignores the helper’s `limit` parameter. |

`api.ts` presently returns `any[]` / `any[]` for repository and recommendation data, and it throws plain `Error`, not the typed `ApiError` prescribed by the frontend rules. Improve this before relying on it broadly: introduce frontend data types, a typed error with status, and only ship helpers that match real endpoints.

### Server data shapes relevant to UI

The Prisma models live in `packages/db/prisma/schema.prisma`.

- A `User` has `username`, optional `email`, `skills: string[]`, `preferredLanguages: string[]`, and `interests: string[]`.
- A `Repo` has `name`, `fullName`, stars, optional `primaryLanguage`, topics, `lastPolledAt`, and timestamps.
- An `Issue` has title/body/labels/status/url and AI fields: `aiDifficulty` (`BEGINNER | INTERMEDIATE | ADVANCED` or null), `aiSummary`, `aiRelevantFiles`, `aiSkillsRequired`, `aiEstimatedTime`, and `analyzedAt`.
- A Recommendation response is `{ count, recommendations }`; each recommendation currently contains `{ id, score, issue }`, where `issue` includes its `repo`.

Relevant route files:

- `apps/http-server/src/modules/auth/routes.ts`
- `apps/http-server/src/modules/users/route.ts`
- `apps/http-server/src/modules/repos/route.ts`
- `apps/http-server/src/modules/recommendations/routes.ts`

## Integration blockers and known gaps

1. Add `GET /users/me` before implementing profile hydration or using `api.getMe()`.
2. The API server uses bare `app.use(cors())` in `apps/http-server/src/index.ts`. Credentialed browser requests require an explicit frontend origin and `credentials: true`; without that, the cookie-backed frontend API flow will fail cross-origin.
3. OAuth callback sets an `httpOnly` cookie and redirects to `FRONTEND_URL`. It is development-oriented (`secure: false`, `sameSite: "lax"`). Confirm deployment domains/cookie settings before production work.
4. GitHub and logout URLs are hard-coded to `http://localhost:4000` in several components. Centralize these in environment-aware configuration before deploying.
5. Root metadata is still the Next starter metadata (`Create Next App`), not Argus metadata.
6. There is no route protection, authenticated layout, theme provider, toast provider mounting, SWR/data hook layer, loading/error/empty components for real data, or E2E tests.
7. There is no bookmark persistence API/schema, so retain the mock preview state only as a demo until backend support exists.
8. The visual specification is more complete than the implementation. It describes app sidebar/dashboard patterns that have not yet been built.

## Safe implementation order from here

1. Stabilize foundation: create an app-level theme/provider setup, Argus metadata, an environment-aware API base URL/auth redirect, and a typed API client that matches the server.
2. Close required backend gaps (at minimum `GET /users/me` and credentialed CORS) before building screens that depend on them.
3. Add an authenticated route group and app layout that mounts `TopNav`, provider(s), and a content container. Do not mount the current mock `UserMenu` default in a real authenticated screen; feed it actual user data.
4. Implement the recommendation Feed/dashboard using `GET /recommendations`, based visually on the landing preview but with real API types, loading/error/empty states, filters that use the documented difficulty/issueType query contract, and direct links to `issue.url`.
5. Implement Repositories with `GET /repos` and `POST /repos`; then the profile/settings form with `PATCH /users/me`.
6. Build Explore/Bookmarks only after their backend contracts exist or are explicitly scoped. Do not fake them as completed product features.

## Current workspace state

At handoff time, the working tree already has user changes that should be preserved:

- Modified: `apps/http-server/src/index.ts`, `apps/web/app/layout.tsx`, root `package.json`, and `package-lock.json`.
- New/untracked: `apps/web/lib/api.ts`.

The landing page components are committed history, while `api.ts` and the listed edits are not committed. Review and retain/reconcile them rather than discarding them. A frontend type check was not run in this environment because PowerShell blocks `npm.ps1` under the current execution policy; use `npm.cmd` or an enabled shell to verify after changes.
