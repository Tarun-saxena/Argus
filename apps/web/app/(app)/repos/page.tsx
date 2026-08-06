"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlusIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  Loader2Icon,
  StarIcon,
  ExternalLinkIcon,
} from "lucide-react";
import { api } from "@/lib/api";
import type { Repository } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { FilterPills } from "@/components/shared/filter-pills";
import { EmptyState } from "@/components/shared/empty-state";

// ─── Language color dot mapping ────────────────────────────────────────────────

const LANG_COLORS: Record<string, string> = {
  TypeScript: "bg-blue-400",
  JavaScript: "bg-yellow-400",
  Python: "bg-blue-500",
  Go: "bg-cyan-400",
  Rust: "bg-orange-500",
  Java: "bg-red-500",
  "C++": "bg-pink-500",
  Ruby: "bg-red-400",
  PHP: "bg-purple-400",
  Swift: "bg-orange-400",
  Kotlin: "bg-violet-500",
};

// ─── Trending repos catalogue ─────────────────────────────────────────────────

const TRENDING: Array<{
  fullName: string;
  description: string;
  language: string;
  stars: string;
  category: string;
}> = [
  { fullName: "vercel/next.js", description: "The React Framework for the Web", language: "TypeScript", stars: "128k", category: "Web" },
  { fullName: "shadcn-ui/ui", description: "Beautifully designed components", language: "TypeScript", stars: "82k", category: "Web" },
  { fullName: "trpc/trpc", description: "End-to-end typesafe APIs", language: "TypeScript", stars: "35k", category: "Web" },
  { fullName: "tailwindlabs/tailwindcss", description: "Utility-first CSS framework", language: "TypeScript", stars: "86k", category: "Web" },
  { fullName: "prisma/prisma", description: "Next-generation ORM for Node.js & TypeScript", language: "TypeScript", stars: "40k", category: "DevTools" },
  { fullName: "supabase/supabase", description: "The open source Firebase alternative", language: "TypeScript", stars: "77k", category: "DevTools" },
  { fullName: "vitejs/vite", description: "Next generation frontend tooling", language: "TypeScript", stars: "70k", category: "DevTools" },
  { fullName: "golang/go", description: "The Go programming language", language: "Go", stars: "125k", category: "Systems" },
  { fullName: "rust-lang/rust", description: "Empowering everyone to build reliable software", language: "Rust", stars: "100k", category: "Systems" },
  { fullName: "docker/compose", description: "Define and run multi-container apps", language: "Go", stars: "34k", category: "DevTools" },
  { fullName: "astro-build/astro", description: "The web framework for content-driven websites", language: "TypeScript", stars: "48k", category: "Web" },
  { fullName: "facebook/react", description: "The library for web and native user interfaces", language: "JavaScript", stars: "230k", category: "Web" },
];

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

// ─── Repo status indicator ────────────────────────────────────────────────────

