"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Clock,
  ExternalLink,
  Bookmark,
  Check,
  GitFork,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MockIssue {
  id: string
  title: string
  repo: string
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
  summary: string
  skills: string[]
  time: string
  match: number
  files: string[]
  body: string
}

const mockIssues: MockIssue[] = [
  {
    id: "1",
    title: "Fix hydration mismatch in next/image component",
    repo: "vercel/next.js",
    difficulty: "BEGINNER",
    summary:
      "The next/image component renders width and height as inline styles on the server but recalculates them on the client, causing a hydration mismatch warning in React 19.",
    skills: ["TypeScript", "React", "Next.js", "CSS"],
    time: "~3 hours",
    match: 94,
    files: [
      "packages/next/src/client/image.tsx",
      "packages/next/src/server/image.tsx",
      "test/integration/image/test/index.test.js",
    ],
    body: "### Description\nWhen using next/image with a fill prop and a custom loader, React 19 surfaces a hydration warning on mount. This happens because the width/height are populated dynamically during render on client.",
  },
  {
    id: "2",
    title: "Add glob filtering support to turbo prune",
    repo: "vercel/turborepo",
    difficulty: "INTERMEDIATE",
    summary:
      "turbo prune currently lacks support for filtering subset workspaces by wildcard glob patterns. This analysis suggests introducing a --filter option to standard CLI parsing.",
    skills: ["Go", "CLI", "Shell"],
    time: "~5 hours",
    match: 87,
    files: [
      "cli/prune/prune.go",
      "cli/prune/prune_test.go",
      "packages/turbo-workspaces/filter.go",
    ],
    body: "### Proposal\nAllow developers to use glob syntax (e.g., packages/*) when running turbo prune to restrict pruning target workspaces without naming them all individually.",
  },
]

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  )
}

