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

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList className="border-t border-border/40 p-2">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/dashboard"))}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer data-selected:bg-accent data-selected:text-accent-foreground"
          >
            <SparklesIcon className="size-4 text-muted-foreground" />
            <span>Feed</span>
            <CommandShortcut>⌘1</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/explore"))}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer data-selected:bg-accent data-selected:text-accent-foreground"
          >
            <CompassIcon className="size-4 text-muted-foreground" />
            <span>Explore</span>
            <CommandShortcut>⌘2</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/repos"))}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer data-selected:bg-accent data-selected:text-accent-foreground"
          >
            <GitForkIcon className="size-4 text-muted-foreground" />
            <span>Repositories</span>
            <CommandShortcut>⌘3</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/bookmarks"))}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer data-selected:bg-accent data-selected:text-accent-foreground"
          >
            <BookmarkIcon className="size-4 text-muted-foreground" />
            <span>Bookmarks</span>
            <CommandShortcut>⌘4</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/settings"))}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer data-selected:bg-accent data-selected:text-accent-foreground"
          >
            <SettingsIcon className="size-4 text-muted-foreground" />
            <span>Settings</span>
            <CommandShortcut>⌘,</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator className="my-2" />
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                // Event or callback to open add repo dialog can go here
                router.push("/repos?add=true")
              })
            }
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer data-selected:bg-accent data-selected:text-accent-foreground"
          >
            <PlusIcon className="size-4 text-muted-foreground" />
            <span>Track Repository...</span>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => setTheme(theme === "dark" ? "light" : "dark"))
            }
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer data-selected:bg-accent data-selected:text-accent-foreground"
          >
            {theme === "dark" ? (
              <>
                <SunIcon className="size-4 text-muted-foreground" />
                <span>Toggle Theme to Light</span>
              </>
            ) : (
              <>
                <MoonIcon className="size-4 text-muted-foreground" />
                <span>Toggle Theme to Dark</span>
              </>
            )}
            <CommandShortcut>⌘D</CommandShortcut>
          </CommandItem>
          <CommandItem
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
            className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer focus:bg-destructive/10 focus:text-destructive data-selected:bg-destructive/10 data-selected:text-destructive dark:data-selected:bg-destructive/20"
          >
            <LogOutIcon className="size-4" />
            <span>Sign Out</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
