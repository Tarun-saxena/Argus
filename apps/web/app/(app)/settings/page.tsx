"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  SaveIcon,
  Loader2Icon,
  AlertCircleIcon,
  GitForkIcon,
  SparklesIcon,
  BookmarkIcon,
  CheckCircle2Icon,
  ExternalLinkIcon,
  UserIcon,
} from "lucide-react";
import { api } from "@/lib/api";
import type { UserProfile } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { SelectablePill } from "@/components/shared/selectable-pill";
import { recommendationState } from "@/lib/recommendation-state";
import { useAuth } from "@/lib/auth-context";

import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── Skill catalogue ──────────────────────────────────────────────────────────

const ALL_LANGUAGES = [
  "TypeScript", "JavaScript", "Python", "Go", "Rust",
  "Java", "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin", "Elixir", "Scala",
];

const INTEREST_OPTIONS = [
  "Good first issues", "Bug fixes", "Documentation", "Performance",
  "Developer Tooling", "Accessibility", "Security", "Testing",
  "Frontend", "Backend", "Full-Stack", "Mobile", "Systems", "AI/ML",
];

const SKILL_GROUPS: Array<{ label: string; items: string[] }> = [
  {
    label: "Frontend",
    items: ["TypeScript", "JavaScript", "React", "Next.js", "Vue", "Svelte", "Angular", "CSS", "Tailwind", "SASS"],
  },
  {
    label: "Backend",
    items: ["Node.js", "Express", "Fastify", "NestJS", "Python", "Django", "FastAPI", "Flask", "Go", "Rust", "Java", "C++", "C#", "PHP", "Ruby", "Swift", "Kotlin", "Elixir"],
  },
  {
    label: "Data & APIs",
    items: ["GraphQL", "REST", "tRPC", "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite"],
  },
  {
    label: "Infrastructure & Other",
    items: ["Docker", "Kubernetes", "AWS", "GCP", "Azure", "Testing", "Accessibility", "DevTools", "CLI", "WebAssembly", "Security"],
  },
];

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
      <div className="text-muted-foreground shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-lg font-bold text-foreground tabular-nums">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid md:grid-cols-[200px_1fr] gap-6">
      <div className="pt-1">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{description}</p>
        )}
      </div>
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        {children}
      </div>
    </div>
  );
}

