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
} from "lucide-react";
import { api } from "@/lib/api";
import type { Difficulty, Recommendation } from "@/lib/types";
import { difficultyColor, difficultyLabel, scoreColor, formatScore } from "@/lib/issue-utils";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { FilterPills } from "@/components/shared/filter-pills";

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
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [diffFilter, setDiffFilter] = React.useState<Difficulty | undefined>();
  const [sortField, setSortField] = React.useState<SortField>("score");
  const [sortDir, setSortDir] = React.useState<SortDir>("desc");

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getRecommendations();
      setAllItems(res.recommendations);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load issues.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { void load(); }, [load]);

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
      if (sortField === "score") cmp = a.score - b.score;
      else if (sortField === "difficulty") {
        cmp =
          (DIFFICULTY_ORDER[a.issue.aiDifficulty ?? ""] ?? 99) -
          (DIFFICULTY_ORDER[b.issue.aiDifficulty ?? ""] ?? 99);
      } else if (sortField === "time") {
        cmp = (a.issue.aiEstimatedTime ?? "").localeCompare(b.issue.aiEstimatedTime ?? "");
      }
      return sortDir === "desc" ? -cmp : cmp;
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
      <p className="text-xs text-muted-foreground" aria-live="polite" aria-atomic="true">
        {loading
          ? "Loading…"
          : `${filtered.length} ${filtered.length === 1 ? "issue" : "issues"}${search ? ` matching "${search}"` : ""}`}
      </p>

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