export function ProductPreview() {
  const [activeIssue, setActiveIssue] = React.useState<MockIssue>(mockIssues[0]!)
  const [bookmarked, setBookmarked] = React.useState<Record<string, boolean>>({})

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setBookmarked((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const getDifficultyColor = (diff: MockIssue["difficulty"]) => {
    switch (diff) {
      case "BEGINNER":
        return "bg-green-dim text-green-base border-green-base/20"
      case "INTERMEDIATE":
        return "bg-amber-dim text-amber-base border-amber-base/20"
      case "ADVANCED":
        return "bg-red-dim text-red-base border-red-base/20"
    }
  }

  const getDifficultyDot = (diff: MockIssue["difficulty"]) => {
    switch (diff) {
      case "BEGINNER":
        return "bg-green-base"
      case "INTERMEDIATE":
        return "bg-amber-base"
      case "ADVANCED":
        return "bg-red-base"
    }
  }

  return (
    <section id="preview" className="py-16 md:py-24 border-t border-border/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl text-left mb-12">
          <h2 className="text-2xs font-semibold uppercase tracking-wider text-accent-bright">
            Interactive Demo
          </h2>
          <p className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Explore the dashboard.
          </p>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Argus parses issues to deliver key details instantly. Click through the mock list to see the AI Analysis card update live.
          </p>
        </div>

        {/* Live Sandbox Container */}
        <div className="relative rounded-xl border border-border bg-[#09090b] shadow-2xl overflow-hidden min-h-[580px] flex flex-col md:flex-row">
          {/* Header Bar */}
          <div className="absolute top-0 left-0 w-full h-11 border-b border-border/60 bg-[#0c0c0e] flex items-center justify-between px-4 z-10">
            <div className="flex items-center gap-1.5 select-none">
              <span className="size-2.5 rounded-full bg-red-base/40" />
              <span className="size-2.5 rounded-full bg-amber-base/40" />
              <span className="size-2.5 rounded-full bg-green-base/40" />
              <span className="text-[11px] text-muted-foreground/60 font-mono ml-3">
                argus.dev/dashboard
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground/50 font-mono hidden sm:inline-block">
                Press ⌘K to search
              </span>
            </div>
          </div>

          {/* Left Panel: Issue Feed */}
          <div className="w-full md:w-[380px] md:border-r border-border/60 pt-11 flex flex-col bg-[#0c0c0e]/30">
            <div className="p-3 border-b border-border/40 bg-[#0c0c0e]/10">
              <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/50 px-1.5 mb-2">
                Recommendations
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2.5 space-y-2 max-h-[500px] md:max-h-[600px] no-scrollbar">
              {mockIssues.map((issue) => {
                const isActive = activeIssue.id === issue.id
                return (
                  <div
                    key={issue.id}
                    onClick={() => setActiveIssue(issue)}
                    className={cn(
                      "group p-3.5 rounded-lg border text-left cursor-pointer transition-all duration-150 relative",
                      isActive
                        ? "bg-[#18181b]/90 border-border-strong shadow-sm"
                        : "bg-[#111113]/30 border-border/30 hover:border-border/80 hover:bg-[#18181b]/40"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={cn(
                          "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] border text-[9px] font-bold tracking-wide uppercase",
                          getDifficultyColor(issue.difficulty)
                        )}
                      >
                        <span
                          className={cn("size-1 rounded-full", getDifficultyDot(issue.difficulty))}
                        />
                        {issue.difficulty}
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1 select-none">
                        <GitFork className="size-3 text-muted-foreground/50" />
                        {issue.repo}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-foreground leading-snug mb-1 group-hover:text-accent-bright transition-colors">
                      {issue.title}
                    </h4>
                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                      {issue.summary}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-border/30">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-1">
                          <Clock className="size-2.5" />
                          {issue.time}
                        </span>
                        <span className="text-[10px] font-mono font-semibold text-accent-bright bg-accent-dim/35 px-1.5 py-0.5 rounded-[4px] border border-accent/10">
                          {issue.match}% Match
                        </span>
                      </div>
                      <button
                        onClick={(e) => toggleBookmark(issue.id, e)}
                        className="text-muted-foreground hover:text-foreground p-1 transition-colors rounded-sm"
                        aria-label="Bookmark issue"
                      >
                        <Bookmark
                          className={cn(
                            "size-3.5 transition-transform active:scale-95",
                            bookmarked[issue.id]
                              ? "fill-accent-bright text-accent-bright"
                              : "text-muted-foreground"
                          )}
                        />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Panel: Detail View */}
          <div className="flex-1 pt-11 bg-background flex flex-col min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIssue.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] as const }}
                className="p-5 sm:p-6 md:p-8 flex-1 overflow-y-auto space-y-6 max-h-[600px] no-scrollbar"
              >
                {/* Header */}
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono mb-2">
                    <span className="hover:text-foreground transition-colors cursor-pointer select-none">
                      Feed
                    </span>
                    <span>/</span>
                    <span className="text-foreground">{activeIssue.repo}</span>
                  </div>
                  <h3 className="text-md sm:text-lg font-bold text-foreground leading-snug">
                    {activeIssue.title}
                  </h3>
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {activeIssue.repo} • #48291
                    </span>
                    <span className="size-1 rounded-full bg-border" />
                    <span className="text-[11px] text-muted-foreground font-mono">
                      Opened 3 days ago
                    </span>
                  </div>
                </div>

                {/* AI Analysis Card */}
                <div className="rounded-lg border border-border bg-[#09090b] shadow-sm relative overflow-hidden pl-3 py-4 pr-4">
                  <div className="absolute left-0 top-0 h-full w-[3px] bg-accent-bright" />
                  <div className="flex items-center gap-1.5 text-2xs font-semibold text-accent-bright uppercase tracking-wider mb-3">
                    <Sparkles className="size-3" />
                    <span>Argus AI Analysis</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 mb-1">
                        Summary
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {activeIssue.summary}
                      </p>
                    </div>

                    <div className="h-px bg-border/40" />

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 mb-1.5">
                          Complexity
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] border text-[9px] font-bold tracking-wide uppercase",
                              getDifficultyColor(activeIssue.difficulty)
                            )}
                          >
                            <span
                              className={cn(
                                "size-1 rounded-full",
                                getDifficultyDot(activeIssue.difficulty)
                              )}
                            />
                            {activeIssue.difficulty}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 mb-1.5">
                          Est. Time
                        </div>
                        <span className="text-xs font-mono text-foreground flex items-center gap-1.5">
                          <Clock className="size-3.5 text-muted-foreground" />
                          {activeIssue.time}
                        </span>
                      </div>
                    </div>

                    <div className="h-px bg-border/40" />

                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 mb-2">
                        Skills Required
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {activeIssue.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded-[4px] border border-border/80 bg-muted/20 text-[10px] font-mono text-foreground"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="h-px bg-border/40" />

                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 mb-2">
                        Relevant Files
                      </div>
                      <div className="space-y-1">
                        {activeIssue.files.map((file) => (
                          <div
                            key={file}
                            className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                          >
                            <span>📄</span>
                            <span className="truncate">{file}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mock Actions */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      window.location.href = "http://localhost:4000/auth/github"
                    }}
                    className="flex-1 sm:flex-initial h-9 px-4 rounded-md bg-accent-bright hover:bg-accent-hover text-[#09090b] font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <GitHubIcon className="size-3.5" />
                    <span>View on GitHub</span>
                    <ExternalLink className="size-3" />
                  </button>
                  <button
                    onClick={(e) => toggleBookmark(activeIssue.id, e)}
                    className="h-9 px-3 rounded-md border border-border bg-[#09090b] hover:bg-muted/30 text-foreground font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    {bookmarked[activeIssue.id] ? (
                      <>
                        <Check className="size-3.5 text-green-base" />
                        <span>Bookmarked</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="size-3.5 text-muted-foreground" />
                        <span>Bookmark</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
