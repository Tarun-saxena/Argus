import { Router } from "express";
import authMiddleware from "../../middleware/requireAuth.js";
import { prisma } from "@repo/db";
import { repoPollQueue } from "@repo/queue";
import axios from "axios";
import { z } from "zod";

const createRepoSchema = z.object({
  fullName: z.string().regex(/^[^/]+\/[^/]+$/, "Must be owner/repo"),
});

const router = Router();

// POST /repos — track a repo for the current user
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { fullName } = createRepoSchema.parse(req.body);

    const ghRes = await axios.get(`https://api.github.com/repos/${fullName}`);
    const gh = ghRes.data;

    const repo = await prisma.repo.upsert({
      where: { githubId: String(gh.id) },
      update: {
        stars: gh.stargazers_count,
        topics: gh.topics ?? [],
        primaryLanguage: gh.language,
      },
      create: {
        githubId: String(gh.id),
        name: gh.name,
        fullName: gh.full_name,
        stars: gh.stargazers_count,
        topics: gh.topics ?? [],
        primaryLanguage: gh.language,
      },
    });

    // Check if user is already tracking this repository
    const existingTracking = await prisma.trackedRepo.findUnique({
      where: { userId_repoId: { userId: req.userId!, repoId: repo.id } },
    });
    if (existingTracking) {
      return res.status(400).json({ error: "Repository is already tracked." });
    }

    await prisma.trackedRepo.create({
      data: { userId: req.userId!, repoId: repo.id },
    });

    // enqueue poll jobs
    await repoPollQueue.add("poll-repo", { repoId: repo.id }, { jobId: `${repo.id}-initial` });
    await repoPollQueue.add(
      "poll-repo",
      { repoId: repo.id },
      {
        repeat: { every: 5 * 60 * 1000 },
        jobId: `recurring-${repo.id}`,
      }
    );

    res.status(201).json(repo);
  } catch (err: any) {
    if (err.response?.status === 404) {
      return res.status(404).json({ error: "Repo not found on GitHub" });
    }
    console.error(err);
    res.status(500).json({ error: "Failed to add repo" });
  }
});

// GET /repos — only repos tracked by the current user
router.get("/", authMiddleware, async (req, res) => {
  const tracked = await prisma.trackedRepo.findMany({
    where: { userId: req.userId! },
    include: { repo: true },
    orderBy: { createdAt: "desc" },
  });

  res.json(tracked.map((t) => t.repo));
});

// DELETE /repos/:repoId — stop tracking a repo (doesn't delete the global Repo/Issue data)
router.delete("/:repoId", authMiddleware, async (req, res) => {
  const { repoId } = req.params;

  try {
    await prisma.trackedRepo.delete({
      where: { userId_repoId: { userId: req.userId!, repoId: repoId as string } },
    });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: "Repo not tracked by you" });
  }
});

export default router;