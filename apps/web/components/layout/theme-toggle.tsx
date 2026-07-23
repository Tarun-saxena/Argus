"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { SunIcon, MoonIcon } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon-sm"
        className="size-8 rounded-full border border-transparent"
        aria-label="Toggle theme"
      >
        <SunIcon className="size-4 opacity-50" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className="size-8 rounded-full hover:bg-accent/50 dark:hover:bg-muted/50 transition-colors"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <SunIcon className="size-4" />
      ) : (
        <MoonIcon className="size-4" />
      )}
    </Button>
  )
}
