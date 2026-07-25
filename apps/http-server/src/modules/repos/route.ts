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

router.post("/", authMiddleware, async (req, res) => {

  const { fullName } = createRepoSchema.parse(req.body);

  if (!fullName || !fullName.includes("/")) {
    return res.status(400).json({ error: "fullName must be 'owner/repo'" });
  }

  try {

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

    // one-time poll
    await repoPollQueue.add("poll-repo", { repoId: repo.id }, { jobId: `${repo.id}-initial` });

    // poll after  every 5 minutes
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

router.get("/", async (req, res) => {
  const repos = await prisma.repo.findMany({ orderBy: { createdAt: "desc" } });
  res.json(repos);
});

export default router;