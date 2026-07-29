"use client";

import * as React from "react";
import { api } from "@/lib/api";
import type { Repository } from "@/lib/types";

export default function RepositoriesPage() {
    const [repos, setRepos] = React.useState<Repository[]>([]);
    const [fullName, setFullName] = React.useState("");
    const [loading, setLoading] = React.useState(true);
    const [submitting, setSubmitting] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const load = React.useCallback(async () => {
        try {
            setError(null);
            setLoading(true);
            setRepos(await api.getRepos());
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Could not load repositories.");
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => { void load(); }, [load]);

    async function submit(event: React.FormEvent) {
        event.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await api.addRepo(fullName.trim());
            setFullName("");
            await load();
        } catch (caught) {
            setError(caught instanceof Error ? caught.message : "Could not add repository.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="relative min-h-screen bg-[#fafafa]">

            {/* Corner arc — top left */}
            <svg width="110" height="110" viewBox="0 0 110 110" fill="none" aria-hidden="true" overflow="visible" className="pointer-events-none absolute z-20 left-0 top-0 hidden md:block">
                <path d="M109.5 0.5C95.1859 0.5 81.012 3.31937 67.7875 8.79713C54.563 14.2749 42.5469 22.3038 32.4254 32.4254C22.3038 42.5469 14.2749 54.563 8.79713 67.7875C3.31936 81.012 0.499998 95.1859 0.5 109.5" stroke="#d4d4d8" />
            </svg>

            {/* Corner arc — top right */}
            <svg width="110" height="110" viewBox="0 0 110 110" fill="none" aria-hidden="true" overflow="visible" className="pointer-events-none absolute z-20 right-0 top-0 hidden md:block" style={{ transform: "scaleX(-1)" }}>
                <path d="M109.5 0.5C95.1859 0.5 81.012 3.31937 67.7875 8.79713C54.563 14.2749 42.5469 22.3038 32.4254 32.4254C22.3038 42.5469 14.2749 54.563 8.79713 67.7875C3.31936 81.012 0.499998 95.1859 0.5 109.5" stroke="#d4d4d8" />
            </svg>

            {/* Horizontal divider */}
            <div className="absolute inset-x-0 top-[110px] h-px bg-[#e4e4e7] hidden md:block" />

            {/* Vertical divider */}
            <div className="absolute inset-y-0 left-1/2 w-px bg-[#e4e4e7] hidden md:block opacity-40" />

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-6 py-16">

                {/* Page header */}
                <div className="mb-12">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#a1a1aa] mb-3">
                        Repositories
                    </p>
                    <div className="grid md:grid-cols-2 gap-8 pb-10 border-b border-[#e4e4e7]">
                        <h1 className="text-3xl md:text-4xl font-bold text-[#09090b] leading-tight">
                            Tracked{" "}
                            <span className="text-[#a1a1aa]">repositories</span>
                        </h1>
                        <div className="md:border-l md:border-[#e4e4e7] md:pl-8 flex items-center">
                            <p className="text-sm text-[#71717a] leading-relaxed">
                                Add any public GitHub repository. Argus polls it every 5 minutes,
                                runs AI analysis on every issue, and surfaces the ones that match your skills.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Add repo form */}
                <div className="mb-10">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#a1a1aa] mb-4">
                        Add a repository
                    </p>
                    <form onSubmit={submit} className="flex max-w-xl gap-3">
                        <div className="flex-1 relative">
                            {/* GitHub icon inside input */}
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1aa]">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                </svg>
                            </div>
                            <input
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="owner/repository"
                                className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#e4e4e7] rounded-md bg-white text-[#09090b] placeholder:text-[#a1a1aa] focus:outline-none focus:ring-2 focus:ring-[#09090b] focus:border-transparent transition"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={submitting || !fullName.trim()}
                            className="inline-flex items-center gap-2 bg-[#09090b] text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-[#27272a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {submitting ? (
                                <>
                                    <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Adding…
                                </>
                            ) : (
                                <>
                                    <span>+</span>
                                    Add repository
                                </>
                            )}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-[#ef4444]">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            {error}
                        </div>
                    )}
                </div>

                {/* Repos list */}
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#a1a1aa] mb-4">
                        {loading ? "Loading…" : `${repos.length} repositories tracked`}
                    </p>

                    {loading ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="border border-[#e4e4e7] rounded-xl p-5 bg-white animate-pulse">
                                    <div className="h-4 bg-[#f4f4f5] rounded w-2/3 mb-3" />
                                    <div className="h-3 bg-[#f4f4f5] rounded w-1/2 mb-2" />
                                    <div className="h-3 bg-[#f4f4f5] rounded w-1/3" />
                                </div>
                            ))}
                        </div>
                    ) : repos.length === 0 ? (
                        <div className="border border-dashed border-[#e4e4e7] rounded-xl p-12 text-center bg-white">
                            <div className="w-10 h-10 rounded-full border border-[#e4e4e7] bg-[#fafafa] flex items-center justify-center mx-auto mb-4">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a1a1aa" strokeWidth="1.5">
                                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-[#09090b] mb-1">No repositories yet</p>
                            <p className="text-xs text-[#a1a1aa]">
                                Add a public GitHub repo above to start tracking issues.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {repos.map((repo) => (
                                <article
                                    key={repo.id}
                                    className="group border border-[#e4e4e7] rounded-xl p-5 bg-white hover:border-[#d4d4d8] hover:shadow-sm transition-all"
                                >
                                    {/* Repo header */}
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className="w-7 h-7 rounded-md bg-[#fafafa] border border-[#e4e4e7] flex items-center justify-center shrink-0">
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="#71717a">
                                                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                                                </svg>
                                            </div>
                                            <h2 className="font-mono text-sm font-medium text-[#09090b] truncate">
                                                {repo.fullName}
                                            </h2>
                                        </div>

                                        <a
                                            href={`https://github.com/${repo.fullName}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="shrink-0 text-[#a1a1aa] hover:text-[#09090b] transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                                                <polyline points="15 3 21 3 21 9" />
                                                <line x1="10" y1="14" x2="21" y2="3" />
                                            </svg>
                                        </a>
                                    </div>

                                    {/* Stats row */}
                                    < div className="flex items-center gap-3 text-xs text-[#71717a]" >
                                        {
                                            repo.primaryLanguage && (
                                                <span className="flex items-center gap-1">
                                                    <span className="w-2 h-2 rounded-full bg-[#6366f1]" />
                                                    {repo.primaryLanguage}
                                                </span>
                                            )
                                        }
                                        < span className="flex items-center gap-1" >
                                            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                            {repo.stars.toLocaleString()}
                                        </span>
                                        {repo.lastPolledAt && (
                                            <span className="ml-auto text-[#a1a1aa]">
                                                Polled {new Date(repo.lastPolledAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </span>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )
                    }
                </div >
            </div >
        </section >
    );
}