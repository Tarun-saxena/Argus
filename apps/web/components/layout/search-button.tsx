"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"

interface SearchButtonProps {
  onClick?: () => void
}

export function SearchButton({ onClick }: SearchButtonProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        onClick?.()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClick])

  return (
    <button
      onClick={onClick}
      className="flex h-9 w-full max-w-[240px] items-center gap-2 rounded-md border border-border bg-muted/20 px-3 text-xs text-muted-foreground transition-all hover:bg-muted/40 hover:text-foreground md:w-[180px] lg:w-[240px] cursor-pointer focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
      aria-label="Search dashboard"
    >
      <SearchIcon className="size-3.5 shrink-0 text-muted-foreground/75" />
      <span className="flex-1 text-left text-muted-foreground/70">Search issues...</span>
      <kbd className="pointer-events-none select-none rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium leading-none text-muted-foreground/60 hidden sm:inline-block">
        ⌘K
      </kbd>
    </button>
  )
}
