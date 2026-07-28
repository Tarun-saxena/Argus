"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const COMMON_SKILLS = [
    "TypeScript", "JavaScript", "React", "Node.js", "Python",
    "Go", "Rust", "CSS", "GraphQL", "PostgreSQL", "Docker", "AWS",
];

const COMMON_LANGUAGES = [
    "TypeScript", "JavaScript", "Python", "Go", "Rust",
    "Java", "C++", "Ruby", "PHP", "Swift",
];

export default function OnboardingPage() {
    const router = useRouter();
    const [skills, setSkills] = useState<string[]>([]);
    const [languages, setLanguages] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);

    function toggle(item: string, list: string[], setList: (v: string[]) => void) {
        setList(list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
    }

    async function handleSave() {
        if (skills.length === 0 && languages.length === 0) return;
        setSaving(true);
        try {
            await api.updateMe({ skills, preferredLanguages: languages });
            router.push("/dashboard");
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-lg w-full space-y-8">
                <div>
                    <h1 className="text-2xl font-bold">Set up your profile</h1>
                    <p className="text-muted-foreground mt-1">
                        Tell us your skills so we can match you with the right issues.
                    </p>
                </div>

                {/* skills */}
                <div className="space-y-3">
                    <h2 className="font-medium text-sm">Your skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {COMMON_SKILLS.map((skill) => (
                            <Badge
                                key={skill}
                                variant={skills.includes(skill) ? "default" : "outline"}
                                className="cursor-pointer select-none"
                                onClick={() => toggle(skill, skills, setSkills)}
                            >
                                {skill}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* languages */}
                <div className="space-y-3">
                    <h2 className="font-medium text-sm">Preferred languages</h2>
                    <div className="flex flex-wrap gap-2">
                        {COMMON_LANGUAGES.map((lang) => (
                            <Badge
                                key={lang}
                                variant={languages.includes(lang) ? "default" : "outline"}
                                className="cursor-pointer select-none"
                                onClick={() => toggle(lang, languages, setLanguages)}
                            >
                                {lang}
                            </Badge>
                        ))}
                    </div>
                </div>

                <Button
                    onClick={handleSave}
                    disabled={saving || (skills.length === 0 && languages.length === 0)}
                    className="w-full"
                >
                    {saving ? "Saving..." : "Find my issues →"}
                </Button>
            </div>
        </main>
    );
}