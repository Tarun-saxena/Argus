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
    state: z.enum(TRIAGE_STATES).optional(),
});

const patchSchema = z.object({
    state: z.enum(TRIAGE_STATES),
});

// GET /recommendations
// Query params: difficulty, issueType, state
// - With ?state=X  → return only recommendations in that state
// - Without ?state → return everything EXCEPT IGNORED (default feed)
router.get("/", authMiddleware, async (req, res) => {
    try {
        const parsed = filterSchema.safeParse(req.query);

        if (!parsed.success) {
            return res.status(400).json({ error: "Invalid filters" });
        }

        const { difficulty, issueType, state } = parsed.data;

        // Build the state filter:
        // - Explicit state requested  → match that exact state
        // - No state param            → exclude IGNORED only (show INBOX + BOOKMARKED + CLAIMED in feed)
        const stateFilter: Prisma.RecommendationWhereInput["state"] = state
            ? state
            : { not: "IGNORED" as TriageState };

        const recommendations = await prisma.recommendation.findMany({
            where: {
                userId: req.userId as string,
                state: stateFilter,
                issue: {
                    status: "OPEN",
                    ...(difficulty && { aiDifficulty: difficulty }),
                    ...(issueType && {
                        labels: { has: `type: ${issueType.toLowerCase()}` },
                    }),
                },
            },
            include: {
                issue: {
                    include: { repo: true },
                },
            },
            orderBy: [
                { score: "desc" },
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

        // Update is scoped to { id AND userId } — if either doesn't match,
        // Prisma throws P2025 (record not found), handled in the catch block.
        const updated = await prisma.recommendation.update({
            where: {
                id,
                userId: req.userId as string,   // ownership enforced here
            },
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