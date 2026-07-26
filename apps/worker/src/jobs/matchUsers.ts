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

export const matchUsersWorker = new Worker(
    "match-users",
    async (job) => {
        await matchIssueToUsers(job.data.issueId as string)

    }, {
    connection: redisConnection,
    concurrency: 3
}
);

matchUsersWorker.on("completed", (job) => {
    console.log(`Match job ${job.id} completed`);
});

matchUsersWorker.on("failed", (job, err) => {
    console.error(`Match job ${job?.id} failed:`, err.message);
});

matchUsersWorker.on("error", (err) => {
    console.error("Match worker error:", err.message);
});