"use client";

import { useState } from "react";
import { ArrowUpRightIcon, SparklesIcon, GlobeIcon, LockIcon } from "lucide-react";

// Premium mock data of GitHub issues matching user requests
const LIVE_ISSUES = [
  {
    title: "[feat]: Track updating the undici CLI dependency past the 7.x line (current...",
    repo: "shadcn-ui/ui",
    difficulty: "Beginner",
    diffClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    tracked: true,
    age: "3h ago",
    score: 64,
    tags: ["TypeScript", "npm", "package management"]
  },
  {
    title: "[bug](cli): findCommonRoot in get-config.ts causes EPERM scanning parent directories on Windows due to un-normalized slashes",
    repo: "shadcn-ui/ui",
    difficulty: "Beginner",
    diffClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    tracked: true,
    age: "5h ago",
    score: 64,
    tags: ["TypeScript", "Node.js path module", "Windows file system awareness"]
  },
  {
    title: "Inconsistent src/App.jsx example for react-user-management",
    repo: "supabase/supabase",
    difficulty: "Beginner",
    diffClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    tracked: true,
    age: "10h ago",
    score: 82,
    tags: ["Markdown", "React", "TypeScript"]
  },
  {
    title: "Update Flask Framework SUPABASE_KEY to SUPABASE_PUBLISHABLE_KEY",
    repo: "supabase/supabase",
    difficulty: "Beginner",
    diffClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    tracked: true,
    age: "12h ago",
    score: 45,
    tags: ["Technical Writing", "Documentation"]
  },
  {
    title: "[Compiler Bug]: React Compiler changes quoted computed property access to dot notation",
    repo: "react/react",
    difficulty: "Advanced",
    diffClass: "text-red-400 bg-red-500/10 border-red-500/20",
    tracked: false,
    age: "14h ago",
    score: 93,
    tags: ["Compiler", "React Core", "Babel"]
  },
  {
    title: "ERROR: 42883: function supabase_functions.http_request() does not exist",
    repo: "supabase/supabase",
    difficulty: "Intermediate",
    diffClass: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    tracked: true,
    age: "1d ago",
    score: 71,
    tags: ["PostgreSQL", "Database Administration", "Identity Management"]
  }
];

