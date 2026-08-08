import { Router } from "express";
import authMiddleware from "../../middleware/requireAuth.js";
import { prisma, Prisma } from "@repo/db";
import z from "zod";

const router = Router();

const TRIAGE_STATES = ["INBOX", "BOOKMARKED", "CLAIMED", "IGNORED"] as const;
type TriageState = (typeof TRIAGE_STATES)[number];

const filterSchema = z.object({
    difficulty: z
        .enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"])
        .optional(),
    issueType: z.string().optional(),
    state: z.string().optional(),
});

const patchSchema = z.object({
    state: z.enum(TRIAGE_STATES),
});

// GET /recommendations
// Query params: difficulty, issueType, state
// - state=INBOX (or omitted) → return untriaged INBOX recommendations (default Feed)
// - state=ALL                → return all recommendations across all triage states (Explore view)
// - state=BOOKMARKED/CLAIMED → return only recommendations in that state
router.get("/", authMiddleware, async (req, res) => {
    try {
        const parsed = filterSchema.safeParse(req.query);

        if (!parsed.success) {
            return res.status(400).json({ error: "Invalid filters" });
        }

        const { difficulty, issueType, state } = parsed.data;

        // state=ALL -> no state filter; state=INBOX or omitted -> state: "INBOX"
        const targetState = state ?? "INBOX";
        const stateWhere = targetState === "ALL" || targetState === "all"
            ? undefined
            : (targetState as TriageState);

        const recommendations = await prisma.recommendation.findMany({
            where: {
                userId: req.userId as string,
                ...(stateWhere && { state: stateWhere }),
                issue: {
                    status: "OPEN",
                    ...(difficulty && { aiDifficulty: difficulty }),
                    ...(issueType && {
                        labels: { has: `type: ${issueType.toLowerCase()}` },
                    }),
                    repo: {
                        trackedBy: {
                            some: {
                                userId: req.userId as string,
                            },
                        },
                    },
                },
            },
            include: {
                issue: {
                    include: { repo: true },
                },
            },
            orderBy: [
                { score: "desc" },
                { issue: { githubCreatedAt: "desc" } },
                { issue: { createdAt: "desc" } },
                { issue: { githubId: "desc" } },
            ],
        });

        return res.json({
            count: recommendations.length,
            recommendations: recommendations.map((r) => ({
                id: r.id,
                score: r.score,
                state: r.state,
                issue: r.issue,
            })),
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch recommendations" });
    }
});

// PATCH /recommendations/:id
// Body: { state: "INBOX" | "BOOKMARKED" | "CLAIMED" | "IGNORED" }
// Updates the triage state, scoped to the authenticated user.
// Ownership is enforced inside the WHERE clause — no separate lookup needed.
router.patch("/:id", authMiddleware, async (req, res) => {
    try {
        const id = req.params.id as string;

        const parsed = patchSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                error: "Invalid state. Must be one of: INBOX, BOOKMARKED, CLAIMED, IGNORED",
            });
        }

        const { state } = parsed.data;

        // First verify recommendation exists and belongs to the authenticated user
        const existing = await prisma.recommendation.findFirst({
            where: {
                id,
                userId: req.userId as string,
            },
        });

        if (!existing) {
            return res.status(404).json({ error: "Recommendation not found or access denied" });
        }

        const updated = await prisma.recommendation.update({
            where: { id },
            data: { state },
            select: { id: true, state: true, score: true },
        });

        return res.json(updated);
    } catch (err) {
        // P2025 = "Record to update not found" — either wrong id or wrong owner
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            return res.status(404).json({ error: "Recommendation not found or access denied" });
        }
        console.error(err);
        res.status(500).json({ error: "Failed to update recommendation" });
    }
});

export default router;