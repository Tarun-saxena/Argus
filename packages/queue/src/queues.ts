// packages/queue/src/queues.ts
import { Queue } from "bullmq";
import { redisConnection } from "./connection.js";

export { redisConnection };

export const repoPollQueue = new Queue("repo-poll", {
  connection: redisConnection,
});

export const aiAnalysisQueue = new Queue("ai-analysis", {
  connection: redisConnection,
});

