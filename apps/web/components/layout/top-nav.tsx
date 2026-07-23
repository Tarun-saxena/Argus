"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  MenuIcon,
  XIcon,
  SparklesIcon,
  CompassIcon,
  GitForkIcon,
  BookmarkIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { UserMenu } from "@/components/layout/user-menu"
import { SearchButton } from "@/components/layout/search-button"
import { CommandPalette } from "@/components/layout/command-palette"

export function TopNav() {
  const pathname = usePathname()
  const [commandPaletteOpen, setCommandPaletteOpen] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const navLinks = [
    { href: "/dashboard", label: "Feed", icon: SparklesIcon },
    { href: "/explore", label: "Explore", icon: CompassIcon },
    { href: "/repos", label: "Repositories", icon: GitForkIcon },
    { href: "/bookmarks", label: "Bookmarks", icon: BookmarkIcon },
  ]

  const isActive = (href: string) => {
    if (href === "/dashboard" && pathname === "/dashboard") return true
    if (href !== "/dashboard" && pathname?.startsWith(href)) return true
    return false
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left section: Logo + Nav links */}
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2 font-sans select-none">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4.5 text-accent-bright fill-accent-bright/10"
            >
              <path d="M12 2L2 12l10 10 10-10L12 2z" />
            </svg>
            <span className="text-sm font-bold tracking-tight text-foreground">Argus</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative flex h-14 items-center px-1 text-sm font-medium transition-colors hover:text-foreground",
                  isActive(link.href) ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-0 h-[2px] w-full bg-accent-bright rounded-full" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right section: Search + Theme Toggle + User Menu (Desktop) / Hamburger (Mobile) */}
        <div className="flex items-center gap-3">
          {/* Desktop Search */}
          <div className="hidden md:block">
            <SearchButton onClick={() => setCommandPaletteOpen(true)} />
          </div>

          {/* Theme Toggle & User Menu */}
          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <div className="hidden md:block">
              <UserMenu />
            </div>
          </div>

          {/* Mobile Hamburger menu */}
          <div className="block md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon-sm" className="size-8" aria-label="Toggle menu" />
                }
              >
                <MenuIcon className="size-4.5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-6 bg-background border-r border-border">
                <div className="flex flex-col gap-6 h-full justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 select-none"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="size-4.5 text-accent-bright fill-accent-bright/10"
                        >
                          <path d="M12 2L2 12l10 10 10-10L12 2z" />
                        </svg>
                        <span className="text-sm font-bold tracking-tight text-foreground">Argus</span>
                      </Link>
                      <SheetClose
                        render={
                          <Button variant="ghost" size="icon-xs" className="size-6" />
                        }
                      >
                        <XIcon className="size-3.5" />
                      </SheetClose>
                    </div>

                    {/* Mobile Search Button */}
                    <div className="mb-6">
                      <SearchButton
                        onClick={() => {
                          setMobileMenuOpen(false)
                          setCommandPaletteOpen(true)
                        }}
                      />
                    </div>

                    {/* Mobile Links */}
                    <nav className="flex flex-col gap-1.5">
                      {navLinks.map((link) => {
                        const Icon = link.icon
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                              "flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                              isActive(link.href)
                                ? "bg-accent/10 text-foreground"
                                : "text-muted-foreground hover:bg-accent/5 hover:text-foreground"
                            )}
                          >
                            <Icon className="size-4" />
                            <span>{link.label}</span>
                          </Link>
                        )
                      })}
                    </nav>
                  </div>

                  {/* Mobile Footer with User info */}
                  <div className="border-t border-border pt-4 flex items-center justify-between">
                    <UserMenu />
                    <span className="text-2xs text-muted-foreground font-mono">Argus v1.0</span>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette open={commandPaletteOpen} setOpen={setCommandPaletteOpen} />
    </header>
  )
}
