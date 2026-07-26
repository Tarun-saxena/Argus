import { Router } from "express";
import authMiddleware from "../../middleware/requireAuth.js";
import { prisma } from "@repo/db";
import z from "zod";

const router = Router();

const filterSchema = z.object({
    difficulty: z
        .enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"])
        .optional(),

    issueType: z.string().optional(),
});

router.get("/", authMiddleware, async (req, res) => {

    try {
        const parsed = filterSchema.safeParse(req.query);


        if (!parsed.success) {
            return res.status(400).json({
                error: "Invalid filters",
            });
        }

        const { difficulty, issueType } = parsed.data;

        const recommendations = await prisma.recommendation.findMany({
            where: {
                userId: req.userId as string,
                issue: {
                    status: "OPEN",
                    ...(difficulty && {
                        aiDifficulty: difficulty,
                    }),
                    ...(issueType && {
                        labels: { has: `type: ${issueType.toLowerCase()}` },
                    }),

                }

            },
            include: {
                issue: {
                    include: {
                        repo: true,
                    },
                },
            },
            orderBy: { score: "desc" },

        })



        return res.json({
            count: recommendations.length,
            recommendations: recommendations.map((r) => ({
                id: r.id,
                score: r.score,
                issue: r.issue,
            }))
        })


    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch recommendations" });

    }
})



export default router;