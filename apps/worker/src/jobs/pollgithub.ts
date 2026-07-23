import { Worker } from "bullmq";
import { repoPollQueue } from "@repo/queue";
import { redisConnection } from "@repo/queue";
import { prisma } from "@repo/db";
import axios from "axios";

async function pollRepo(repoId: string) {
  const repo = await prisma.repo.findUnique({ where: { id: repoId } });

  if (!repo) {
    console.error(`Repo ${repoId} not found in DB`);
    return;
  }

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  if (repo.etag) {
    headers["If-None-Match"] = repo.etag;
  }

  const res = await axios.get(
    `https://api.github.com/repos/${repo.fullName}/issues`,
    {
      params: { state: "open", per_page: 50 },
      headers,
      validateStatus: (s) => s === 200 || s === 304,
    }
  );

  if (res.status === 304) {
    console.log(`  → ${repo.fullName} unchanged, skipping`);
    return;
  }

  const issues = (res.data as any[]).filter((i) => !i.pull_request);

  for (const issue of issues) {
    await prisma.issue.upsert({
      where: { githubId: String(issue.id) },
      update: {
        title: issue.title,
        body: issue.body ?? "",
        labels: issue.labels.map((l: any) => l.name),
        url: issue.html_url,
        status: "OPEN",
      },
      create: {
        githubId: String(issue.id),
        repoId: repo.id,
        title: issue.title,
        body: issue.body ?? "",
        labels: issue.labels.map((l: any) => l.name),
        url: issue.html_url,
        status: "OPEN",
      },
    });
  }

  await prisma.repo.update({
    where: { id: repo.id },
    data: {
      lastPolledAt: new Date(),
      etag: res.headers.etag ?? null,
    },
  });

  console.log(`  → ${issues.length} issues synced for ${repo.fullName}`);
}

const worker = new Worker(
  "repo-poll",
  async (job) => {
    await pollRepo(job.data.repoId as string);
  },
  {
    connection: redisConnection,
    concurrency: 5,
  }
);

worker.on("completed", (job) => {
  console.log(`✓ Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`✗ Job ${job?.id} failed:`, err.message);
});