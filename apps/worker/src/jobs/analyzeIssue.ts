import { Worker } from "bullmq";
import { GoogleGenAI, Type } from "@google/genai";
import { redisConnection } from "@repo/queue";
import { prisma } from "@repo/db";
import type { Difficulty } from "@repo/db";
import { z } from "zod";
import { matchUsersQueue } from "@repo/queue";

const analysisSchema = z.object({
    difficulty: z.enum([
        "beginner",
        "intermediate",
        "advanced",
    ]),
    summary: z.string(),
    skillsRequired: z.array(z.string()),
    estimatedTime: z.string(),
});

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
});


async function analyzeIssue(issueId: string) {
    const issue = await prisma.issue.findUnique({
        where: { id: issueId },
        include: { repo: true },
    });

    if (!issue) {
        console.error(`Issue ${issueId} not found`);
        return;
    }

    if (issue.analyzedAt) {
        console.log(`Issue ${issueId} already analyzed, skipping`);
        return;
    }

    console.log(`Analyzing issue: ${issue.title}`);

    const prompt = `You are a developer tools assistant analyzing GitHub issues.
Given an issue from a repository
Repo: ${issue.repo.fullName}
Primary language: ${issue.repo.primaryLanguage ?? "unknown"}

Issue title: ${issue.title}
Issue body: ${issue.body ?? "No description provided"}
Labels: ${issue.labels.join(", ") || "none"}

Return this exact shape:
{
  "difficulty": "beginner" or "intermediate" or "advanced",
  "summary": "2-3 sentence plain English explanation of what needs to be done",
  "skillsRequired": ["skill1", "skill2"],
  "estimatedTime": "e.g. 2-4 hours"
}

Base difficulty on:
- beginner: well-scoped, clear instructions, no deep codebase knowledge needed
- intermediate: requires understanding of the codebase, moderate complexity
- advanced: architectural changes, complex logic, significant codebase knowledge needed`;

    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    difficulty: {
                        type: Type.STRING,
                        enum: ["beginner", "intermediate", "advanced"],
                    },
                    summary: {
                        type: Type.STRING,
                    },
                    skillsRequired: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                    },
                    estimatedTime: {
                        type: Type.STRING,
                    },
                },
                required: [
                    "difficulty",
                    "summary",
                    "skillsRequired",
                    "estimatedTime",
                ],
            },
        },
    });

    const raw = response.text;

    if (!raw) {
        throw new Error(`Empty Gemini response for issue ${issueId}`);
    }

    const parsed = analysisSchema.parse(JSON.parse(raw));

    const difficultyMap: Record<string, Difficulty> = {
        beginner: "BEGINNER",
        intermediate: "INTERMEDIATE",
        advanced: "ADVANCED",
    };

    await prisma.issue.update({
        where: { id: issueId },
        data: {
            aiDifficulty:
                difficultyMap[parsed.difficulty],
            aiSummary: parsed.summary,
            aiSkillsRequired: parsed.skillsRequired,
            aiEstimatedTime: parsed.estimatedTime,
            analyzedAt: new Date(),
        },
    });

    await matchUsersQueue.add(
        "match-issues",
        { issueId },
        {
            jobId: `match-${issueId}`,
            attempts: 3,
            backoff: { type: "exponential", delay: 3000 },
        }
    );
    console.log(`Issue ${issueId} analyzed successfully ${parsed.difficulty} — ${parsed.summary.slice(0, 60)}...`);
}

export const aiAnalysisWorker = new Worker(
    "ai-analysis",
    async (job) => {
        await analyzeIssue(job.data.issueId as string);
    },
    {
        connection: redisConnection,
        concurrency: 2,
    }
);

aiAnalysisWorker.on("completed", (job) => {
    console.log(`✓ Analysis job ${job.id} completed`);
});

aiAnalysisWorker.on("failed", (job, err) => {
    console.error(`✗ Analysis job ${job?.id} failed:`, err.message);
});

aiAnalysisWorker.on("error", (err) => {
    console.error("AI Analysis worker error:", err.message);
});