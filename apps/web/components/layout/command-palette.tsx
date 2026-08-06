"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from "@/components/ui/command"
import {
  SparklesIcon,
  CompassIcon,
  GitForkIcon,
  BookmarkIcon,
  SettingsIcon,
  SunIcon,
  MoonIcon,
  LogOutIcon,
  PlusIcon,
} from "lucide-react"
import { api } from "@/lib/api"

interface CommandPaletteProps {
  open: boolean
  setOpen: (open: boolean) => void
}

export function CommandPalette({ open, setOpen }: CommandPaletteProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, setOpen])

  const runCommand = React.useCallback(
    (command: () => void) => {
      setOpen(false)
      command()
    },
    [setOpen]
  )

  const itemClass =
    "flex items-center gap-2.5 rounded-md px-2 py-2 text-sm cursor-pointer data-selected:bg-accent data-selected:text-accent-foreground transition-colors"

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages or run a command…" />
      <CommandList className="border-t border-border/40 p-1.5">
        <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
          No results found.
        </CommandEmpty>

        <CommandGroup heading="Navigation">
          <CommandItem
            aria-label="Go to Feed"
            onSelect={() => runCommand(() => router.push("/dashboard"))}
            className={itemClass}
          >
            <SparklesIcon className="size-4 text-muted-foreground shrink-0" aria-hidden="true" />
            <span>Feed</span>
            <CommandShortcut>⌘1</CommandShortcut>
          </CommandItem>
          <CommandItem
            aria-label="Go to Explore"
            onSelect={() => runCommand(() => router.push("/explore"))}
            className={itemClass}
          >
            <CompassIcon className="size-4 text-muted-foreground shrink-0" aria-hidden="true" />
            <span>Explore</span>
            <CommandShortcut>⌘2</CommandShortcut>
          </CommandItem>
          <CommandItem
            aria-label="Go to Repositories"
            onSelect={() => runCommand(() => router.push("/repos"))}
            className={itemClass}
          >
            <GitForkIcon className="size-4 text-muted-foreground shrink-0" aria-hidden="true" />
            <span>Repositories</span>
            <CommandShortcut>⌘3</CommandShortcut>
          </CommandItem>
          <CommandItem
            aria-label="Go to Bookmarks"
            onSelect={() => runCommand(() => router.push("/bookmarks"))}
            className={itemClass}
          >
            <BookmarkIcon className="size-4 text-muted-foreground shrink-0" aria-hidden="true" />
            <span>Bookmarks</span>
            <CommandShortcut>⌘4</CommandShortcut>
          </CommandItem>
          <CommandItem
            aria-label="Go to Settings"
            onSelect={() => runCommand(() => router.push("/settings"))}
            className={itemClass}
          >
            <SettingsIcon className="size-4 text-muted-foreground shrink-0" aria-hidden="true" />
            <span>Settings</span>
            <CommandShortcut>⌘,</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator className="my-1.5" />

        <CommandGroup heading="Actions">
          <CommandItem
            aria-label="Track a new repository"
            onSelect={() => runCommand(() => router.push("/repos?add=true"))}
            className={itemClass}
          >
            <PlusIcon className="size-4 text-muted-foreground shrink-0" aria-hidden="true" />
            <span>Track repository…</span>
          </CommandItem>
          <CommandItem
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            onSelect={() =>
              runCommand(() => setTheme(theme === "dark" ? "light" : "dark"))
            }
            className={itemClass}
          >
            {theme === "dark" ? (
              <>
                <SunIcon className="size-4 text-muted-foreground shrink-0" aria-hidden="true" />
                <span>Switch to light mode</span>
              </>
            ) : (
              <>
                <MoonIcon className="size-4 text-muted-foreground shrink-0" aria-hidden="true" />
                <span>Switch to dark mode</span>
              </>
            )}
            <CommandShortcut>⌘D</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator className="my-1.5" />

        <CommandGroup>
          <CommandItem
            aria-label="Sign out"
            onSelect={() =>
              runCommand(async () => {
                try {
                  await api.logout()
                  window.location.href = "/"
                } catch (err) {
                  console.error("Logout failed:", err)
                }
              })
            }
            className={`${itemClass} data-selected:bg-destructive/10 data-selected:text-destructive`}
          >
            <LogOutIcon className="size-4 shrink-0" aria-hidden="true" />
            <span>Sign out</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
