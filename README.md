# Argus

**Find open-source issues that actually fit you.**

Argus continuously scans GitHub repositories, uses AI to analyze every open issue for difficulty and required skills, and recommends the ones that genuinely match your experience — no more scrolling through hundreds of stale "good first issue" labels hoping for the best.

---

## Why Argus exists

Contributing to open source sounds simple until you actually try it. `good-first-issue` labels are often stale, already claimed, or quietly require deep codebase knowledge. Searching manually means opening dozens of repos, filtering by label, and reading through issue threads just to figure out if something is worth your time. Argus removes that friction — it does the searching, reading, and ranking for you.

## How it works

1. **Sign in with GitHub** — OAuth login, no separate account needed.
2. **Set your skills** — languages, frameworks, and tools you actually know.
3. **Track repositories** — add any public GitHub repo you care about.
4. **Argus does the rest** — a background worker polls each repo every few minutes, runs every new issue through Gemini for difficulty/skill/summary analysis, and scores it against your profile.
5. **Triage your feed** — browse your personalized inbox, bookmark issues for later, claim ones you're working on, or ignore ones that aren't a fit.

---

## Architecture

Argus is a Turborepo monorepo with three independently running services sharing a Postgres database and a Redis-backed job queue.

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   web        │──────│ http-server  │──────│  Postgres   │
│  (Next.js)   │      │  (Express)   │      │   (Neon)    │
└─────────────┘      └──────┬───────┘      └──────┬──────┘
                             │                      │
                             │ enqueues jobs         │ reads/writes
                             ▼                      │
                      ┌─────────────┐               │
                      │    Redis     │               │
                      │  (BullMQ)    │               │
                      └──────┬───────┘               │
                             │                      │
                             ▼                      │
                      ┌─────────────┐               │
                      │   worker     │───────────────┘
                      │  (BullMQ)    │
                      └──────────────┘
                             │
                    polls GitHub, calls Gemini
```

- **`web`** — the Next.js frontend. Landing page, dashboard feed, repo management, settings, and triage UI.
- **`http-server`** — the Express API. Handles GitHub OAuth, JWT session cookies, and all REST endpoints the frontend calls.
- **`worker`** — a standalone Node process running BullMQ workers. Polls GitHub for new issues, runs AI analysis on each one, and scores/matches issues against every user's profile.
- **Postgres (via Prisma + Neon)** — the single source of truth for users, repos, issues, and recommendations.
- **Redis (via BullMQ)** — the job queue coordinating work between `http-server` and `worker` without either needing to know about the other directly.

None of `http-server`'s requests block on slow work (GitHub polling, AI calls) — everything expensive is pushed onto the queue and handled asynchronously by `worker`.

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16, React, Tailwind CSS, shadcn/ui |
| Backend API | Express, TypeScript |
| Background jobs | BullMQ, Redis |
| Database | PostgreSQL (Neon), Prisma ORM |
| AI analysis | Google Gemini |
| Auth | GitHub OAuth, JWT (httpOnly cookies) |
| Monorepo tooling | Turborepo, npm workspaces |

---

## Core features

- **AI-powered issue analysis** — every issue is scored for difficulty (Beginner / Intermediate / Advanced), summarized in plain English, and tagged with the skills and files it likely touches.
- **Personalized match scoring** — a 0–100 score per issue per user, based on language match, AI-detected skill overlap, and issue freshness.
- **Real-time-ish polling** — tracked repos are re-polled every few minutes using GitHub's ETag headers, so re-checks that find nothing new don't burn API rate limit.
- **Triage workflow** — issues move through Inbox → Bookmarked / Claimed / Ignored states, with keyboard shortcuts (`J`/`K` to navigate, `B`/`C`/`I` to triage) for fast daily use.
- **Explore view** — a searchable, sortable table across every matched issue regardless of triage state, for broader browsing.
- **Automatic re-matching** — updating your skills or languages in Settings triggers a background rematch across all currently analyzed issues, so your feed reflects your latest profile without needing to wait for new issues to arrive.

---

## Getting started

### Prerequisites

- Node.js 20+
- Docker (for local Redis)
- A [Neon](https://neon.tech) Postgres database (or any Postgres instance)
- A GitHub OAuth App ([create one here](https://github.com/settings/developers))
- A [Gemini API key](https://aistudio.google.com/app/apikey)

### 1. Clone and install

```bash
git clone https://github.com/Tarun-saxena/Argus.git
cd Argus
npm install
```

### 2. Start Redis

```bash
docker compose up -d redis
```

### 3. Configure environment variables

Each app needs its own `.env` file.

**`apps/http-server/.env`**
```env
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"
REDIS_URL=redis://localhost:6380
JWT_SECRET=some_long_random_string
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
GITHUB_CALLBACK_URL=http://localhost:4000/auth/github/callback
FRONTEND_URL=http://localhost:3000
```

**`apps/worker/.env`**
```env
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"
REDIS_URL=redis://localhost:6380
GITHUB_TOKEN=your_github_personal_access_token
GEMINI_API_KEY=your_gemini_api_key
```

**`apps/web/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

> `GITHUB_TOKEN` is optional but strongly recommended — unauthenticated GitHub API requests are capped at 60/hour, versus 5,000/hour with a personal access token.

### 4. Set up the database

```bash
cd packages/db
npx prisma migrate dev
npx prisma generate
cd ../..
```

### 5. Register a GitHub OAuth App

At [github.com/settings/developers](https://github.com/settings/developers):
- **Homepage URL**: `http://localhost:3000`
- **Authorization callback URL**: `http://localhost:4000/auth/github/callback`

Copy the generated Client ID and Secret into `apps/http-server/.env`.

### 6. Run everything

```bash
npm run dev
```

This starts `web` (port 3000), `http-server` (port 4000), and `worker` together via Turborepo.

Visit **http://localhost:3000**, sign in with GitHub, set your skills, add a repo, and Argus will start polling and analyzing issues in the background.

---

## Project structure

```
Argus/
├── apps/
│   ├── web/            # Next.js frontend
│   ├── http-server/     # Express API — auth, repos, recommendations
│   └── worker/          # BullMQ workers — polling, AI analysis, matching
├── packages/
│   ├── db/              # Prisma schema, migrations, shared client
│   └── queue/           # Shared BullMQ queue + Redis connection
├── docker-compose.yml   # Local Redis
└── turbo.json
```

---

## How matching works

Each analyzed issue is scored per user out of a set of weighted signals:

- **Language match** — does the repo's primary language appear in the user's preferred languages?
- **AI-detected skill overlap** — how many of the skills Gemini flagged as required match the user's listed skills?
- **Freshness** — newer issues score higher, since older open issues are more likely stale or already claimed.

Scores are normalized to 0–100. Recommendations below a minimum threshold aren't shown. Updating your profile triggers a full rematch across every currently-analyzed open issue.

---

## License

MIT
