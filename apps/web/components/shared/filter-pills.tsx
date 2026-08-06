"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FilterOption<T> {
  value: T;
  label: string;
  count?: number;
}

interface FilterPillsProps<T> {
  options: FilterOption<T>[];
  activeValue: T;
  onChange: (value: T) => void;
  className?: string;
  "aria-label"?: string;
}

/**
 * Horizontal row of filter pills. Replaces ad-hoc button groups throughout the app.
 * Uses role="group" with a label for accessibility.
 */
export function FilterPills<T>({
  options,
  activeValue,
  onChange,
  className,
  "aria-label": ariaLabel = "Filter options",
}: FilterPillsProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn("flex flex-wrap gap-1.5", className)}
    >
      {options.map((opt, i) => {
        const isActive = opt.value === activeValue;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={isActive}
            className={cn(
              "inline-flex items-center gap-1.5 h-7 px-3 rounded-md text-xs font-medium border transition-all duration-100",
              isActive
                ? "bg-primary/10 border-primary/30 text-primary"
                : "border-border text-muted-foreground hover:text-foreground hover:border-border/80 hover:bg-muted/40"
            )}
          >
            {opt.label}
            {opt.count !== undefined && (
              <span
                className={cn(
                  "text-xs font-mono tabular-nums",
                  isActive ? "text-primary/70" : "text-muted-foreground/60"
                )}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
