"use client";

import * as React from "react";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectablePillProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

/**
 * Toggle pill for multi-select chip groups (skills, languages, interests).
 * Consolidates the SkillChip (onboarding) and Pill (settings) components.
 */
export function SelectablePill({
  label,
  selected,
  onClick,
  className,
}: SelectablePillProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium border transition-all duration-100 cursor-pointer select-none",
        selected
          ? "bg-primary/10 border-primary/40 text-primary"
          : "bg-card border-border text-muted-foreground hover:border-border/80 hover:text-foreground hover:bg-muted/40",
        className
      )}
    >
      {selected && <CheckIcon className="size-3 shrink-0" aria-hidden="true" />}
      {label}
    </button>
  );
}
