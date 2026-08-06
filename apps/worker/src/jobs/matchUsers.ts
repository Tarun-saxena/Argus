import { prisma } from "@repo/db";
import { redisConnection } from "@repo/queue";
import { Worker } from "bullmq";



type UserProfile = {
    skills: string[];
    preferredLanguages: string[];
};

type IssueForMatching = {
    labels: string[];
    aiSkillsRequired: string[];
    aiDifficulty: string;
    createdAt: Date;
    repo: {
        primaryLanguage: string | null;
    };
};

function freshnessScore(createdAt: Date): number {
    const ageInDays =
        (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);

    if (ageInDays <= 3) return 1.0;   // brand new
    if (ageInDays <= 7) return 0.85;  // this week
    if (ageInDays <= 14) return 0.7;  // this fortnight
    if (ageInDays <= 30) return 0.5;  // this month
    if (ageInDays <= 90) return 0.3;  // last 3 months
    return 0;                        // old
}


export function scoreIssueForUser(user: UserProfile, issue: IssueForMatching) {
    let score = 0;

    const userSkills = user.skills.map((skill) => skill.trim().toLowerCase());

    const preferredLanguages = user.preferredLanguages.map((lang) => lang.trim().toLowerCase());

    //languageMatch +3

    if (issue.repo.primaryLanguage) {
        const issueLanguage = issue.repo.primaryLanguage.trim().toLowerCase();

        if (preferredLanguages.includes(issueLanguage)) {
            score += 3;
        }

    };

    //ai skillMatch +2each, max+6
    let skillScore = 0
    for (const skill of issue.aiSkillsRequired) {
        const lowerSkill = skill.trim().toLowerCase();
        if (userSkills.includes(lowerSkill)) {
            skillScore += 2;
        }
    }
    score += Math.min(skillScore, 6);

    score += freshnessScore(issue.createdAt) * 2;


    const normalized = Math.round((score / 11) * 100);
    return normalized;

};


async function matchIssueToUsers(issueId: string) {
    if (!issueId) {
        console.error("matchIssueToUsers called with no issueId, skipping");
        return;
    }

    const issue = await prisma.issue.findUnique({
        where: { id: issueId },
        include: {
            repo: true,
        }
    });

    if (!issue) {
        console.log(`Issue ${issueId} not found`);
        return;
    }

    if (!issue.analyzedAt) {
        console.log(`Issue ${issueId} has not been analyzed, skipping`);
        return;
    };

    if (issue.status !== "OPEN") {
        console.log(`Issue ${issueId} is not open, skipping`);
        return;
    }

    const users = await prisma.user.findMany({ where: { skills: { isEmpty: false } } });


    if (users.length === 0) {
        console.log("No users with skills found, skipping match");
        return;
    }

    console.log(`Matching issue ${issue.title} to ${users.length} users`);


    for (const user of users) {

        const userProfile: UserProfile = {
            skills: user.skills ?? [],
            preferredLanguages: user.preferredLanguages ?? [],
        };

        const issueForMatching: IssueForMatching = {
            labels: issue.labels ?? [],
            aiSkillsRequired: issue.aiSkillsRequired ?? [],
            aiDifficulty: issue.aiDifficulty ?? "",
            createdAt: issue.createdAt,
            repo: {
                primaryLanguage: issue.repo.primaryLanguage ?? "",
            },
        };

        const score = scoreIssueForUser(userProfile, issueForMatching);

        if (score >= 40) {
            await prisma.recommendation.upsert({
                where: {
                    userId_issueId: {
                        userId: user.id,
                        issueId: issue.id,
                    },

                },
                update: {
                    score

                },
                create: {
                    userId: user.id,
                    issueId: issue.id,
                    score,

                }

            });

            console.log(`Recommended ${issue.title} to user ${user.id}: ${score}%`);

        }


    };

};

