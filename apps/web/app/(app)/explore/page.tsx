"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SearchIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExternalLinkIcon,
  SparklesIcon,
  ClockIcon,
  AlertCircleIcon,
  Loader2Icon,
} from "lucide-react";
import { api } from "@/lib/api";
import type { Difficulty } from "@/lib/types";
import { difficultyColor, difficultyLabel, scoreColor, formatScore } from "@/lib/issue-utils";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { FilterPills } from "@/components/shared/filter-pills";
import { recommendationState } from "@/lib/recommendation-state";

// ─── Types ─────────────────────────────────────────────────────────────────────

type SortField = "score" | "time" | "difficulty" | "recent";
type SortDir = "asc" | "desc";

const DIFFICULTY_OPTIONS: Array<{ value: Difficulty | undefined; label: string }> = [
  { value: undefined, label: "All" },
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
];

function formatRelativeTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default function ExplorePage() {
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [diffFilter, setDiffFilter] = React.useState<Difficulty | undefined>();
  const [sortField, setSortField] = React.useState<SortField>("score");
  const [sortDir, setSortDir] = React.useState<SortDir>("desc");
  const [trackedOnly, setTrackedOnly] = React.useState(false);
  const [nextCursor, setNextCursor] = React.useState<string | null>(null);
  const [hasMore, setHasMore] = React.useState(false);

  const inFlightRef = React.useRef(false);

  // Debounce search input changes
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const load = React.useCallback(async (opts?: { isSilent?: boolean; append?: boolean; useCursor?: string | null }) => {
    if (inFlightRef.current && opts?.isSilent && !opts.append) return;
    inFlightRef.current = true;

    if (opts?.append) {
      setLoadingMore(true);
    } else if (!opts?.isSilent) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setError(null);

    const apiSortBy =
      sortField === "score"
        ? "matchScore"
        : sortField === "difficulty"
        ? "difficulty"
        : sortField === "recent"
        ? "recent"
        : "estimatedTime";

    try {
      const res = await api.exploreIssues({
        search: debouncedSearch.trim() || undefined,
        difficulty: diffFilter,
        sortBy: apiSortBy,
        sortDir: sortDir,
        trackedOnly: trackedOnly,
        cursor: opts?.useCursor || undefined,
        limit: 20,
      });

      if (opts?.append) {
        setItems((prev) => {
          const existingIds = new Set(prev.map((i) => i.id));
          const newItems = res.items.filter((i: any) => !existingIds.has(i.id));
          return [...prev, ...newItems];
        });
      } else {
        setItems(res.items);
      }
      setNextCursor(res.nextCursor);
      setHasMore(res.hasMore);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load issues.");
    } finally {
      inFlightRef.current = false;
      setLoading(false);
      setLoadingMore(false);
      setIsRefreshing(false);
    }
  }, [debouncedSearch, diffFilter, sortField, sortDir, trackedOnly]);

  // Trigger full reset load when parameters change
  React.useEffect(() => {
    void load();
  }, [load]);

  const [recStatus, setRecStatus] = React.useState(recommendationState.getStatus());

  React.useEffect(() => {
    return recommendationState.subscribeStatus((s) => setRecStatus(s));
  }, []);

  React.useEffect(() => {
    return recommendationState.subscribeInvalidation(() => {
      void load({ isSilent: true });
    });
  }, [load]);

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      // default score/time/recent to desc, difficulty to asc
      setSortDir(field === "difficulty" ? "asc" : "desc");
    }
  }

  function handleLoadMore() {
    if (loadingMore || !nextCursor) return;
    void load({ append: true, useCursor: nextCursor });
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ArrowUpDownIcon className="size-3 opacity-40" aria-hidden="true" />;
    return sortDir === "desc"
      ? <ArrowDownIcon className="size-3" aria-hidden="true" />
      : <ArrowUpIcon className="size-3" aria-hidden="true" />;
  }

  const sortHeaderClass = (field: SortField) =>
    cn(
      "flex items-center gap-1 text-xs font-medium uppercase tracking-widest transition-colors",
      sortField === field
        ? "text-foreground font-semibold"
        : "text-muted-foreground hover:text-foreground"
    );

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Explore"
        title="All issues"
        description="Search and filter across every matched issue from your tracked repositories."
      />

      {(recStatus === "saving" || recStatus === "recalculating") && (
        <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground">
          <Loader2Icon className="size-4 animate-spin text-primary shrink-0" aria-hidden="true" />
          <div>
            <p className="font-medium text-xs text-foreground">Updating recommendation results...</p>
            <p className="text-xs text-muted-foreground mt-0.5">Searching and filtering remain available during the update.</p>
          </div>
        </div>
      )}

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" aria-hidden="true" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search issues, repos, skills…"
            data-testid="explore-search"
            aria-label="Search issues"
            className="w-full h-9 pl-9 pr-4 text-sm rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <FilterPills
            aria-label="Filter by difficulty"
            options={DIFFICULTY_OPTIONS}
            activeValue={diffFilter}
            onChange={(v) => setDiffFilter(v as Difficulty | undefined)}
          />
          <button
            onClick={() => setTrackedOnly(!trackedOnly)}
            className={cn(
              "inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border text-xs font-semibold transition-all",
              trackedOnly
                ? "bg-primary/10 border-primary/30 text-primary"
                : "border-border text-muted-foreground hover:text-foreground bg-card"
            )}
          >
            Tracked Only
          </button>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-xs text-muted-foreground" aria-live="polite" aria-atomic="true">
        <p>
          {loading
            ? "Loading…"
            : `${items.length} ${items.length === 1 ? "issue" : "issues"}${search ? ` matching "${search}"` : ""}`}
        </p>
        {isRefreshing && (
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-primary">
            <Loader2Icon className="size-3 animate-spin" aria-hidden="true" />
            Updating issues…
          </span>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden" role="table" aria-label="Issues table">
        {/* Table header */}
        <div
          role="row"
          className="grid grid-cols-[1fr_150px_140px_120px_80px] gap-4 px-4 py-3 border-b border-border bg-muted/40"
        >
          <span role="columnheader" className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Title
          </span>
          <span role="columnheader" className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Repository
          </span>
          <button
            role="columnheader"
            type="button"
            onClick={() => toggleSort("difficulty")}
            aria-sort={sortField === "difficulty" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
            className={sortHeaderClass("difficulty")}
          >
            Difficulty <SortIcon field="difficulty" />
          </button>
          <button
            role="columnheader"
            type="button"
            onClick={() => toggleSort("recent")}
            aria-sort={sortField === "recent" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
            className={sortHeaderClass("recent")}
          >
            Age <SortIcon field="recent" />
          </button>
          <button
            role="columnheader"
            type="button"
            onClick={() => toggleSort("score")}
            aria-sort={sortField === "score" ? (sortDir === "asc" ? "ascending" : "descending") : "none"}
            className={cn(sortHeaderClass("score"), "justify-end")}
          >
            Match <SortIcon field="score" />
          </button>
        </div>

        {/* Rows */}
        {loading ? (
          <div role="rowgroup" aria-busy="true" aria-label="Loading issues">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} role="row" className="grid grid-cols-[1fr_150px_140px_120px_80px] gap-4 px-4 py-3.5 border-b border-border/40">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-10 ml-auto" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div role="alert" className="flex items-center gap-3 p-6 text-destructive">
            <AlertCircleIcon className="size-4" aria-hidden="true" />
            <p className="text-sm">{error}</p>
            <button onClick={() => void load()} className="ml-auto text-xs underline" aria-label="Retry loading">Retry</button>
          </div>
        ) : items.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground"
            role="status"
          >
            <SparklesIcon className="size-7 opacity-40" aria-hidden="true" />
            <p className="text-sm">
              {search
                ? `No issues matching "${search}"`
                : "No issues found. Try adjusting your filters."}
            </p>
          </div>
        ) : (
          <div role="rowgroup">
            <AnimatePresence initial={false}>
              {items.map((item, idx) => {
                const score = Math.round(item.score);
                const difficulty = item.aiDifficulty;
                return (
                  <motion.div
                    key={item.id}
                    role="row"
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className={cn(
                      "grid grid-cols-[1fr_150px_140px_120px_80px] gap-4 px-4 py-3.5 border-b border-border/40 hover:bg-muted/30 transition-colors cursor-pointer group border-l-2",
                      difficulty === "BEGINNER" && "border-l-emerald-500 dark:border-l-emerald-400",
                      difficulty === "INTERMEDIATE" && "border-l-amber-500 dark:border-l-amber-400",
                      difficulty === "ADVANCED" && "border-l-red-500 dark:border-l-red-400",
                      !difficulty && "border-l-transparent",
                      idx === items.length - 1 && "border-b-0"
                    )}
                    onClick={() => window.open(item.url, "_blank")}
                    aria-label={`Open issue: ${item.title}`}
                  >
                    {/* Title cell */}
                    <div role="cell" className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {item.title}
                      </p>
                      {(item.aiSkillsRequired || []).length > 0 && (
                        <div className="flex gap-1.5 mt-1 flex-wrap" aria-label="Skills">
                          {(item.aiSkillsRequired || []).slice(0, 3).map((s: string) => (
                            <span
                              key={s}
                              className="text-xs px-1.5 py-px rounded border border-border/50 text-muted-foreground font-mono"
                            >
                              {s}
                            </span>
                          ))}
                          {(item.aiSkillsRequired || []).length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{(item.aiSkillsRequired || []).length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Repo cell */}
                    <div role="cell" className="self-center">
                      <span className="text-xs font-mono text-muted-foreground truncate">
                        {item.repo.fullName}
                      </span>
                    </div>

                    {/* Difficulty & State cell */}
                    <div role="cell" className="flex items-center gap-1.5 flex-wrap self-center">
                      {item.aiDifficulty ? (
                        <span className={cn(
                          "text-xs font-medium px-2 py-0.5 rounded-full border",
                          difficultyColor(item.aiDifficulty)
                        )}>
                          {difficultyLabel(item.aiDifficulty)}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground" aria-label="No difficulty data">—</span>
                      )}
                      {item.matchState === "BOOKMARKED" && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-primary font-semibold">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M5 3a2 2 0 00-2 2v14l7-4 7 4V5a2 2 0 00-2-2H5z" />
                          </svg>
                          Saved
                        </span>
                      )}
                      {item.matchState === "CLAIMED" && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 font-semibold">
                          Claimed
                        </span>
                      )}
                      {item.matchState === "IGNORED" && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground font-semibold">
                          Ignored
                        </span>
                      )}
                      {item.matchState === "INBOX" && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 font-semibold">
                          Tracked
                        </span>
                      )}
                    </div>

                    {/* Age cell */}
                    <div role="cell" className="self-center">
                      <span className="text-xs text-muted-foreground font-mono">
                        {formatRelativeTime(item.githubCreatedAt)}
                      </span>
                    </div>

                    {/* Match score cell */}
                    <div role="cell" className="flex items-center justify-end gap-1.5 self-center">
                      <span className={cn("text-sm font-bold font-mono tabular-nums", scoreColor(score))}>
                        {formatScore(score)}
                      </span>
                      <ExternalLinkIcon
                        className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-hidden="true"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-6">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore && <Loader2Icon className="size-3 animate-spin text-primary" aria-hidden="true" />}
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </section>
  );
}
