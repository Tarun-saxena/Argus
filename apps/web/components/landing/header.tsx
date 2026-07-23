"use client"

import * as React from "react"
import Link from "next/link"
import { MenuIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  )
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const navLinks = [
    { href: "#problem", label: "Problem" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#features", label: "Features" },
    { href: "#preview", label: "Product" },
  ]

  const handleLogin = () => {
    window.location.href = "http://localhost:4000/auth/github"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left section: Logo + Nav links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 select-none">
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
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Right section: GitHub, Login, CTA */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex size-8 items-center justify-center rounded-full hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub Repository"
          >
            <GitHubIcon className="size-4" />
          </a>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogin}
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Sign In
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleLogin}
            className="hidden sm:inline-flex text-xs bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90"
          >
            Get Started
          </Button>

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
                        href="/"
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

                    {/* Mobile Links */}
                    <nav className="flex flex-col gap-1.5">
                      {navLinks.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:bg-accent/5 hover:text-foreground transition-colors"
                        >
                          {link.label}
                        </a>
                      ))}
                    </nav>
                  </div>

                  {/* Mobile Footer with GitHub link & CTA */}
                  <div className="border-t border-border pt-4 flex flex-col gap-3">
                    <Button
                      variant="default"
                      className="w-full text-xs font-medium justify-center"
                      onClick={handleLogin}
                    >
                      Connect with GitHub
                    </Button>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:bg-accent/5 hover:text-foreground transition-colors justify-center"
                    >
                      <GitHubIcon className="size-4" />
                      <span>View on GitHub</span>
                    </a>
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
