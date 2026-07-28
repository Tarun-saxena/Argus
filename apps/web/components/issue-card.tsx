import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ExternalLink, Clock, Star } from "lucide-react";

const difficultyColors: Record<string, string> = {
    BEGINNER: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    INTERMEDIATE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    ADVANCED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

interface IssueCardProps {
    recommendation: {
        id: string;
        score: number;
        issue: {
            id: string;
            title: string;
            url: string;
            labels: string[];
            aiDifficulty: string | null;
            aiSummary: string | null;
            aiSkillsRequired: string[];
            aiEstimatedTime: string | null;
            createdAt: string;
            repo: {
                name: string;
                fullName: string;
                stars: number;
                primaryLanguage: string | null;
            };
        };
    };
}

export function IssueCard({ recommendation }: IssueCardProps) {
    const { score, issue } = recommendation;

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        {/* repo name */}
                        <p className="text-xs text-muted-foreground mb-1">
                            {issue.repo.fullName}
                            {issue.repo.primaryLanguage && (
                                <span className="ml-2 font-medium">{issue.repo.primaryLanguage}</span>
                            )}
                            <span className="ml-2 inline-flex items-center gap-0.5">
                                <Star className="h-3 w-3" />
                                {issue.repo.stars.toLocaleString()}
                            </span>
                        </p>
                        {/* title */}

                        <a href={issue.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-sm hover:underline leading-snug flex items-start gap-1"
                        >
                            {issue.title}
                            <ExternalLink className="h-3 w-3 mt-0.5 shrink-0 text-muted-foreground" />
                        </a>
                    </div>

                    {/* match score */}
                    <div className="shrink-0 text-right">
                        <div className="text-lg font-bold text-primary">{score}%</div>
                        <div className="text-xs text-muted-foreground">match</div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-3">
                {/* AI summary */}
                {issue.aiSummary && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {issue.aiSummary}
                    </p>
                )}

                {/* badges row */}
                <div className="flex flex-wrap gap-2">
                    {issue.aiDifficulty && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColors[issue.aiDifficulty]}`}>
                            {issue.aiDifficulty.charAt(0) + issue.aiDifficulty.slice(1).toLowerCase()}
                        </span>
                    )}
                    {issue.aiEstimatedTime && (
                        <Badge variant="outline" className="text-xs gap-1">
                            <Clock className="h-3 w-3" />
                            {issue.aiEstimatedTime}
                        </Badge>
                    )}
                    {issue.repo.primaryLanguage && (
                        <Badge variant="secondary" className="text-xs">
                            {issue.repo.primaryLanguage}
                        </Badge>
                    )}
                </div>

                {/* skills */}
                {issue.aiSkillsRequired.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {issue.aiSkillsRequired.slice(0, 5).map((skill) => (
                            <span
                                key={skill}
                                className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card >
    );
}