// ─── Settings page ─────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const router = useRouter();
  const { refetchUser } = useAuth();
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const [skills, setSkills] = React.useState<string[]>([]);
  const [languages, setLanguages] = React.useState<string[]>([]);
  const [interests, setInterests] = React.useState<string[]>([]);

  const [stats, setStats] = React.useState({ repos: 0, recommendations: 0, bookmarks: 0 });
  const [saveStatus, setSaveStatus] = React.useState(recommendationState.getStatus());

  React.useEffect(() => {
    return recommendationState.subscribeStatus((status) => {
      setSaveStatus(status);
    });
  }, []);

  const isDirty = React.useMemo(() => {
    if (!profile) return false;
    return (
      JSON.stringify([...skills].sort()) !== JSON.stringify([...profile.skills].sort()) ||
      JSON.stringify([...languages].sort()) !== JSON.stringify([...profile.preferredLanguages].sort()) ||
      JSON.stringify([...interests].sort()) !== JSON.stringify([...profile.interests].sort())
    );
  }, [skills, languages, interests, profile]);

  const inFlightRef = React.useRef(false);

  const refreshStats = React.useCallback(async () => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    try {
      const [user, recs, bookmarks] = await Promise.all([
        api.getMe(),
        api.getRecommendations(),
        api.getRecommendations({ state: "BOOKMARKED" }),
      ]);
      setStats({
        repos: user.trackedRepoCount ?? 0,
        recommendations: recs.count,
        bookmarks: bookmarks.count,
      });
    } catch {
      // ignore
    } finally {
      inFlightRef.current = false;
    }
  }, []);

  React.useEffect(() => {
    return recommendationState.subscribeInvalidation(() => {
      void refreshStats();
    });
  }, [refreshStats]);

  React.useEffect(() => {
    async function fetchAll() {
      try {
        const [user] = await Promise.all([
          api.getMe(),
          refreshStats(),
        ]);
        setProfile(user);
        setSkills(user.skills);
        setLanguages(user.preferredLanguages);
        setInterests(user.interests);
      } catch (e) {
        setLoadError(e instanceof Error ? e.message : "Could not load profile.");
      }
    }
    void fetchAll();
  }, [refreshStats]);

  const pollRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const safetyTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const successTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  function toggle(item: string, list: string[], setList: (v: string[]) => void) {
    setList(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
  }

  async function handleSave() {
    if (saveStatus !== "idle") return; // Prevent duplicate submissions

    const saveTime = new Date();
    recommendationState.setStatus("saving");

    try {
      const updated = await api.updateMe({ skills, preferredLanguages: languages, interests });
      setProfile(updated);
      await refetchUser();
    } catch (err) {
      console.error("Save failed:", err);
      toast.error("Failed to save changes. Please try again.");
      recommendationState.setStatus("idle");
      return;
    }

    toast.success("Profile saved. Recalculating recommendations...");
    recommendationState.startRematchTracking(saveTime);
    void refreshStats();
  }

  // ─── Error state ────────────────────────────────────────────────────────────

  if (loadError) {
    return (
      <div role="alert" className="flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-destructive">
        <AlertCircleIcon className="size-4 shrink-0" aria-hidden="true" />
        <p className="text-sm">{loadError}</p>
      </div>
    );
  }

  // ─── Loading state ───────────────────────────────────────────────────────────

  if (!profile) {
    return (
      <div className="space-y-8 max-w-3xl" aria-busy="true" aria-label="Loading profile">
        <div className="flex items-center gap-5">
          <Skeleton className="size-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const memberSince = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="max-w-3xl space-y-10"
    >
      {/* ── Page header ── */}
      <PageHeader
        eyebrow="Settings"
        title="Profile & preferences"
        description="Your skills and preferences are used to score and rank open-source issues."
      />

      {/* ── Profile identity ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="relative" aria-hidden="true">
          {profile.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt=""
              width={64}
              height={64}
              className="rounded-full ring-2 ring-border"
              unoptimized
            />
          ) : (
            <div className="size-16 rounded-full bg-muted border border-border flex items-center justify-center">
              <UserIcon className="size-6 text-muted-foreground" />
            </div>
          )}
          <span className="absolute -bottom-1 -right-1 size-3.5 rounded-full bg-emerald-400 border-2 border-background" aria-label="Online" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-foreground">{profile.username}</h2>
            <a
              href={`https://github.com/${profile.username}`}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`Open ${profile.username}'s GitHub profile`}
            >
              <ExternalLinkIcon className="size-3.5" aria-hidden="true" />
            </a>
          </div>
          {profile.email && (
            <p className="text-sm text-muted-foreground mt-0.5">{profile.email}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">Member since {memberSince}</p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" role="list" aria-label="Your statistics">
        <StatCard
          icon={<GitForkIcon className="size-4" />}
          label="Tracked repos"
          value={stats.repos}
        />
        <StatCard
          icon={<SparklesIcon className="size-4" />}
          label="Recommendations"
          value={stats.recommendations}
        />
        <StatCard
          icon={<BookmarkIcon className="size-4" />}
          label="Saved"
          value={stats.bookmarks}
        />
      </div>

      {/* ── Skills & Frameworks ── */}
      <Section
        title="Skills & Frameworks"
        description="Argus uses your skills to score how well each issue aligns with your expertise."
      >
        <div className="space-y-4">
          {SKILL_GROUPS.map((group) => (
            <div key={group.label} className="space-y-2" role="group" aria-labelledby={`skill-group-${group.label}`}>
              <p
                id={`skill-group-${group.label}`}
                className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
              >
                {group.label}
              </p>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <SelectablePill
                    key={skill}
                    label={skill}
                    selected={skills.includes(skill)}
                    onClick={() => toggle(skill, skills, setSkills)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground pt-1" aria-live="polite">
          {skills.length === 0
            ? "No skills selected — select at least one to improve matching."
            : `${skills.length} skill${skills.length !== 1 ? "s" : ""} selected.`}
        </p>
      </Section>

      {/* ── Preferred Languages ── */}
      <Section
        title="Preferred Languages"
        description="Issues in these languages receive a score bonus in your Feed."
      >
        <div className="flex flex-wrap gap-2" role="group" aria-label="Preferred programming languages">
          {ALL_LANGUAGES.map((lang) => (
            <SelectablePill
              key={lang}
              label={lang}
              selected={languages.includes(lang)}
              onClick={() => toggle(lang, languages, setLanguages)}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {languages.length === 0
            ? "No language preferences set."
            : `${languages.length} language${languages.length !== 1 ? "s" : ""} selected.`}
        </p>
      </Section>

      {/* ── Issue types / Interests ── */}
      <Section
        title="Issue Types"
        description="Argus will prioritise issues that match your interests."
      >
        <div className="flex flex-wrap gap-2" role="group" aria-label="Issue type preferences">
          {INTEREST_OPTIONS.map((interest) => (
            <SelectablePill
              key={interest}
              label={interest}
              selected={interests.includes(interest)}
              onClick={() => toggle(interest, interests, setInterests)}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {interests.length === 0
            ? "No interests selected."
            : `${interests.length} selected.`}
        </p>
      </Section>

      {/* ── Account ── */}
      <div className="space-y-0">
        <div className="h-px bg-border/50 mb-8" role="separator" />
        <Section
          title="Account"
          description="Manage your Argus account."
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Sign out</p>
              <p className="text-xs text-muted-foreground mt-0.5">End your current session on this device.</p>
            </div>
            <button
              type="button"
              onClick={async () => {
                await api.logout();
                window.location.href = "/";
              }}
              className="text-sm font-medium text-destructive hover:underline underline-offset-4 transition-colors"
            >
              Sign out
            </button>
          </div>
        </Section>
      </div>

      {/* ── Bottom save bar (sticky) ── */}
      <AnimatePresence>
        {(isDirty || saveStatus !== "idle") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            role="status"
            aria-label="Save status bar"
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 rounded-xl border border-border bg-card/95 backdrop-blur-md px-5 py-3 shadow-xl"
          >
            {saveStatus === "saving" ? (
              <>
                <Loader2Icon className="size-4 animate-spin text-primary shrink-0" aria-hidden="true" />
                <p className="text-sm font-medium text-foreground">Saving preferences...</p>
              </>
            ) : saveStatus === "recalculating" ? (
              <>
                <Loader2Icon className="size-4 animate-spin text-primary shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-foreground">Recalculating recommendations for your updated profile...</p>
                  <p className="text-[11px] text-muted-foreground">Matching open-source repositories to your stack</p>
                </div>
              </>
            ) : saveStatus === "success" ? (
              <>
                <CheckCircle2Icon className="size-4 text-emerald-400 shrink-0" aria-hidden="true" />
                <p className="text-sm font-medium text-foreground">Recommendations updated successfully.</p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline underline-offset-4 ml-2"
                >
                  View Dashboard
                </Link>
              </>
            ) : (
              <>
                <p className="text-sm text-foreground font-medium">Unsaved changes</p>
                <button
                  type="button"
                  onClick={() => {
                    setSkills(profile.skills);
                    setLanguages(profile.preferredLanguages);
                    setInterests(profile.interests);
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-1.5 h-8 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all"
                >
                  <CheckCircle2Icon className="size-3.5" aria-hidden="true" />
                  Save changes
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
