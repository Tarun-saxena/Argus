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

export function TopNav() {
  const pathname = usePathname()
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

        {/* Right section: Theme Toggle + User Menu (Visible everywhere) + Hamburger (Mobile) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <UserMenu />

          {/* Mobile Hamburger menu */}
          <div className="block md:hidden ml-1">
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
                        <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center shrink-0">
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="white" strokeWidth="1.2" fill="none" />
                            <circle cx="8" cy="8" r="2" fill="white" />
                          </svg>
                        </div>
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

                  {/* Mobile Footer */}
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
    </header>
  )
}
