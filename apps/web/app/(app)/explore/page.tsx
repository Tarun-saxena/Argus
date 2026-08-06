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
import type { Difficulty, Recommendation } from "@/lib/types";
import { difficultyColor, difficultyLabel, scoreColor, formatScore } from "@/lib/issue-utils";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { FilterPills } from "@/components/shared/filter-pills";
import { recommendationState } from "@/lib/recommendation-state";

// ─── Types ─────────────────────────────────────────────────────────────────────

type SortField = "score" | "time" | "difficulty";
type SortDir = "asc" | "desc";

const DIFFICULTY_OPTIONS: Array<{ value: Difficulty | undefined; label: string }> = [
  { value: undefined, label: "All" },
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
];

const DIFFICULTY_ORDER: Record<string, number> = {
  BEGINNER: 0,
  INTERMEDIATE: 1,
  ADVANCED: 2,
};

export default function ExplorePage() {
  const [allItems, setAllItems] = React.useState<Recommendation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [diffFilter, setDiffFilter] = React.useState<Difficulty | undefined>();
  const [sortField, setSortField] = React.useState<SortField>("score");
  const [sortDir, setSortDir] = React.useState<SortDir>("desc");

  const inFlightRef = React.useRef(false);

  const load = React.useCallback(async (opts?: { isSilent?: boolean }) => {
    if (inFlightRef.current && opts?.isSilent) return;
    inFlightRef.current = true;

    console.log("[Frontend] frontend refresh triggered");

    if (!opts?.isSilent) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setError(null);
    try {
      const res = await api.getRecommendations();
      console.log(`[Frontend] recommendations received: ${res.recommendations.length}`);
      setAllItems(res.recommendations);
      console.log(`[Frontend] recommendation count after each update: ${res.recommendations.length}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load issues.");
    } finally {
      inFlightRef.current = false;
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  React.useEffect(() => { void load(); }, [load]);

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
      setSortDir("desc");
    }
  }

  const filtered = React.useMemo(() => {
    let out = allItems;
    if (diffFilter) out = out.filter((r) => r.issue.aiDifficulty === diffFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(
        (r) =>
          r.issue.title.toLowerCase().includes(q) ||
          r.issue.repo.fullName.toLowerCase().includes(q) ||
          r.issue.aiSkillsRequired.some((s) => s.toLowerCase().includes(q))
      );
    }
    return [...out].sort((a, b) => {
      let cmp = 0;
      if (sortField === "score") {
        cmp = b.score - a.score;
      } else if (sortField === "difficulty") {
        const diffA = DIFFICULTY_ORDER[a.issue.aiDifficulty ?? ""] ?? 99;
        const diffB = DIFFICULTY_ORDER[b.issue.aiDifficulty ?? ""] ?? 99;
        cmp = diffA - diffB;
      } else if (sortField === "time") {
        const timeA = a.issue.aiEstimatedTime ?? "";
        const timeB = b.issue.aiEstimatedTime ?? "";
        cmp = timeA.localeCompare(timeB);
      }

      const primaryCmp = sortDir === "desc" ? cmp : -cmp;
      if (primaryCmp !== 0) return primaryCmp;

      // Tiebreaker 1: Higher score (if primary sort was difficulty or time)
      if (sortField !== "score" && b.score !== a.score) {
        return b.score - a.score;
      }

      // Tiebreaker 2: Newer GitHub issue first (createdAt desc)
      const timeA = a.issue.createdAt ? new Date(a.issue.createdAt).getTime() : 0;
      const timeB = b.issue.createdAt ? new Date(b.issue.createdAt).getTime() : 0;
      const timeDiff = timeB - timeA;
      if (timeDiff !== 0) return timeDiff;

      // Tiebreaker 3: GitHub issue ID desc
      const idA = a.issue.githubId || a.issue.id || "";
      const idB = b.issue.githubId || b.issue.id || "";
      return idB.localeCompare(idA, undefined, { numeric: true });
    });
  }, [allItems, diffFilter, search, sortField, sortDir]);

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
        <FilterPills
          aria-label="Filter by difficulty"
          options={DIFFICULTY_OPTIONS}
          activeValue={diffFilter}
          onChange={(v) => setDiffFilter(v as Difficulty | undefined)}
        />
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-xs text-muted-foreground" aria-live="polite" aria-atomic="true">
        <p>
          {loading
            ? "Loading…"
            : `${filtered.length} ${filtered.length === 1 ? "issue" : "issues"}${search ? ` matching "${search}"` : ""}`}
        </p>
        {isRefreshing && (
          <span className="flex items-center gap-1.5 text-[11px] font-medium text-primary">
            <Loader2Icon className="size-3 animate-spin" aria-hidden="true" />
            Updating issues…
          </span>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden" role="table" aria-label="Issues table">
        {/* Table header */}
        <div
          role="row"
          className="grid grid-cols-[1fr_160px_100px_80px] gap-4 px-4 py-3 border-b border-border bg-card/50"
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
              <div key={i} role="row" className="grid grid-cols-[1fr_160px_100px_80px] gap-4 px-4 py-3.5 border-b border-border/40">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-20 rounded-full" />
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
        ) : filtered.length === 0 ? (
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
              {filtered.map((rec, idx) => {
                const score = Math.round(rec.score);
                return (
                  <motion.div
                    key={rec.id}
                    role="row"
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className={cn(
                      "grid grid-cols-[1fr_160px_100px_80px] gap-4 px-4 py-3.5 border-b border-border/40 hover:bg-muted/30 transition-colors cursor-pointer group",
                      idx === filtered.length - 1 && "border-b-0"
                    )}
                    onClick={() => window.open(rec.issue.url, "_blank")}
                    aria-label={`Open issue: ${rec.issue.title}`}
                  >
                    {/* Title cell */}
                    <div role="cell" className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {rec.issue.title}
                      </p>
                      {rec.issue.aiSkillsRequired.length > 0 && (
                        <div className="flex gap-1.5 mt-1 flex-wrap" aria-label="Skills">
                          {rec.issue.aiSkillsRequired.slice(0, 3).map((s) => (
                            <span
                              key={s}
                              className="text-xs px-1.5 py-px rounded border border-border/50 text-muted-foreground font-mono"
                            >
                              {s}
                            </span>
                          ))}
                          {rec.issue.aiSkillsRequired.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{rec.issue.aiSkillsRequired.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Repo cell */}
                    <div role="cell" className="self-center">
                      <span className="text-xs font-mono text-muted-foreground truncate">
                        {rec.issue.repo.fullName}
                      </span>
                    </div>

                    {/* Difficulty cell */}
                    <div role="cell" className="self-center">
                      {rec.issue.aiDifficulty ? (
                        <span className={cn(
                          "text-xs font-medium px-2 py-0.5 rounded-full border",
                          difficultyColor(rec.issue.aiDifficulty)
                        )}>
                          {difficultyLabel(rec.issue.aiDifficulty)}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground" aria-label="No difficulty data">—</span>
                      )}
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
    </section>
  );
}
