"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookmarkIcon,
  CheckCircle2Icon,
  SparklesIcon,
  ArrowUpRightIcon,
  ClockIcon,
  AlertCircleIcon,
} from "lucide-react";
import { api } from "@/lib/api";
import { recommendationState } from "@/lib/recommendation-state";
import type { Difficulty, Recommendation, TriageState } from "@/lib/types";
import { difficultyColor, difficultyLabel, scoreColor, formatScore } from "@/lib/issue-utils";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

function IssueCard({
  rec,
  onRemove,
}: {
  rec: Recommendation;
  onRemove: () => void;
}) {
  const score = Math.round(rec.score);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.18 }}
      className="rounded-xl border border-border bg-card p-5 hover:border-border/80 transition-all"
      aria-label={`Issue: ${rec.issue.title}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5 text-xs text-muted-foreground">
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-3 shrink-0" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span className="font-mono truncate">{rec.issue.repo.fullName}</span>
          </div>
          <a
            href={rec.issue.url}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-2"
            aria-label={`Open issue: ${rec.issue.title}`}
          >
            {rec.issue.title}
          </a>
        </div>
        <span className={cn("text-sm font-bold font-mono shrink-0 tabular-nums", scoreColor(score))}>
          {formatScore(score)}
        </span>
      </div>

      {/* AI Summary */}
      {rec.issue.aiSummary && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
          {rec.issue.aiSummary}
        </p>
      )}

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {rec.issue.aiDifficulty && (
          <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full border", difficultyColor(rec.issue.aiDifficulty))}>
            {difficultyLabel(rec.issue.aiDifficulty)}
          </span>
        )}
        {rec.issue.aiEstimatedTime && (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <ClockIcon className="size-3" aria-hidden="true" />
            {rec.issue.aiEstimatedTime}
          </span>
        )}
        {rec.issue.aiSkillsRequired.slice(0, 3).map((s) => (
          <span key={s} className="text-xs px-2 py-0.5 rounded-full border border-border/60 text-foreground/70">
            {s}
          </span>
        ))}
        {rec.issue.aiSkillsRequired.length > 3 && (
          <span className="text-xs text-muted-foreground">
            +{rec.issue.aiSkillsRequired.length - 3} more
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-border/40">
        <button
          type="button"
          onClick={onRemove}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Move back to inbox"
        >
          Back to inbox
        </button>
        <a
          href={rec.issue.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline underline-offset-4"
          aria-label={`Open issue on GitHub: ${rec.issue.title}`}
        >
          Open on GitHub
          <ArrowUpRightIcon className="size-3" aria-hidden="true" />
        </a>
      </div>
    </motion.article>
  );
}

const TABS = [
  { key: "bookmarked" as const, label: "Saved", icon: BookmarkIcon },
  { key: "claimed" as const, label: "Claimed", icon: CheckCircle2Icon },
];

export default function BookmarksPage() {
  const [bookmarked, setBookmarked] = React.useState<Recommendation[]>([]);
  const [claimed, setClaimed] = React.useState<Recommendation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<"bookmarked" | "claimed">("bookmarked");

  const load = React.useCallback(async (opts?: { isSilent?: boolean }) => {
    if (!opts?.isSilent) setLoading(true);
    setError(null);
    try {
      const [bookRes, claimRes] = await Promise.all([
        api.getRecommendations({ state: "BOOKMARKED" }),
        api.getRecommendations({ state: "CLAIMED" }),
      ]);
      setBookmarked(bookRes.recommendations);
      setClaimed(claimRes.recommendations);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { void load(); }, [load]);

  React.useEffect(() => {
    return recommendationState.subscribeInvalidation(() => {
      void load({ isSilent: true });
    });
  }, [load]);

  async function remove(id: string, tab: "bookmarked" | "claimed") {
    if (tab === "bookmarked") {
      setBookmarked((prev) => prev.filter((r) => r.id !== id));
    } else {
      setClaimed((prev) => prev.filter((r) => r.id !== id));
    }
    try {
      await api.updateRecommendationState(id, "INBOX");
    } catch {
      void load();
    }
  }

  const shownItems = activeTab === "bookmarked" ? bookmarked : claimed;
  const counts = { bookmarked: bookmarked.length, claimed: claimed.length };

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Pipeline"
        title="Your saved issues"
        description="Issues you've bookmarked or claimed. Save with B and claim with C from the Feed."
      />

      {/* Error */}
      {error && (
        <div role="alert" className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-destructive text-sm">
          <AlertCircleIcon className="size-4 shrink-0" aria-hidden="true" />
          {error}
          <button onClick={() => void load()} className="ml-auto underline text-xs" aria-label="Retry loading">
            Retry
          </button>
        </div>
      )}

      {/* Tabs */}
      <div
        className="flex gap-0 border-b border-border"
        role="tablist"
        aria-label="Pipeline tabs"
      >
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              id={`tab-${tab.key}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all",
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-3.5" aria-hidden="true" />
              {tab.label}
              <span
                className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full font-mono tabular-nums",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
                aria-label={`${loading ? "loading" : counts[tab.key]} items`}
              >
                {loading ? "·" : counts[tab.key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab panels */}
      <div
        role="tabpanel"
        id={`panel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2" aria-busy="true" aria-label="Loading">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-3">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            ))}
          </div>
        ) : shownItems.length === 0 ? (
          <EmptyState
            icon={
              activeTab === "bookmarked"
                ? <BookmarkIcon className="size-10" />
                : <CheckCircle2Icon className="size-10" />
            }
            title={activeTab === "bookmarked" ? "No saved issues yet" : "No claimed issues yet"}
            description={
              activeTab === "bookmarked"
                ? "Press B on any issue in your Feed to save it here."
                : "Press C on any issue in your Feed to mark it as claimed."
            }
            action={{ label: "Go to Feed", href: "/dashboard" }}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <AnimatePresence>
              {shownItems.map((rec) => (
                <IssueCard
                  key={rec.id}
                  rec={rec}
                  onRemove={() => remove(rec.id, activeTab)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
