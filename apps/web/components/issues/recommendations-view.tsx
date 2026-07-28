"use client";

import * as React from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import type { Difficulty, Recommendation } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const difficulties: Array<{ value: Difficulty | undefined; label: string }> = [
  { value: undefined, label: "All" },
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
];

export function RecommendationsView() {
  const [difficulty, setDifficulty] = React.useState<Difficulty>();
  const [items, setItems] = React.useState<Recommendation[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getRecommendations({ difficulty });
      setItems(response.recommendations);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load recommendations.");
    } finally {
      setLoading(false);
    }
  }, [difficulty]);

  React.useEffect(() => { void load(); }, [load]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2" aria-label="Difficulty filters">
        {difficulties.map((option) => (
          <Button key={option.label} variant={difficulty === option.value ? "default" : "outline"} size="sm"
            onClick={() => setDifficulty(option.value)}>
            {option.label}
          </Button>
        ))}
      </div>
      {loading && <div className="space-y-3">{[1, 2, 3].map((item) => <Skeleton key={item} className="h-40 w-full" />)}</div>}
      {error && <div className="rounded-lg border border-destructive/40 p-4 text-sm text-destructive">
        {error} <Button variant="link" size="sm" onClick={() => void load()}>Try again</Button>
      </div>}
      {!loading && !error && items.length === 0 && <div className="rounded-lg border border-border p-6 text-sm text-muted-foreground">
        No recommendations yet. Add a repository and allow Argus a moment to analyze its open issues.
      </div>}
      {!loading && !error && items.map(({ id, score, issue }) => (
        <article key={id} className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs text-muted-foreground">{issue.repo.fullName}</p>
              <a className="mt-1 block font-medium hover:underline" href={issue.url} target="_blank" rel="noreferrer">{issue.title}</a>
            </div>
            <span className="font-mono text-sm font-semibold text-primary">{Math.round(score)}%</span>
          </div>
          {issue.aiSummary && <p className="mt-3 text-sm text-muted-foreground">{issue.aiSummary}</p>}
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
            {issue.aiDifficulty && <span className="rounded border border-border px-2 py-1">{issue.aiDifficulty.toLowerCase()}</span>}
            {issue.aiEstimatedTime && <span className="rounded border border-border px-2 py-1">{issue.aiEstimatedTime}</span>}
            {issue.aiSkillsRequired.map((skill) => <span key={skill} className="rounded bg-muted px-2 py-1">{skill}</span>)}
          </div>
        </article>
      ))}
      {!loading && !error && items.length > 0 && <Link href="/repos" className="text-sm text-primary hover:underline">Manage tracked repositories</Link>}
    </div>
  );
}
