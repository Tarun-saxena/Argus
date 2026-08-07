"use client";

import * as React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { recommendationState } from "@/lib/recommendation-state";
import { CheckIcon, SparklesIcon, GitForkIcon, ArrowRightIcon, Loader2Icon } from "lucide-react";
import { SelectablePill } from "@/components/shared/selectable-pill";
import { cn } from "@/lib/utils";

const SKILLS = [
  "TypeScript", "JavaScript", "React", "Next.js", "Vue", "Svelte",
  "Node.js", "Python", "Go", "Rust", "Java", "C++",
  "GraphQL", "PostgreSQL", "Redis", "Docker", "Kubernetes", "AWS",
  "CSS", "Tailwind", "Testing", "Accessibility", "DevTools", "CLI",
];

const LANGUAGES = [
  "TypeScript", "JavaScript", "Python", "Go", "Rust",
  "Java", "C++", "Ruby", "PHP", "Swift", "Kotlin", "Elixir",
];

const TRENDING_REPOS: Array<{
  fullName: string;
  description: string;
  language: string;
  stars: string;
  tags: string[];
}> = [
  { fullName: "vercel/next.js", description: "The React Framework for the Web", language: "TypeScript", stars: "128k", tags: ["React", "TypeScript", "Web"] },
  { fullName: "shadcn-ui/ui", description: "Beautifully designed components built with Radix UI and Tailwind", language: "TypeScript", stars: "82k", tags: ["React", "CSS", "Accessibility"] },
  { fullName: "trpc/trpc", description: "End-to-end typesafe APIs made easy", language: "TypeScript", stars: "35k", tags: ["TypeScript", "Node.js", "GraphQL"] },
  { fullName: "tailwindlabs/tailwindcss", description: "A utility-first CSS framework for rapid UI development", language: "TypeScript", stars: "86k", tags: ["CSS", "TypeScript"] },
  { fullName: "facebook/react", description: "The library for web and native user interfaces", language: "JavaScript", stars: "230k", tags: ["JavaScript", "React", "Testing"] },
  { fullName: "golang/go", description: "The Go programming language", language: "Go", stars: "125k", tags: ["Go", "CLI", "DevTools"] },
  { fullName: "rust-lang/rust", description: "Empowering everyone to build reliable and efficient software", language: "Rust", stars: "100k", tags: ["Rust", "CLI", "DevTools"] },
  { fullName: "astro-build/astro", description: "The web framework for content-driven websites", language: "TypeScript", stars: "48k", tags: ["TypeScript", "CSS", "Web"] },
  { fullName: "prisma/prisma", description: "Next-generation ORM for Node.js and TypeScript", language: "TypeScript", stars: "40k", tags: ["TypeScript", "Node.js", "PostgreSQL"] },
  { fullName: "supabase/supabase", description: "The open source Firebase alternative", language: "TypeScript", stars: "77k", tags: ["TypeScript", "PostgreSQL", "Docker"] },
  { fullName: "vitejs/vite", description: "Next generation frontend tooling", language: "TypeScript", stars: "70k", tags: ["TypeScript", "JavaScript", "DevTools"] },
  { fullName: "docker/compose", description: "Define and run multi-container applications with Docker", language: "Go", stars: "34k", tags: ["Go", "Docker", "DevTools"] },
];

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