function RepoStatus({ repo }: { repo: Repository }) {
  const isRecent = repo.lastPolledAt
    ? Date.now() - new Date(repo.lastPolledAt).getTime() < 10 * 60 * 1000
    : false;

  if (!repo.lastPolledAt) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-amber-400" aria-label="Scanning">
        <Loader2Icon className="size-3 animate-spin" aria-hidden="true" />
        Scanning
      </span>
    );
  }
  if (isRecent) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-emerald-400" aria-label="Active — recently polled">
        <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
        Active
      </span>
    );
  }
  return (
    <span className="text-xs text-muted-foreground" aria-label={`Last polled at ${new Date(repo.lastPolledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}>
      Polled {new Date(repo.lastPolledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
    </span>
  );
}

// ─── Category options ─────────────────────────────────────────────────────────

const ALL_CATEGORIES = ["All", ...Array.from(new Set(TRENDING.map((r) => r.category)))];

export default function RepositoriesPage() {
  const [repos, setRepos] = React.useState<Repository[]>([]);
  const [fullName, setFullName] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [category, setCategory] = React.useState<string>("All");

  const trackedNames = new Set(repos.map((r) => r.fullName));
  const filteredTrending = category === "All"
    ? TRENDING
    : TRENDING.filter((r) => r.category === category);

  const load = React.useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      setRepos(await api.getRepos());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load repositories.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { void load(); }, [load]);

  async function addRepo(name: string) {
    const trimmed = name.trim();
    if (!trimmed || submitting) return;
    setSubmitting(trimmed);
    setError(null);
    try {
      const newRepo = await api.addRepo(trimmed);
      setFullName("");
      setRepos((prev) => [newRepo, ...prev]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not add repository.");
    } finally {
      setSubmitting(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await addRepo(fullName);
  }

  const categoryOptions = ALL_CATEGORIES.map((c) => ({ value: c, label: c }));

  return (
    <section className="space-y-10">
      <PageHeader
        eyebrow="Repositories"
        title="Tracked repositories"
        description="Add any public GitHub repository. Argus polls every 5 minutes, runs AI analysis, and surfaces matching issues."
      />

      {/* ── Add repo form ── */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Add a repository
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex max-w-lg gap-2"
          aria-label="Add repository form"
        >
          <div className="relative flex-1">
            <GithubIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="owner/repository"
              data-testid="repo-input"
              aria-label="Repository name in owner/repository format"
              className="w-full h-9 pl-9 pr-4 text-sm rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={!!submitting || !fullName.trim()}
            aria-busy={!!submitting}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {submitting === fullName.trim() ? (
              <Loader2Icon className="size-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <PlusIcon className="size-3.5" aria-hidden="true" />
            )}
            {submitting === fullName.trim() ? "Adding…" : "Track"}
          </button>
        </form>

        {error && (
          <div role="alert" className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircleIcon className="size-4 shrink-0" aria-hidden="true" />
            {error}
          </div>
        )}
      </div>

      {/* ── Divider ── */}
      <div className="h-px bg-border/50" role="separator" />

      {/* ── Tracked repos ── */}
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {loading ? "Loading…" : `${repos.length} tracked`}
        </p>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading repositories">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="size-7 rounded-md" />
                  <Skeleton className="h-4 w-36" />
                </div>
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </div>
        ) : repos.length === 0 ? (
          <EmptyState
            icon={<GithubIcon className="size-10" />}
            title="No repositories yet"
            description="Track a repo above or pick one from the discovery section below."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {repos.map((repo) => (
                <motion.article
                  key={repo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.15 }}
                  className="group rounded-xl border border-border bg-card p-5 hover:border-border/80 transition-all"
                  aria-label={`Repository: ${repo.fullName}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="size-7 rounded-md bg-muted border border-border flex items-center justify-center shrink-0">
                        <GithubIcon className="size-3.5 text-muted-foreground" />
                      </div>
                      <h2 className="font-mono text-sm font-medium text-foreground truncate">
                        {repo.fullName}
                      </h2>
                    </div>
                    <a
                      href={`https://github.com/${repo.fullName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all"
                      aria-label={`Open ${repo.fullName} on GitHub`}
                    >
                      <ExternalLinkIcon className="size-3.5" aria-hidden="true" />
                    </a>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {repo.primaryLanguage && (
                      <span className="flex items-center gap-1.5">
                        <span
                          className={cn("size-2 rounded-full", LANG_COLORS[repo.primaryLanguage] ?? "bg-muted-foreground")}
                          aria-hidden="true"
                        />
                        {repo.primaryLanguage}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <StarIcon className="size-3" aria-hidden="true" />
                      {repo.stars.toLocaleString()}
                    </span>
                    <span className="ml-auto">
                      <RepoStatus repo={repo} />
                    </span>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Divider ── */}
      <div className="h-px bg-border/50" role="separator" />

      {/* ── Discovery hub ── */}
      <div className="space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
            Discover open source
          </p>
          <p className="text-sm text-muted-foreground">
            Popular repositories to explore. Click Track to start watching for issues.
          </p>
        </div>

        {/* Category filter */}
        <FilterPills
          aria-label="Filter by category"
          options={categoryOptions}
          activeValue={category}
          onChange={(v) => setCategory(v as string)}
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredTrending.map((repo) => {
              const isTracked = trackedNames.has(repo.fullName);
              const isAdding = submitting === repo.fullName;
              return (
                <motion.div
                  key={repo.fullName}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    "rounded-xl border p-4 transition-all",
                    isTracked ? "border-primary/20 bg-primary/5" : "border-border bg-card hover:border-border/80"
                  )}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <GithubIcon className="size-3.5 text-muted-foreground shrink-0" />
                      <span className="font-mono text-xs text-foreground truncate">
                        {repo.fullName}
                      </span>
                    </div>
                    {isTracked ? (
                      <span className="flex items-center gap-1 text-xs text-primary shrink-0 font-medium">
                        <CheckCircleIcon className="size-3" aria-hidden="true" />
                        Tracked
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={!!submitting}
                        onClick={() => addRepo(repo.fullName)}
                        aria-busy={isAdding}
                        aria-label={`Track ${repo.fullName}`}
                        className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline underline-offset-4 disabled:opacity-50 transition-colors"
                      >
                        {isAdding ? (
                          <Loader2Icon className="size-3 animate-spin" aria-hidden="true" />
                        ) : (
                          <PlusIcon className="size-3" aria-hidden="true" />
                        )}
                        {isAdding ? "Adding…" : "Track"}
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {repo.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <span
                        className={cn("size-2 rounded-full", LANG_COLORS[repo.language] ?? "bg-muted-foreground")}
                        aria-hidden="true"
                      />
                      {repo.language}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono" aria-label={`${repo.stars} stars`}>★ {repo.stars}</span>
                    <span className="ml-auto px-1.5 py-0.5 rounded text-xs bg-muted text-muted-foreground">
                      {repo.category}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}