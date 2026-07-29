"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";

import { api } from "@/lib/api";
import type { Difficulty, Recommendation } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const difficulties: Array<{
  value: Difficulty | undefined;
  label: string;
}> = [
    { value: undefined, label: "All" },
    { value: "BEGINNER", label: "Beginner" },
    { value: "INTERMEDIATE", label: "Intermediate" },
    { value: "ADVANCED", label: "Advanced" },
  ];

export function RecommendationsView() {
  const [difficulty, setDifficulty] =
    React.useState<Difficulty>();

  const [items, setItems] = React.useState<Recommendation[]>([]);

  const [loading, setLoading] = React.useState(true);

  const [error, setError] =
    React.useState<string | null>(null);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response =
        await api.getRecommendations({
          difficulty,
        });

      setItems(response.recommendations);
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Could not load recommendations."
      );
    } finally {
      setLoading(false);
    }
  }, [difficulty]);

  React.useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-8">

      {/* Filters */}

      <div className="flex flex-wrap gap-2">
        {difficulties.map((option) => (
          <Button
            key={option.label}
            size="sm"
            variant={
              difficulty === option.value
                ? "default"
                : "outline"
            }
            onClick={() => setDifficulty(option.value)}
            className="rounded-full"
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* Loading */}

      {loading && (
        <div className="space-y-5">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-xl border p-5"
            >
              <Skeleton className="h-3 w-24" />

              <Skeleton className="mt-3 h-5 w-2/3" />

              <Skeleton className="mt-4 h-16 w-full" />

              <div className="mt-4 flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}

      {!loading && error && (
        <div className="rounded-xl border border-destructive/40 p-6">
          <p className="text-sm text-destructive">
            {error}
          </p>

          <Button
            variant="link"
            className="mt-2 px-0"
            onClick={() => void load()}
          >
            Try again
          </Button>
        </div>
      )}

      {/* Empty */}

      {!loading && !error && items.length === 0 && (
        <div className="rounded-xl border p-8 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-muted-foreground" />

          <h3 className="mt-4 font-semibold">
            No recommendations yet
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Add a repository and Argus will begin
            analyzing open issues.
          </p>

          <Link
            href="/repos"
            className="mt-5 inline-flex text-sm font-medium text-primary hover:underline"
          >
            Track a repository →
          </Link>
        </div>
      )}

      {!loading && !error && (
        <AnimatePresence mode="popLayout">

          <div className="space-y-5">
            {items.map(({ id, score, issue }) => (
              <motion.article
                key={id}
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.25 }}
                className="rounded-2xl border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-6">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-muted-foreground"
                      >
                        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                      </svg>

                      <span className="truncate">
                        {issue.repo.fullName}
                      </span>
                    </div>

                    <a
                      href={issue.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 block text-lg font-semibold leading-7 hover:text-primary"
                    >
                      {issue.title}
                    </a>
                  </div>

                  <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                    {Math.round(score)}%
                  </div>
                </div>

                {/* AI Summary */}
                {issue.aiSummary && (
                  <div className="mt-5 rounded-xl border bg-muted/30 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />

                      <span className="text-xs font-medium uppercase tracking-wide text-primary">
                        AI Summary
                      </span>
                    </div>

                    <p className="text-sm leading-7 text-muted-foreground">
                      {issue.aiSummary}
                    </p>
                  </div>
                )}

                {/* Tags */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {issue.aiDifficulty && (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${issue.aiDifficulty === "BEGINNER"
                        ? "bg-green-500/10 text-green-700 dark:text-green-400"
                        : issue.aiDifficulty === "INTERMEDIATE"
                          ? "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                          : "bg-red-500/10 text-red-700 dark:text-red-400"
                        }`}
                    >
                      {issue.aiDifficulty.charAt(0) +
                        issue.aiDifficulty.slice(1).toLowerCase()}
                    </span>
                  )}

                  {issue.aiEstimatedTime && (
                    <span className="rounded-full border px-3 py-1 text-xs">
                      {issue.aiEstimatedTime}
                    </span>
                  )}

                  {issue.aiSkillsRequired.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-primary/5 px-3 py-1 text-xs text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-6 flex items-center justify-end">
                  <a
                    href={issue.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    View Issue

                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </motion.article>
            ))}

            <div className="pt-2">
              <Link
                href="/repos"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                Manage tracked repositories

                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}