async function rematchUser(userId: string) {
    console.log(`[Rematch] rematch started for user ${userId}`);

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, skills: true, preferredLanguages: true },
    });

    if (!user) {
        console.log(`[Rematch] User ${userId} not found`);
        return;
    }

    if (user.skills.length === 0 && user.preferredLanguages.length === 0) {
        await prisma.recommendation.deleteMany({
            where: { userId: user.id },
        });
        await prisma.user.update({
            where: { id: userId },
            data: { lastMatchedAt: new Date() },
        });
        console.log(`[Rematch] rematch completed for user ${userId}: 0 recommendations (no skills or preferred languages)`);
        return;
    }

    const issues = await prisma.issue.findMany({
        where: { analyzedAt: { not: null }, status: "OPEN" },
        include: { repo: true },
    });

    const BATCH_SIZE = 20;
    const totalBatches = Math.ceil(issues.length / BATCH_SIZE) || 1;
    let totalWritten = 0;

    for (let i = 0; i < issues.length; i += BATCH_SIZE) {
        const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
        const batchIssues = issues.slice(i, i + BATCH_SIZE);

        console.log(`[Rematch] batch started ${batchNumber}/${totalBatches} (${batchIssues.length} issues)`);

        const toUpsert: { userId: string; issueId: string; score: number }[] = [];
        const toDeleteIds: string[] = [];

        for (const issue of batchIssues) {
            const score = scoreIssueForUser(
                {
                    skills: user.skills,
                    preferredLanguages: user.preferredLanguages,
                },
                {
                    labels: issue.labels,
                    aiSkillsRequired: issue.aiSkillsRequired,
                    aiDifficulty: issue.aiDifficulty ?? "",
                    createdAt: issue.createdAt,
                    repo: { primaryLanguage: issue.repo.primaryLanguage },
                }
            );

            if (score > 40) {
                toUpsert.push({ userId: user.id, issueId: issue.id, score });
            } else {
                toDeleteIds.push(issue.id);
            }
        }

        // Write batch to database immediately
        if (toDeleteIds.length > 0) {
            await prisma.recommendation.deleteMany({
                where: { userId: user.id, issueId: { in: toDeleteIds } },
            });
        }

        if (toUpsert.length > 0) {
            await Promise.all(
                toUpsert.map((r) =>
                    prisma.recommendation.upsert({
                        where: { userId_issueId: { userId: r.userId, issueId: r.issueId } },
                        update: { score: r.score },
                        create: r,
                    })
                )
            );
        }

        totalWritten += toUpsert.length;

        console.log(`[Rematch] number of recommendations written: ${toUpsert.length} (batch ${batchNumber}/${totalBatches})`);
        console.log(`[Rematch] database commit for batch ${batchNumber}/${totalBatches}`);
        console.log(`[Rematch] cache invalidated for batch ${batchNumber}/${totalBatches}`);
        console.log(`[Rematch] batch completed ${batchNumber}/${totalBatches}`);
    }

    await prisma.user.update({
        where: { id: userId },
        data: { lastMatchedAt: new Date() },
    });

    console.log(`[Rematch] rematch completed for user ${userId}. Total recommendations: ${totalWritten}`);
}


export const matchUserWorker = new Worker(
    "match-users",
    async (job) => {
        if (job.data.issueId) {
            await matchIssueToUsers(job.data.issueId as string);
            return;
        }

        if (job.data.userId) {
            console.log(`[Worker] Processing rematch job for user ${job.data.userId}`);
            await rematchUser(job.data.userId as string);
        }
    },
    {
        connection: redisConnection,
        concurrency: 3,
    }
);

matchUserWorker.on("completed", (job) => {
    console.log(`match job ${job.id} completed`);
});

matchUserWorker.on("failed", (job, err) => {
    console.error(`match job ${job?.id} failed:`, err.message);
});

matchUserWorker.on("error", (err) => {
    console.error("match worker error:", err.message);
});