const STEPS = [
  { label: "Your stack", icon: SparklesIcon },
  { label: "Repositories", icon: GitForkIcon },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [skills, setSkills] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  function toggleItem(item: string, list: string[], setList: (v: string[]) => void) {
    setList(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  }

  function toggleRepo(fullName: string) {
    setSelectedRepos((prev) =>
      prev.includes(fullName) ? prev.filter((r) => r !== fullName) : [...prev, fullName]
    );
  }

  async function handleFinish() {
    setSaving(true);
    const saveTime = new Date();
    try {
      await api.updateMe({ skills, preferredLanguages: languages });
      await Promise.allSettled(selectedRepos.map((r) => api.addRepo(r)));
      recommendationState.startRematchTracking(saveTime);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  const canAdvance = skills.length > 0 || languages.length > 0;

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12"
      aria-label="Onboarding"
    >
      {/* Step indicator */}
      <div className="w-full max-w-xl mb-10" role="navigation" aria-label="Setup progress">
        <div className="flex items-center gap-3">
          {STEPS.map((s, i) => {
            const stepNum = i + 1;
            const isActive = step === stepNum;
            const isDone = step > stepNum;
            return (
              <React.Fragment key={s.label}>
                <div
                  className={cn(
                    "flex items-center gap-2 text-xs font-medium transition-colors",
                    isActive ? "text-foreground" : isDone ? "text-primary" : "text-muted-foreground"
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  <div className={cn(
                    "size-5 rounded-full border flex items-center justify-center text-xs font-bold transition-all",
                    isActive ? "border-primary bg-primary text-primary-foreground" :
                    isDone ? "border-primary/40 bg-primary/10 text-primary" :
                    "border-border text-muted-foreground"
                  )}>
                    {isDone ? <CheckIcon className="size-2.5" /> : stepNum}
                  </div>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="flex-1 h-px bg-border overflow-hidden"
                    role="presentation"
                    aria-hidden="true"
                  >
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: step > stepNum ? "100%" : "0%" }}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Step {step} of {STEPS.length} — {STEPS[step - 1]?.label ?? ""}
        </p>
      </div>

      <div className="w-full max-w-xl">
        <AnimatePresence mode="wait">
          {/* ── Step 1: Stack ── */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  What&apos;s your stack?
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Select the skills and languages you know. Argus uses this to rank issues by relevance.
                </p>
              </div>

              {/* Skills */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                <h2
                  id="skills-label"
                  className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                >
                  Skills &amp; Frameworks
                </h2>
                <div
                  className="flex flex-wrap gap-2"
                  role="group"
                  aria-labelledby="skills-label"
                >
                  {SKILLS.map((skill) => (
                    <SelectablePill
                      key={skill}
                      label={skill}
                      selected={skills.includes(skill)}
                      onClick={() => toggleItem(skill, skills, setSkills)}
                    />
                  ))}
                </div>
                {skills.length > 0 && (
                  <p className="text-xs text-muted-foreground" aria-live="polite">
                    {skills.length} selected
                  </p>
                )}
              </div>

              {/* Languages */}
              <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                <h2
                  id="languages-label"
                  className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                >
                  Preferred Languages
                </h2>
                <div
                  className="flex flex-wrap gap-2"
                  role="group"
                  aria-labelledby="languages-label"
                >
                  {LANGUAGES.map((lang) => (
                    <SelectablePill
                      key={lang}
                      label={lang}
                      selected={languages.includes(lang)}
                      onClick={() => toggleItem(lang, languages, setLanguages)}
                    />
                  ))}
                </div>
                {languages.length > 0 && (
                  <p className="text-xs text-muted-foreground" aria-live="polite">
                    {languages.length} selected
                  </p>
                )}
              </div>

              <button
                onClick={() => canAdvance && setStep(2)}
                disabled={!canAdvance}
                aria-disabled={!canAdvance}
                aria-label="Continue to repository selection"
                className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRightIcon className="size-4" aria-hidden="true" />
              </button>

              {!canAdvance && (
                <p className="text-center text-xs text-muted-foreground" role="status">
                  Select at least one skill or language to continue.
                </p>
              )}
            </motion.div>
          )}

          {/* ── Step 2: Repositories ── */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  Track your first repositories
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  Select repos to monitor. Argus will scan them immediately and match issues to your profile.
                  {selectedRepos.length > 0 && (
                    <span className="ml-1 text-primary font-medium" aria-live="polite">
                      {selectedRepos.length} selected.
                    </span>
                  )}
                </p>
              </div>

              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                role="group"
                aria-label="Select repositories to track"
              >
                {TRENDING_REPOS.map((repo) => {
                  const isSelected = selectedRepos.includes(repo.fullName);
                  return (
                    <button
                      key={repo.fullName}
                      type="button"
                      role="checkbox"
                      aria-checked={isSelected}
                      onClick={() => toggleRepo(repo.fullName)}
                      className={cn(
                        "text-left rounded-xl border p-4 transition-all duration-150 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:outline-none",
                        isSelected
                          ? "border-primary/40 bg-primary/5"
                          : "border-border bg-card hover:border-border/80 hover:bg-muted/30"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <GithubIcon className="size-3.5 text-muted-foreground shrink-0" />
                          <span className="font-mono text-xs text-foreground truncate">
                            {repo.fullName}
                          </span>
                        </div>
                        <div
                          className={cn(
                            "shrink-0 size-4 rounded-full border flex items-center justify-center transition-all",
                            isSelected ? "bg-primary border-primary" : "border-border"
                          )}
                          aria-hidden="true"
                        >
                          {isSelected && <CheckIcon className="size-2.5 text-primary-foreground" />}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2 leading-relaxed">
                        {repo.description}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground font-mono" aria-label={`${repo.stars} stars`}>
                          {repo.stars} stars
                        </span>
                        <span className="text-xs text-muted-foreground" aria-hidden="true">·</span>
                        <span className="text-xs text-muted-foreground">{repo.language}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  aria-label="Go back to stack selection"
                  className="h-10 px-4 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border/80 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleFinish}
                  disabled={saving}
                  aria-busy={saving}
                  aria-label={selectedRepos.length > 0 ? `Track ${selectedRepos.length} repos and start` : "Skip and start"}
                  className="flex-1 inline-flex items-center justify-center gap-2 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-all hover:bg-primary/90 disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2Icon className="size-4 animate-spin" aria-hidden="true" />
                      Setting up…
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="size-4" aria-hidden="true" />
                      {selectedRepos.length > 0
                        ? `Track ${selectedRepos.length} repo${selectedRepos.length !== 1 ? "s" : ""} & find issues`
                        : "Skip & find issues"}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
