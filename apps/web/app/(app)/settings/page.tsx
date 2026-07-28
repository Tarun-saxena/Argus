"use client";

import * as React from "react";
import { api } from "@/lib/api";
import type { UserProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

function values(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

export default function SettingsPage() {
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [skills, setSkills] = React.useState("");
  const [languages, setLanguages] = React.useState("");
  const [interests, setInterests] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  React.useEffect(() => { void api.getMe().then((user) => { setProfile(user); setSkills(user.skills.join(", ")); setLanguages(user.preferredLanguages.join(", ")); setInterests(user.interests.join(", ")); }).catch((caught) => setError(caught instanceof Error ? caught.message : "Could not load profile.")); }, []);
  async function submit(event: React.FormEvent) { event.preventDefault(); setSaving(true); setError(null); try { const user = await api.updateMe({ skills: values(skills), preferredLanguages: values(languages), interests: values(interests) }); setProfile(user); } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not save settings."); } finally { setSaving(false); } }
  if (error && !profile) return <p className="text-sm text-destructive">{error}</p>;
  if (!profile) return <Skeleton className="h-80 w-full" />;
  return <section className="max-w-2xl space-y-6"><div><p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Settings</p><h1 className="mt-2 text-2xl font-semibold tracking-tight">Profile preferences</h1><p className="mt-2 text-sm text-muted-foreground">Signed in as {profile.username}.</p></div><form onSubmit={submit} className="space-y-5 rounded-lg border border-border bg-card p-5"><label className="block space-y-2 text-sm font-medium">Skills<Input value={skills} onChange={(event) => setSkills(event.target.value)} placeholder="React, TypeScript, Node.js" /></label><label className="block space-y-2 text-sm font-medium">Preferred languages<Input value={languages} onChange={(event) => setLanguages(event.target.value)} placeholder="TypeScript, Python" /></label><label className="block space-y-2 text-sm font-medium">Interests<Input value={interests} onChange={(event) => setInterests(event.target.value)} placeholder="Accessibility, developer tooling" /></label>{error && <p className="text-sm text-destructive">{error}</p>}<Button disabled={saving}>{saving ? "Saving…" : "Save preferences"}</Button></form></section>;
}
