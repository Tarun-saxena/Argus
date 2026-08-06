import type { Difficulty, TriageState } from "./types";

/**
 * Returns Tailwind class string for a difficulty badge.
 */
export function difficultyColor(d: Difficulty | null): string {
  if (d === "BEGINNER") return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
  if (d === "INTERMEDIATE") return "text-amber-400 bg-amber-400/10 border-amber-400/20";
  if (d === "ADVANCED") return "text-red-400 bg-red-400/10 border-red-400/20";
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
  if (s >= 90) return "text-violet-400";
  if (s >= 70) return "text-blue-400";
  if (s >= 50) return "text-amber-400";
  return "text-muted-foreground";
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
