import { Router } from "express";
import authMiddleware from "../../middleware/requireAuth.js";
import { prisma, Prisma } from "@repo/db";
import { z } from "zod";

const router = Router();

const exploreQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .refine((val) => !isNaN(val) && val > 0, { message: "Limit must be a positive integer" }),
  search: z.string().optional(),
  skill: z.string().optional(),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  sortBy: z.enum(["matchScore", "difficulty", "createdAt", "estimatedTime", "recent"]).default("matchScore"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
  trackedOnly: z
    .string()
    .optional()
    .transform((val) => val === "true")
    .default(false),
});

router.get("/explore", authMiddleware, async (req, res) => {
  try {
    const parsed = exploreQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0]?.message || "Invalid query parameters" });
    }

    const { cursor, limit, search, skill, difficulty, sortBy, sortDir, trackedOnly } = parsed.data;

    const cursorRecord = cursor
      ? await prisma.issue.findUnique({
          where: { id: cursor },
          include: {
            recommendations: {
              where: { userId: req.userId as string },
            },
          },
        })
      : null;

    if (cursor && !cursorRecord) {
      return res.status(400).json({ error: "Invalid cursor" });
    }

    const conditions: Prisma.Sql[] = [Prisma.sql`i.status = 'OPEN'::"IssueStatus"`];

    if (search) {
      conditions.push(
        Prisma.sql`(i.title ILIKE ${`%${search}%`} OR repo.full_name ILIKE ${`%${search}%`})`
      );
    }

    if (skill) {
      conditions.push(Prisma.sql`${skill} = ANY(i.ai_skills_required)`);
    }

    if (difficulty) {
      conditions.push(Prisma.sql`i.ai_difficulty = ${difficulty}::"Difficulty"`);
    }

    if (trackedOnly) {
      conditions.push(Prisma.sql`r.user_id IS NOT NULL`);
    }

    if (cursorRecord) {
      const isDesc = sortDir === "desc";
      if (sortBy === "matchScore") {
        const cursorScore = cursorRecord.recommendations[0]?.score ?? 0;
        conditions.push(
          isDesc
            ? Prisma.sql`(COALESCE(r.score, 0) < ${cursorScore} OR (COALESCE(r.score, 0) = ${cursorScore} AND i.id > ${cursor}))`
            : Prisma.sql`(COALESCE(r.score, 0) > ${cursorScore} OR (COALESCE(r.score, 0) = ${cursorScore} AND i.id > ${cursor}))`
        );
      } else if (sortBy === "createdAt") {
        const cursorCreatedAt = cursorRecord.createdAt;
        conditions.push(
          isDesc
            ? Prisma.sql`(i.created_at < ${cursorCreatedAt} OR (i.created_at = ${cursorCreatedAt} AND i.id > ${cursor}))`
            : Prisma.sql`(i.created_at > ${cursorCreatedAt} OR (i.created_at = ${cursorCreatedAt} AND i.id > ${cursor}))`
        );
      } else if (sortBy === "recent") {
        const cursorGithubCreatedAt = cursorRecord.githubCreatedAt || cursorRecord.createdAt;
        conditions.push(
          isDesc
            ? Prisma.sql`(COALESCE(i.github_created_at, i.created_at) < ${cursorGithubCreatedAt} OR (COALESCE(i.github_created_at, i.created_at) = ${cursorGithubCreatedAt} AND i.id > ${cursor}))`
            : Prisma.sql`(COALESCE(i.github_created_at, i.created_at) > ${cursorGithubCreatedAt} OR (COALESCE(i.github_created_at, i.created_at) = ${cursorGithubCreatedAt} AND i.id > ${cursor}))`
        );
      } else if (sortBy === "difficulty") {
        const difficultyOrder = (diff: string | null) => {
          if (diff === 'BEGINNER') return 1;
          if (diff === 'INTERMEDIATE') return 2;
          if (diff === 'ADVANCED') return 3;
          return 0;
        };
        const cursorDiff = difficultyOrder(cursorRecord.aiDifficulty);
        const diffSql = Prisma.sql`CASE i.ai_difficulty WHEN 'BEGINNER' THEN 1 WHEN 'INTERMEDIATE' THEN 2 WHEN 'ADVANCED' THEN 3 ELSE 0 END`;
        conditions.push(
          isDesc
            ? Prisma.sql`(${diffSql} < ${cursorDiff} OR (${diffSql} = ${cursorDiff} AND i.id > ${cursor}))`
            : Prisma.sql`(${diffSql} > ${cursorDiff} OR (${diffSql} = ${cursorDiff} AND i.id > ${cursor}))`
        );
      } else if (sortBy === "estimatedTime") {
        const cursorEstimatedTime = cursorRecord.aiEstimatedTime ?? "";
        conditions.push(
          isDesc
            ? Prisma.sql`(COALESCE(i.ai_estimated_time, '') < ${cursorEstimatedTime} OR (COALESCE(i.ai_estimated_time, '') = ${cursorEstimatedTime} AND i.id > ${cursor}))`
            : Prisma.sql`(COALESCE(i.ai_estimated_time, '') > ${cursorEstimatedTime} OR (COALESCE(i.ai_estimated_time, '') = ${cursorEstimatedTime} AND i.id > ${cursor}))`
        );
      }
    }

    const whereClause = conditions.length > 0
      ? Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}`
      : Prisma.empty;

    const orderDirSql = sortDir === "asc" ? Prisma.sql`ASC` : Prisma.sql`DESC`;
    const orderByClause = {
      matchScore: Prisma.sql`COALESCE(r.score, 0) ${orderDirSql}, i.id ASC`,
      createdAt: Prisma.sql`i.created_at ${orderDirSql}, i.id ASC`,
      recent: Prisma.sql`COALESCE(i.github_created_at, i.created_at) ${orderDirSql}, i.id ASC`,
      difficulty: Prisma.sql`CASE i.ai_difficulty WHEN 'BEGINNER' THEN 1 WHEN 'INTERMEDIATE' THEN 2 WHEN 'ADVANCED' THEN 3 ELSE 0 END ${orderDirSql}, i.id ASC`,
      estimatedTime: Prisma.sql`COALESCE(i.ai_estimated_time, '') ${orderDirSql}, i.id ASC`,
    }[sortBy];

    const query = Prisma.sql`
      SELECT 
        i.id,
        i.github_id AS "githubId",
        i.repo_id AS "repoId",
        i.title,
        i.body,
        i.labels,
        i.status,
        i.url,
        i.ai_difficulty AS "aiDifficulty",
        i.ai_summary AS "aiSummary",
        i.ai_relevant_files AS "aiRelevantFiles",
        i.ai_skills_required AS "aiSkillsRequired",
        i.ai_estimated_time AS "aiEstimatedTime",
        i.analyzed_at AS "analyzedAt",
        i.github_created_at AS "githubCreatedAt",
        i.created_at AS "createdAt",
        i.updated_at AS "updatedAt",
        r.state AS "matchState",
        COALESCE(r.score, 0) AS "matchScore",
        repo.id AS "repoDbId",
        repo.name AS "repoName",
        repo.full_name AS "repoFullName",
        repo.stars AS "repoStars",
        repo.primary_language AS "repoPrimaryLanguage"
      FROM issues i
      LEFT JOIN recommendations r ON r.issue_id = i.id AND r.user_id = ${req.userId as string}
      LEFT JOIN repos repo ON repo.id = i.repo_id
      ${whereClause}
      ORDER BY ${orderByClause}
      LIMIT ${limit + 1}
    `;

    const rows = await prisma.$queryRaw<any[]>(query);

    const items = rows.slice(0, limit).map((row) => ({
      id: row.id,
      githubId: row.githubId,
      repoId: row.repoId,
      title: row.title,
      body: row.body,
      labels: row.labels || [],
      status: row.status,
      url: row.url,
      aiDifficulty: row.aiDifficulty,
      aiSummary: row.aiSummary,
      aiRelevantFiles: row.aiRelevantFiles || [],
      aiSkillsRequired: row.aiSkillsRequired || [],
      aiEstimatedTime: row.aiEstimatedTime,
      analyzedAt: row.analyzedAt,
      githubCreatedAt: row.githubCreatedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      matchState: row.matchState || null,
      score: row.matchScore ? parseFloat(row.matchScore) : 0,
      repo: {
        id: row.repoDbId,
        name: row.repoName,
        fullName: row.repoFullName,
        stars: row.repoStars,
        primaryLanguage: row.repoPrimaryLanguage,
      },
    }));

    const hasMore = rows.length > limit;
    const nextCursor = hasMore ? items[items.length - 1]?.id : null;

    return res.json({
      items,
      nextCursor,
      hasMore,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch explore issues" });
  }
});

export default router;
