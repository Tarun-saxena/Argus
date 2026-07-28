"use client";

import * as React from "react";
import { api } from "@/lib/api";
import type { Repository } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function RepositoriesPage() {
    const [repos, setRepos] = React.useState<Repository[]>([]);
    const [fullName, setFullName] = React.useState("");
    const [loading, setLoading] = React.useState(true);
    const [submitting, setSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const load = React.useCallback(async () => { try { setError(null); setLoading(true); setRepos(await api.getRepos()); } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not load repositories."); } finally { setLoading(false); } }, []);
    React.useEffect(() => { void load(); }, [load]);
    async function submit(event: React.FormEvent) { event.preventDefault(); setSubmitting(true); setError(null); try { await api.addRepo(fullName.trim()); setFullName(""); await load(); } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not add repository."); } finally { setSubmitting(false); } }
    return <section className="space-y-6">
        <div><p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Repositories</p><h1 className="mt-2 text-2xl font-semibold tracking-tight">Tracked repositories</h1><p className="mt-2 text-sm text-muted-foreground">Add public GitHub repositories for Argus to poll and analyze.</p></div>
        <form onSubmit={submit} className="flex max-w-xl gap-2"><Input value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="owner/repository" /><Button disabled={submitting}>{submitting ? "Adding…" : "Add repository"}</Button></form>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {loading ? <Skeleton className="h-32 w-full" /> : repos.length === 0 ? <p className="rounded-lg border border-border p-6 text-sm text-muted-foreground">No repositories are tracked yet.</p> : <div className="grid gap-3 sm:grid-cols-2">{repos.map((repo) => <article key={repo.id} className="rounded-lg border border-border bg-card p-4"><h2 className="font-mono text-sm font-medium">{repo.fullName}</h2><p className="mt-2 text-sm text-muted-foreground">{repo.primaryLanguage ?? "Language not detected"} · {repo.stars.toLocaleString()} stars</p></article>)}</div>}
    </section>;
}
