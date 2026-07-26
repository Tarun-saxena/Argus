import { Router } from "express";
import authMiddleware from "../../middleware/requireAuth.js";
import { prisma } from "@repo/db";
import z from "zod";


const router = Router();

const updateProfileSchema = z.object({
    skills: z.array(z.string()).optional(),
    preferredLanguages: z.array(z.string()).optional(),
    interests: z.array(z.string()).optional(),
})

router.patch("/me", authMiddleware, async (req, res) => {
    try {
        const parsed = updateProfileSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                error: "Invalid profile data",
            });
        }

        const { skills, preferredLanguages, interests } = parsed.data;


        const user = await prisma.user.update({
            where: {
                id: req.userId as string
            },
            select: {
                username: true,
                email: true,
                skills: true,
                preferredLanguages: true,
                interests: true,
            },
            data: {
                ...(skills !== undefined && { skills }),
                ...(preferredLanguages !== undefined && { preferredLanguages }),
                ...(interests !== undefined && { interests }),
            }

        });

        return res.json(user);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to update profile" });

    }
})


export default router;