export function ProductPreview() {
  return (
    <section className="relative border-t border-border/60 bg-background py-28 overflow-hidden">
      {/* Inline styles for vertical loop marquee and tracked text shimmer */}
      <style>{`
        @keyframes scroll-vertical-table {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }
        .animate-scroll-table {
          animation: scroll-vertical-table 22s linear infinite;
        }
        @keyframes text-shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
        .animate-shimmer-text {
          background: linear-gradient(90deg, #818cf8, #c084fc, #818cf8);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: text-shimmer 3s linear infinite;
        }
      `}</style>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end pb-16 border-b border-border/40">
          <div className="lg:col-span-7">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-primary">
              03 / THE REALTIME WORKSPACE
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
              Live recommendations <br className="hidden sm:inline" />
              <span className="text-muted-foreground font-normal">streaming in real time.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pl-8">
            <p className="text-base text-muted-foreground leading-relaxed">
              Experience the live matching engine. As background queues analyze repositories, they calculate match compatibility metrics against developer profiles and stream recommendations instantly.
            </p>
          </div>
        </div>

        {/* Polished Browser Window Container - Dark Glassmorphism Theme */}
        <div className="mt-16 rounded-2xl border border-white/10 dark:border-white/5 bg-zinc-950/85 backdrop-blur-md shadow-2xl overflow-hidden relative group">
          {/* Subtle Outer Glow & Purple Accent */}
          <div className="absolute inset-0 -z-10 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />

          {/* Browser Window Header Bar */}
          <div className="border-b border-white/5 bg-zinc-900/90 px-6 py-4 flex items-center justify-between z-20 relative select-none">
            {/* Window control dots */}
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-red-500/80" />
              <span className="size-3 rounded-full bg-amber-500/80" />
              <span className="size-3 rounded-full bg-emerald-500/80" />
            </div>

            {/* Browser Address Bar */}
            <div className="hidden sm:flex items-center gap-2 px-6 py-1.5 rounded-lg bg-black/40 border border-white/5 text-xs font-mono text-zinc-400 w-96 justify-center">
              <LockIcon className="size-3 text-emerald-500/90" />
              <span>argus.dev/explore</span>
            </div>

            {/* Indicator status light */}
            <div className="flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full size-2 bg-indigo-500"></span>
              </span>
              <span className="text-2xs font-mono text-zinc-400 uppercase tracking-wider">Queue Active</span>
            </div>
          </div>

          {/* Table Headers */}
          <div className="relative z-20 grid grid-cols-12 gap-4 border-b border-white/5 bg-zinc-900/40 px-6 py-3.5 text-xs font-mono font-bold tracking-wider text-zinc-400 select-none">
            <div className="col-span-6">TITLE</div>
            <div className="col-span-2">REPOSITORY</div>
            <div className="col-span-2">DIFFICULTY</div>
            <div className="col-span-1">AGE</div>
            <div className="col-span-1 text-right">MATCH</div>
          </div>

          {/* Scrolling Content Viewport - Set to a smaller size (290px) */}
          <div className="relative h-[290px] overflow-hidden z-10">
            {/* Smooth Top & Bottom Fade Overlays */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-zinc-950 to-transparent pointer-events-none z-20" />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none z-20" />

            <div className="h-full overflow-hidden relative">
              {/* Marquee Vertical scroll list */}
              <div className="animate-scroll-table hover:[animation-play-state:paused] cursor-pointer">
                {/* Loop Set 1 */}
                {LIVE_ISSUES.map((issue, idx) => (
                  <div
                    key={`${issue.title}-1-${idx}`}
                    className={`grid grid-cols-12 gap-4 px-6 py-4.5 items-center border-b border-white/[0.03] transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-0.5 hover:shadow-lg ${
                      idx % 2 === 0 ? "bg-transparent" : "bg-white/[0.01]"
                    }`}
                  >
                    {/* Title & Tags */}
                    <div className="col-span-6 min-w-0 pr-4">
                      <h4 className="text-sm font-semibold text-zinc-100 truncate transition-colors leading-snug">
                        {issue.title}
                      </h4>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {issue.tags.map((t) => (
                          <span key={t} className="text-3xs font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.05] text-zinc-400">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Repository Name with status dot */}
                    <div className="col-span-2 flex items-center gap-2">
                      <span className="font-mono text-xs text-zinc-300 font-semibold truncate">
                        {issue.repo}
                      </span>
                      {idx % 3 === 0 && (
                        <span className="relative flex size-1.5 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/60 opacity-75"></span>
                          <span className="relative inline-flex rounded-full size-1.5 bg-emerald-500"></span>
                        </span>
                      )}
                    </div>

                    {/* Difficulty Pillar */}
                    <div className="col-span-2 flex items-center gap-2.5">
                      <span className={`text-3xs font-mono font-bold px-2 py-0.5 rounded-full border ${issue.diffClass}`}>
                        {issue.difficulty}
                      </span>
                      {issue.tracked && (
                        <span className="text-3xs font-mono font-bold tracking-wide animate-shimmer-text">
                          Tracked
                        </span>
                      )}
                    </div>

                    {/* Age */}
                    <div className="col-span-1 text-xs text-zinc-400 font-medium">
                      {issue.age}
                    </div>

                    {/* Match Score */}
                    <div className="col-span-1 text-right font-mono text-sm font-bold">
                      <span className={`animate-pulse ${
                        issue.score >= 80 ? "text-emerald-400" :
                        issue.score >= 50 ? "text-amber-400" :
                        "text-zinc-500"
                      }`}>
                        {issue.score}%
                      </span>
                    </div>
                  </div>
                ))}

                {/* Loop Set 2 (Duplicate to complete seamless loop) */}
                {LIVE_ISSUES.map((issue, idx) => (
                  <div
                    key={`${issue.title}-2-${idx}`}
                    className={`grid grid-cols-12 gap-4 px-6 py-4.5 items-center border-b border-white/[0.03] transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-0.5 hover:shadow-lg ${
                      idx % 2 === 0 ? "bg-transparent" : "bg-white/[0.01]"
                    }`}
                  >
                    {/* Title & Tags */}
                    <div className="col-span-6 min-w-0 pr-4">
                      <h4 className="text-sm font-semibold text-zinc-100 truncate transition-colors leading-snug">
                        {issue.title}
                      </h4>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {issue.tags.map((t) => (
                          <span key={t} className="text-3xs font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.05] text-zinc-400">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Repository Name with status dot */}
                    <div className="col-span-2 flex items-center gap-2">
                      <span className="font-mono text-xs text-zinc-300 font-semibold truncate">
                        {issue.repo}
                      </span>
                      {idx % 3 === 0 && (
                        <span className="relative flex size-1.5 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400/60 opacity-75"></span>
                          <span className="relative inline-flex rounded-full size-1.5 bg-emerald-500"></span>
                        </span>
                      )}
                    </div>

                    {/* Difficulty Pillar */}
                    <div className="col-span-2 flex items-center gap-2.5">
                      <span className={`text-3xs font-mono font-bold px-2 py-0.5 rounded-full border ${issue.diffClass}`}>
                        {issue.difficulty}
                      </span>
                      {issue.tracked && (
                        <span className="text-3xs font-mono font-bold tracking-wide animate-shimmer-text">
                          Tracked
                        </span>
                      )}
                    </div>

                    {/* Age */}
                    <div className="col-span-1 text-xs text-zinc-400 font-medium">
                      {issue.age}
                    </div>

                    {/* Match Score */}
                    <div className="col-span-1 text-right font-mono text-sm font-bold">
                      <span className={`animate-pulse ${
                        issue.score >= 80 ? "text-emerald-400" :
                        issue.score >= 50 ? "text-amber-400" :
                        "text-zinc-500"
                      }`}>
                        {issue.score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}