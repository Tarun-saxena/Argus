"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCwIcon, CheckCircle2Icon, AlertCircleIcon, ShieldCheckIcon } from "lucide-react";

const SAMPLE_REPOS = [
  { name: "facebook/react", status: "Synced", issues: 42, lang: "TypeScript", time: "2m ago" },
  { name: "vercel/next.js", status: "Scanning", issues: 128, lang: "TypeScript", time: "Just now" },
  { name: "prisma/prisma", status: "Synced", issues: 19, lang: "TypeScript", time: "5m ago" },
  { name: "shadcn/ui", status: "Synced", issues: 8, lang: "TypeScript", time: "12m ago" },
];

export function Problem() {
  const [selectedTab, setSelectedTab] = useState<"noise" | "signal">("signal");

  return (
    <section id="problem" className="relative bg-white dark:bg-zinc-950 py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end pb-16 border-b border-border/40">
          <div className="lg:col-span-7">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-primary">
              01 / THE DISCOVERY ENGINE
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
              Open-source issue discovery <br className="hidden sm:inline" />
              <span className="text-muted-foreground font-normal">re-engineered from first principles.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pl-8">
            <p className="text-base text-muted-foreground leading-relaxed">
              Standard GitHub searches force developers to wade through stale, already-claimed, or mislabeled issues. Argus continuously ingests repositories, filtering out the noise before it ever hits your screen.
            </p>
          </div>
        </div>

        {/* Asymmetrical Story & Interactive Component */}
        <div className="mt-16 grid gap-12 lg:grid-cols-12 items-center">
          {/* Left Narrative Text */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex rounded-lg border border-border p-1 bg-muted/30">
                <button
                  onClick={() => setSelectedTab("signal")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${selectedTab === "signal" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Argus Signal Engine
                </button>
                <button
                  onClick={() => setSelectedTab("noise")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${selectedTab === "noise" ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Standard GitHub Noise
                </button>
              </div>

              {selectedTab === "signal" ? (
                <motion.div
                  key="signal-desc"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <h3 className="text-2xl font-bold text-foreground tracking-tight">
                    Real-time polling & claim verification
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Argus monitors repository issue streams around the clock. Every issue is pre-screened to ensure it is open, unassigned, and actually ready for external contribution.
                  </p>
                  <ul className="space-y-2 text-xs font-medium text-foreground">
                    <li className="flex items-center gap-2">
                      <ShieldCheckIcon className="size-4 text-primary shrink-0" />
                      <span>Filters out assigned or active pull-request issues</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheckIcon className="size-4 text-primary shrink-0" />
                      <span>Updates within minutes of new issue creation</span>
                    </li>
                  </ul>
                </motion.div>
              ) : (
                <motion.div
                  key="noise-desc"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <h3 className="text-2xl font-bold text-foreground tracking-tight">
                    The "Good First Issue" myth
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Over 74% of issues tagged "good first issue" on GitHub are either outdated, already claimed in comment threads, or require deep internal codebase knowledge.
                  </p>
                  <ul className="space-y-2 text-xs font-medium text-destructive">
                    <li className="flex items-center gap-2">
                      <AlertCircleIcon className="size-4 text-destructive shrink-0" />
                      <span>3,800+ unranked search results</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertCircleIcon className="size-4 text-destructive shrink-0" />
                      <span>Zero difficulty or required skill indicators</span>
                    </li>
                  </ul>
                </motion.div>
              )}
            </div>
          </div>

          {/* Right Live Interactive Mock Box */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/40 overflow-hidden group">
              {/* Noise combined background overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-85 z-0 select-none pointer-events-none group-hover:scale-[1.02] transition-transform duration-[4000ms] ease-out bg-[url('/landing/noise-combined.png')]"
              />
              <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex size-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full size-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-mono font-semibold text-zinc-100 uppercase tracking-wider">Live Repository Stream</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <RefreshCwIcon className="size-3 animate-spin text-primary" />
                  <span>Polling GitHub API</span>
                </div>
              </div>

              <div className="relative z-10 space-y-3">
                {SAMPLE_REPOS.map((repo, idx) => (
                  <motion.div
                    key={repo.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/[0.09] hover:bg-white/[0.12] transition-colors shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 font-mono text-xs font-bold text-zinc-100">
                        {repo.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-zinc-100 font-mono">{repo.name}</p>
                        <p className="text-[11px] text-zinc-400">{repo.issues} untriaged open issues</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-zinc-400 hidden sm:inline">{repo.time}</span>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                        <CheckCircle2Icon className="size-3" />
                        {repo.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
