"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRightIcon,
  SparklesIcon,
  BookmarkIcon,
  EyeOffIcon,
  CheckCircle2Icon,
  FileTextIcon,
  ClockIcon,
  AlertCircleIcon,
  GitForkIcon,
  Loader2Icon,
} from "lucide-react";

import { api } from "@/lib/api";
import type { Difficulty, Recommendation, TriageState } from "@/lib/types";
import { difficultyColor, difficultyLabel, scoreColor, formatScore } from "@/lib/issue-utils";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { FilterPills } from "@/components/shared/filter-pills";
import { EmptyState } from "@/components/shared/empty-state";
import { recommendationState } from "@/lib/recommendation-state";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LocalRec extends Recommendation {
  /** optimistic override while API call is in flight */
  pendingState?: TriageState;
}

// ─── Score breakdown ──────────────────────────────────────────────────────────

function ScoreBreakdown({ rec }: { rec: Recommendation }) {
  const score = Math.round(rec.score);
  const langMatch = rec.issue.repo.primaryLanguage ? 3 : 0;
  const skillScore = Math.min(rec.issue.aiSkillsRequired.length * 2, 6);
  const freshnessContrib = Math.max(0, score - Math.round(((langMatch + skillScore) / 11) * 100));

  return (
    <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <SparklesIcon className="size-3.5 text-primary" aria-hidden="true" />
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Why this matched
        </span>
      </div>
      <div className="space-y-2">
        <ScoreLine
          label="Language match"
          value={`+${langMatch}`}
          note={rec.issue.repo.primaryLanguage ?? "Not set"}
          active={langMatch > 0}
        />
        <ScoreLine
          label="Skill alignment"
          value={`+${skillScore}`}
          note={`${rec.issue.aiSkillsRequired.length} skills required`}
          active={skillScore > 0}
        />
        <ScoreLine
          label="Issue freshness"
          value={freshnessContrib > 0 ? `+${freshnessContrib}%` : "—"}
          note="Recent issues rank higher"
          active={freshnessContrib > 0}
        />
        <div className="h-px bg-border/50 my-1" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">Overall match</span>
          <span className={cn("text-sm font-bold font-mono", scoreColor(score))}>
            {formatScore(score)}
          </span>
        </div>
      </div>
    </div>
  );
}

function ScoreLine({
  label,
  value,
  note,
  active,
}: {
  label: string;
  value: string;
  note: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <span className={cn("text-xs font-medium", active ? "text-foreground" : "text-muted-foreground")}>
          {label}
        </span>
        <p className="text-xs text-muted-foreground truncate">{note}</p>
      </div>
      <span className={cn("text-xs font-mono shrink-0", active ? "text-primary font-semibold" : "text-muted-foreground")}>
        {value}
      </span>
    </div>
  );
}

// ─── File tree ────────────────────────────────────────────────────────────────

