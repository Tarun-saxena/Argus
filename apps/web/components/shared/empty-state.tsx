import * as React from "react";
import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
  className?: string;
}

/**
 * Consistent empty state: centered icon → title → description → optional CTA link.
 * Follows the design principle: "An empty screen is an invitation to act."
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-16 text-center gap-4",
        className
      )}
      role="status"
    >
      <div className="text-muted-foreground/30">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="font-medium text-foreground text-sm">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline underline-offset-4"
        >
          {action.label}
          <ChevronRightIcon className="size-3.5" />
        </Link>
      )}
    </div>
  );
}
