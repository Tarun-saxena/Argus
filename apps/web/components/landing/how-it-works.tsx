"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuitIcon, Code2Icon, ClockIcon, BarChart3Icon } from "lucide-react";

const ANALYSIS_DIMENSIONS = [
  {
    id: "skills",
    title: "Required Skill Extraction",
    icon: Code2Icon,
    short: "Identifies required languages, frameworks & APIs from issue descriptions and file diffs.",
    detail: {
      extracted: ["TypeScript", "React Core", "SSR Hydration", "Next.js App Router"],
      explanation: "Scans code snippets and issue text to extract precise technical requirements beyond broad label tags.",
    },
  },
  {
    id: "difficulty",
    title: "AI Difficulty Evaluation",
    icon: BarChart3Icon,
    short: "Scores architectural complexity into Beginner, Intermediate, or Advanced tiers.",
    detail: {
      tier: "INTERMEDIATE",
      color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
      explanation: "Evaluates codebase depth, dependency tree changes, and testing requirements before assigning difficulty.",
    },
  },
  {
    id: "effort",
    title: "Effort & Time Estimation",
    icon: ClockIcon,
    short: "Predicts realistic completion time so you can match issues to your available schedule.",
    detail: {
      estimate: "3 – 5 hours",
      explanation: "Analyzes historical PR merge velocity for similar issues across tracked repositories.",
    },
  },
];

export function HowItWorks() {
  const [activeTab, setActiveTab] = useState(ANALYSIS_DIMENSIONS[0]!.id);
  const activeDimension = ANALYSIS_DIMENSIONS.find((d) => d.id === activeTab) || ANALYSIS_DIMENSIONS[0]!;

  return (
    <section id="how-it-works" className="relative border-t border-border/60 bg-muted/20 py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end pb-16 border-b border-border/40">
          <div className="lg:col-span-7">
            <span className="text-xs font-mono font-semibold uppercase tracking-widest text-primary">
              02 / DEEP ISSUE ANALYSIS
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.1]">
              Every issue dissected across <br className="hidden sm:inline" />
              <span className="text-muted-foreground font-normal">three actionable dimensions.</span>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:pl-8">
            <p className="text-base text-muted-foreground leading-relaxed">
              Instead of relying on developer guesswork, Argus reads raw issue bodies and repository structures to construct a complete, multidimensional profile of every task.
            </p>
          </div>
        </div>

        {/* Interactive Dimension Inspector */}
        <div className="mt-16 grid gap-8 lg:grid-cols-12 items-start">
          {/* Dimension Selector Column */}
          <div className="lg:col-span-5 space-y-3">
            {ANALYSIS_DIMENSIONS.map((dim) => {
              const Icon = dim.icon;
              const isActive = dim.id === activeTab;
              return (
                <button
                  key={dim.id}
                  onClick={() => setActiveTab(dim.id)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all ${isActive
                    ? "border-primary bg-card shadow-md shadow-primary/5"
                    : "border-border/60 bg-card/40 hover:bg-card hover:border-border"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border ${isActive ? "bg-primary/10 border-primary/30 text-primary" : "bg-muted border-border text-muted-foreground"}`}>
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground">{dim.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{dim.short}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Inspection Display Card */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xl shadow-black/5 min-h-[340px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <BrainCircuitIcon className="size-4 text-primary" />
                    <span className="text-xs font-mono font-semibold uppercase text-foreground">AI Intelligence Model</span>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">Dimension: {activeDimension.id.toUpperCase()}</span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeDimension.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <h4 className="text-xl font-bold text-foreground">{activeDimension.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {activeDimension.detail.explanation}
                    </p>

                    {activeDimension.id === "skills" && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {activeDimension.detail.extracted?.map((skill) => (
                          <span key={skill} className="text-xs font-mono px-3 py-1 rounded-lg border border-primary/20 bg-primary/5 text-primary font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {activeDimension.id === "difficulty" && (
                      <div className="pt-2">
                        <span className={`inline-block text-xs font-mono font-bold px-3 py-1.5 rounded-lg border ${activeDimension.detail.color}`}>
                          TIER: {activeDimension.detail.tier}
                        </span>
                      </div>
                    )}

                    {activeDimension.id === "effort" && (
                      <div className="pt-2">
                        <span className="inline-block text-xs font-mono font-bold px-3 py-1.5 rounded-lg border border-border bg-muted/40 text-foreground">
                          ESTIMATED EFFORT: {activeDimension.detail.estimate}
                        </span>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-8 pt-4 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground font-mono">
                <span>Confidence Score: 96.4%</span>
                <span>Argus Engine v1.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}