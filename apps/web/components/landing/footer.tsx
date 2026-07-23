"use client"

import * as React from "react"
import NextLink from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40 bg-[#09090b]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + Copyright */}
          <div className="flex items-center gap-3">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 text-accent-bright fill-accent-bright/10"
            >
              <path d="M12 2L2 12l10 10 10-10L12 2z" />
            </svg>
            <span className="text-xs text-muted-foreground font-mono">
              © {currentYear} Argus. All rights reserved.
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="#problem"
              className="text-2xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Problem
            </a>
            <a
              href="#how-it-works"
              className="text-2xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </a>
            <a
              href="#features"
              className="text-2xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-2xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
            <NextLink
              href="/privacy"
              className="text-2xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </NextLink>
            <NextLink
              href="/terms"
              className="text-2xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </NextLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
