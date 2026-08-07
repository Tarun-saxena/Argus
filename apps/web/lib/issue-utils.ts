import type { Difficulty, TriageState } from "./types";

export const SCORE_HIGH_THRESHOLD = 80;
export const SCORE_MEDIUM_THRESHOLD = 50;

/**
 * Returns Tailwind class string for a difficulty badge.
 */
export function difficultyColor(d: Difficulty | null): string {
  if (d === "BEGINNER") return "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  if (d === "INTERMEDIATE") return "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20";
  if (d === "ADVANCED") return "text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20";
  return "text-muted-foreground bg-muted border-border";
}

/**
 * Returns a human-readable difficulty label.
 */
export function difficultyLabel(d: Difficulty | null): string {
  if (!d) return "Unknown";
  return d.charAt(0) + d.slice(1).toLowerCase();
}

/**
 * Returns a Tailwind text color class based on a 0-100 match score.
 */
export function scoreColor(s: number): string {
  if (s >= SCORE_HIGH_THRESHOLD) return "text-emerald-600 dark:text-emerald-400 font-bold";
  if (s >= SCORE_MEDIUM_THRESHOLD) return "text-amber-600 dark:text-amber-400 font-semibold";
  return "text-muted-foreground font-normal";
}

/**
 * Formats a score number as a percentage string, e.g. "87%".
 */
export function formatScore(s: number): string {
  return `${Math.round(s)}%`;
}

/**
 * Returns a label string for a triage state.
 */
export function stateLabel(s: TriageState): string {
  const labels: Record<TriageState, string> = {
    INBOX: "Inbox",
    BOOKMARKED: "Saved",
    CLAIMED: "Claimed",
    IGNORED: "Ignored",
  };
  return labels[s];
}