function FileTree({ files }: { files: string[] }) {
  if (files.length === 0) return null;
  return (
    <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <FileTextIcon className="size-3.5 text-muted-foreground" aria-hidden="true" />
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Relevant Files
        </span>
      </div>
      <div className="space-y-1.5">
        {files.map((f) => (
          <div key={f} className="flex items-center gap-2 group">
            <FileTextIcon className="size-3 text-muted-foreground/50 shrink-0" aria-hidden="true" />
            <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground transition-colors truncate">
              {f}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Difficulty filter options ─────────────────────────────────────────────────

const DIFFICULTY_OPTIONS: Array<{ value: Difficulty | undefined; label: string }> = [
  { value: undefined, label: "All" },
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
];

// ─── Issue list item ───────────────────────────────────────────────────────────

function IssueListItem({
  rec,
  isActive,
  onClick,
  index,
}: {
  rec: LocalRec;
  isActive: boolean;
  onClick: () => void;
  index: number;
}) {
  const score = Math.round(rec.score);
  const effectiveState = rec.pendingState ?? rec.state;

  return (
    <button
      type="button"
      onClick={onClick}
      data-testid="issue-list-item"
      role="listitem"
      aria-current={isActive ? "true" : undefined}
      aria-label={`Issue ${index + 1}: ${rec.issue.title}, ${formatScore(score)} match`}
      className={cn(
        // Static 2px left border slot — no layout shift when active
        "w-full text-left pl-[calc(0.875rem+2px)] pr-4 py-3.5 border-b border-border/40 transition-all duration-150 relative",
        "border-l-2",
        isActive
          ? "bg-muted/30 border-l-primary"
          : "hover:bg-muted/20 border-l-transparent"
      )}
    >
      {/* Repo eyebrow + score — deliberately lighter weight than the title */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[11px] font-mono text-muted-foreground/60 truncate leading-none">
          {rec.issue.repo.fullName}
        </span>
        <span className={cn("text-xs font-bold font-mono shrink-0 tabular-nums", scoreColor(score))}>
          {formatScore(score)}
        </span>
      </div>

      {/* Title — visually dominant: semibold, full foreground */}
      <p className={cn(
        "text-sm font-semibold leading-snug line-clamp-2 mb-2.5 mt-0.5",
        isActive ? "text-foreground" : "text-foreground/85"
      )}>
        {rec.issue.title}
      </p>

      {/* Chips row — lighter weight metadata */}
      <div className="flex items-center gap-2">
        {rec.issue.aiDifficulty && (
          <span className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full border",
            difficultyColor(rec.issue.aiDifficulty)
          )}>
            {difficultyLabel(rec.issue.aiDifficulty)}
          </span>
        )}
        {rec.issue.aiEstimatedTime && (
          <span className="text-xs text-muted-foreground/70 flex items-center gap-1">
            <ClockIcon className="size-3" aria-hidden="true" />
            {rec.issue.aiEstimatedTime}
          </span>
        )}
        <span className="ml-auto">
          {effectiveState === "BOOKMARKED" ? (
            <BookmarkIcon className="size-3 text-primary fill-primary" aria-label="Saved" />
          ) : effectiveState === "CLAIMED" ? (
            <CheckCircle2Icon className="size-3 text-emerald-400" aria-label="Claimed" />
          ) : null}
        </span>
      </div>
    </button>
  );
}

// ─── Issue detail panel ────────────────────────────────────────────────────────

function IssueDetail({
  rec,
  onBookmark,
  onIgnore,
  onClaim,
}: {
  rec: LocalRec;
  onBookmark: () => void;
  onIgnore: () => void;
  onClaim: () => void;
}) {
  const score = Math.round(rec.score);
  const effectiveState = rec.pendingState ?? rec.state;
  const isBookmarked = effectiveState === "BOOKMARKED";
  const isClaimed = effectiveState === "CLAIMED";

  return (
    <motion.div
      key={rec.id}
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.15 }}
      className="h-full overflow-y-auto"
      aria-label={`Issue details: ${rec.issue.title}`}
    >
      {/* Sticky action bar */}
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm border-b border-border/50 px-5 py-3 flex items-center gap-2">
        <a
          href={rec.issue.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline underline-offset-4 mr-auto"
          aria-label={`Open issue on GitHub: ${rec.issue.title}`}
        >
          View on GitHub
          <ArrowUpRightIcon className="size-3" aria-hidden="true" />
        </a>

        <button
          type="button"
          onClick={onBookmark}
          title="Save this issue (B)"
          aria-pressed={isBookmarked}
          aria-label={isBookmarked ? "Remove from saved" : "Save this issue"}
          className={cn(
            "inline-flex items-center gap-1.5 text-xs font-medium h-7 px-3 rounded-md border transition-all",
            isBookmarked
              ? "bg-primary/10 border-primary/30 text-primary"
              : "border-border text-muted-foreground hover:text-foreground hover:border-border/80"
          )}
        >
          <BookmarkIcon className={cn("size-3.5", isBookmarked && "fill-primary")} aria-hidden="true" />
          {isBookmarked ? "Saved" : "Save"}
        </button>

        <button
          type="button"
          onClick={onClaim}
          title="Claim this issue (C)"
          aria-pressed={isClaimed}
          aria-label={isClaimed ? "Unmark as claimed" : "Mark as claimed"}
          className={cn(
            "inline-flex items-center gap-1.5 text-xs font-medium h-7 px-3 rounded-md border transition-all",
            isClaimed
              ? "bg-emerald-400/10 border-emerald-400/30 text-emerald-400"
              : "border-border text-muted-foreground hover:text-foreground hover:border-border/80"
          )}
        >
          <CheckCircle2Icon className="size-3.5" aria-hidden="true" />
          {isClaimed ? "Claimed" : "Claim"}
        </button>

        <button
          type="button"
          onClick={onIgnore}
          title="Ignore this issue (I)"
          aria-label="Ignore this issue"
          className="inline-flex items-center gap-1.5 text-xs font-medium h-7 px-3 rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-border/80 transition-all"
        >
          <EyeOffIcon className="size-3.5" aria-hidden="true" />
          Ignore
        </button>
      </div>

      {/* Content — consistent padding, sections separated by dividers */}
      <div className="px-5 pt-4 pb-8 space-y-0">

        {/* ── Issue header ─────────────────────────────── */}
        <div className="pb-4">
          {/* Repo eyebrow — deliberately subordinate to the h2 */}
          <div className="flex items-center gap-1.5 mb-3 text-[11px] font-mono text-muted-foreground/60 leading-none">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-3 shrink-0" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            {rec.issue.repo.fullName}
          </div>

          {/* Issue title — primary heading, largest text in the panel */}
          <h2 className="text-xl font-bold text-foreground leading-snug tracking-tight">
            {rec.issue.title}
          </h2>

          {/* Meta chips row */}
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {rec.issue.aiDifficulty && (
              <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full border", difficultyColor(rec.issue.aiDifficulty))}>
                {difficultyLabel(rec.issue.aiDifficulty)}
              </span>
            )}
            <span className={cn("text-sm font-bold font-mono", scoreColor(score))}>
              {formatScore(score)} match
            </span>
            {rec.issue.aiEstimatedTime && (
              <span className="text-xs text-muted-foreground/70 flex items-center gap-1 ml-auto">
                <ClockIcon className="size-3" aria-hidden="true" />
                {rec.issue.aiEstimatedTime}
              </span>
            )}
          </div>
        </div>

        {/* ── AI Summary ───────────────────────────────── */}
        {rec.issue.aiSummary && (
          <>
            <div className="h-px bg-border/40" aria-hidden="true" />
            <div className="py-4">
              <div className="flex items-center gap-2 mb-2">
                <SparklesIcon className="size-3.5 text-primary" aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  AI Summary
                </span>
              </div>
              <p className="text-sm leading-relaxed text-foreground/80">
                {rec.issue.aiSummary}
              </p>
            </div>
          </>
        )}

        {/* ── Score breakdown ───────────────────────────── */}
        <div className="h-px bg-border/40" aria-hidden="true" />
        <div className="py-4">
          <ScoreBreakdown rec={rec} />
        </div>

        {/* ── Skills required ───────────────────────────── */}
        {rec.issue.aiSkillsRequired.length > 0 && (
          <>
            <div className="h-px bg-border/40" aria-hidden="true" />
            <div className="py-4 space-y-2.5">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Skills Required
              </p>
              <div className="flex flex-wrap gap-2" role="list" aria-label="Required skills">
                {rec.issue.aiSkillsRequired.map((skill) => (
                  <span
                    key={skill}
                    role="listitem"
                    className="text-xs font-medium px-2.5 py-1 rounded-full border border-border/60 bg-muted/30 text-foreground/80"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Relevant files ────────────────────────────── */}
        {rec.issue.aiRelevantFiles && rec.issue.aiRelevantFiles.length > 0 && (
          <>
            <div className="h-px bg-border/40" aria-hidden="true" />
            <div className="py-4">
              <FileTree files={rec.issue.aiRelevantFiles} />
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

// ─── Loading skeleton ──────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="flex h-[calc(100vh-10rem)] rounded-xl border border-border overflow-hidden" aria-label="Loading recommendations" aria-busy="true">
      <div className="w-[40%] border-r border-border space-y-0 bg-card">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="pl-4 pr-4 py-4 border-b border-border/40 space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-2 pt-1">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex-1 p-5 space-y-5 bg-card">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 font-mono" />
        </div>
        <Skeleton className="h-28 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function RecommendationsView() {
  const [difficulty, setDifficulty] = React.useState<Difficulty | undefined>();
  const [items, setItems] = React.useState<LocalRec[]>([]);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [hasRepos, setHasRepos] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);

  const activeIndexRef = React.useRef(activeIndex);
  React.useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const inFlightRef = React.useRef(false);

  const load = React.useCallback(async (opts?: { isSilent?: boolean; signal?: AbortSignal }) => {
    if (inFlightRef.current && opts?.isSilent) return; // Deduplicate background updates
    inFlightRef.current = true;

    console.log("[Frontend] frontend refresh triggered");

    if (!opts?.isSilent) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }
    setError(null);
    try {
      const [recsResponse, reposResponse] = await Promise.all([
        api.getRecommendations({ difficulty, state: "INBOX" }, { signal: opts?.signal }),
        api.getRepos({ signal: opts?.signal }),
      ]);
      
      const newItems = recsResponse.recommendations as LocalRec[];
      console.log(`[Frontend] recommendations received: ${newItems.length}`);
      setHasRepos(reposResponse.length > 0);
      setIsSyncing(reposResponse.some((r) => !r.lastPolledAt));
      
      setItems((prevItems) => {
        // Map pending state from prevItems if user triaged an item recently
        const prevPendingMap = new Map(
          prevItems
            .filter((r) => r.pendingState !== undefined)
            .map((r) => [r.id, r.pendingState])
        );

        const mergedItems = newItems.map((item) => {
          const pendingState = prevPendingMap.get(item.id);
          return pendingState !== undefined ? { ...item, pendingState } : item;
        });

        const currentSelectedId = prevItems[activeIndexRef.current]?.id;
        if (currentSelectedId) {
          const newIdx = mergedItems.findIndex((r) => r.id === currentSelectedId);
          if (newIdx >= 0) {
            setActiveIndex(newIdx);
          } else {
            setActiveIndex((i) => Math.max(0, Math.min(i, mergedItems.length - 1)));
          }
        }

        console.log(`[Frontend] recommendation count after each update: ${mergedItems.length}`);
        return mergedItems;
      });
    } catch (caught) {
      if (caught instanceof Error && caught.name === "AbortError") {
        return;
      }
      setError(caught instanceof Error ? caught.message : "Could not load recommendations.");
    } finally {
      inFlightRef.current = false;
      if (!opts?.signal || !opts.signal.aborted) {
        setLoading(false);
        setIsRefreshing(false);
      }
    }
  }, [difficulty]);

  React.useEffect(() => {
    const controller = new AbortController();
    void load({ signal: controller.signal });
    return () => controller.abort();
  }, [difficulty]); // load when difficulty changes

  const [recStatus, setRecStatus] = React.useState(recommendationState.getStatus());

  React.useEffect(() => {
    return recommendationState.subscribeStatus((s) => setRecStatus(s));
  }, []);

  // Subscribe to recommendation invalidations
  React.useEffect(() => {
    return recommendationState.subscribeInvalidation(() => {
      void load({ isSilent: true });
    });
  }, [load]);

  // Persist triage state to DB with optimistic update
  async function triage(id: string, targetState: TriageState) {
    const current = items.find((r) => r.id === id);
    const newState: TriageState = (current?.state === targetState || current?.pendingState === targetState) ? "INBOX" : targetState;

    setItems((prev) =>
      prev.map((r) => (r.id === id ? { ...r, pendingState: newState } : r))
    );

    try {
      await api.updateRecommendationState(id, newState);
      setItems((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, state: newState, pendingState: undefined } : r
        )
      );
      if (newState === "IGNORED") {
        setTimeout(() => {
          setItems((prev) => {
            const filtered = prev.filter((r) => r.id !== id);
            setActiveIndex((i) => Math.max(0, Math.min(i, filtered.length - 1)));
            return filtered;
          });
        }, 300);
      }
    } catch {
      setItems((prev) =>
        prev.map((r) => (r.id === id ? { ...r, pendingState: undefined } : r))
      );
    }
  }

  // Keyboard navigation
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) return;

      const active = items[activeIndex];
      if (!active) return;

      if (e.key === "j") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, items.length - 1));
      } else if (e.key === "k") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "b") {
        e.preventDefault();
        void triage(active.id, active.state === "BOOKMARKED" ? "INBOX" : "BOOKMARKED");
      } else if (e.key === "i") {
        e.preventDefault();
        void triage(active.id, "IGNORED");
      } else if (e.key === "c") {
        e.preventDefault();
        void triage(active.id, active.state === "CLAIMED" ? "INBOX" : "CLAIMED");
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [items, activeIndex]);

  const activeRec = items[activeIndex] ?? null;

  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div
        role="alert"
        className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-5 text-destructive"
      >
        <AlertCircleIcon className="size-4 shrink-0" aria-hidden="true" />
        <p className="text-sm flex-1">{error}</p>
        <button
          onClick={() => void load()}
          className="text-xs font-medium underline underline-offset-4 hover:no-underline shrink-0"
        >
          Retry
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    if (hasRepos) {
      if (isSyncing) {
        return (
          <EmptyState
            icon={<Loader2Icon className="size-10 animate-spin text-primary" />}
            title="Syncing repositories..."
            description="Argus is currently fetching open issues and analyzing them with AI. This will take a moment."
          />
        );
      } else {
        return (
          <EmptyState
            icon={<SparklesIcon className="size-10" />}
            title="No matching recommendations"
            description="We finished syncing your repositories, but none of the open issues match your skills or preferred languages. Try adjusting your preferences in Settings."
            action={{ label: "Go to Settings", href: "/settings" }}
          />
        );
      }
    }

    return (
      <EmptyState
        icon={<SparklesIcon className="size-10" />}
        title="No recommendations yet"
        description="Add a repository and Argus will analyse its open issues and surface the best matches for your profile."
        action={{ label: "Track a repository", href: "/repos" }}
      />
    );
  }

  return (
    <div className="space-y-3">
      {(recStatus === "saving" || recStatus === "recalculating") && (
        <div className="flex items-center gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-foreground">
          <Loader2Icon className="size-4 animate-spin text-primary shrink-0" aria-hidden="true" />
          <div>
            <p className="font-medium text-xs text-foreground">Updating recommendation results...</p>
            <p className="text-xs text-muted-foreground mt-0.5">Searching and filtering remain available during the update.</p>
          </div>
        </div>
      )}

      {/* Filter row + keyboard hint */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <FilterPills
          aria-label="Filter by difficulty"
          options={DIFFICULTY_OPTIONS}
          activeValue={difficulty}
          onChange={(v) => setDifficulty(v as Difficulty | undefined)}
        />
        <p className="hidden md:flex items-center gap-1 text-[11px] text-muted-foreground/60 font-mono" aria-label="Keyboard shortcuts">
          <kbd className="border border-border/60 rounded px-1 py-0.5 font-sans text-[11px] bg-muted/30">J</kbd>
          <span>/</span>
          <kbd className="border border-border/60 rounded px-1 py-0.5 font-sans text-[11px] bg-muted/30">K</kbd>
          <span className="mx-1">navigate</span>
          <span aria-hidden="true">·</span>
          <kbd className="border border-border/60 rounded px-1 py-0.5 font-sans text-[11px] bg-muted/30 mx-1">B</kbd>
          <span>save</span>
          <span aria-hidden="true" className="mx-1">·</span>
          <kbd className="border border-border/60 rounded px-1 py-0.5 font-sans text-[11px] bg-muted/30">C</kbd>
          <span className="mx-1">claim</span>
          <span aria-hidden="true">·</span>
          <kbd className="border border-border/60 rounded px-1 py-0.5 font-sans text-[11px] bg-muted/30 mx-1">I</kbd>
          <span>ignore</span>
        </p>
      </div>

      {/* Split-pane workspace — height accounts for: 56px nav + 48px page header + 40px description + 32px filter row + 32px padding = ~14rem */}
      <div className="flex h-[calc(100vh-16rem)] min-h-[520px] rounded-xl border border-border overflow-hidden">
        {/* LEFT: Issue list (38%) */}
        <div
          className="w-full md:w-[38%] border-r border-border overflow-y-auto shrink-0 bg-background"
          data-testid="issue-list"
          role="list"
          aria-label={`${items.length} recommendations`}
        >
          {/* List header — count is primary, refresh is secondary */}
          <div className="sticky top-0 z-10 bg-background border-b border-border/40 px-4 py-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground/70 tabular-nums">
              {items.length} {items.length === 1 ? "issue" : "issues"}
              {difficulty && (
                <span className="font-normal text-muted-foreground ml-1">
                  · {difficultyLabel(difficulty as Difficulty)}
                </span>
              )}
            </span>
            <button
              type="button"
              onClick={() => void load({ isSilent: true })}
              disabled={isRefreshing}
              className="text-xs font-semibold text-foreground/80 hover:text-foreground transition-colors inline-flex items-center gap-1 cursor-pointer"
              aria-label="Refresh recommendations"
            >
              {isRefreshing && <Loader2Icon className="size-3 animate-spin text-primary" aria-hidden="true" />}
              {isRefreshing ? "Updating…" : "Refresh"}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {items.map((rec, idx) => (
              <motion.div
                key={rec.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
              >
                <IssueListItem
                  rec={rec}
                  isActive={idx === activeIndex}
                  onClick={() => setActiveIndex(idx)}
                  index={idx}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* RIGHT: Detail panel (62%) */}
        <div className="hidden md:flex flex-1 flex-col overflow-hidden bg-background">
          <AnimatePresence mode="wait">
            {activeRec ? (
              <IssueDetail
                key={activeRec.id}
                rec={activeRec}
                onBookmark={() => void triage(activeRec.id, activeRec.state === "BOOKMARKED" ? "INBOX" : "BOOKMARKED")}
                onIgnore={() => void triage(activeRec.id, "IGNORED")}
                onClaim={() => void triage(activeRec.id, activeRec.state === "CLAIMED" ? "INBOX" : "CLAIMED")}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-muted-foreground">Select an issue to see details</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}