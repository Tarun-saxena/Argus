import "dotenv/config";
import { Redis } from "ioredis";

export const redisConnection = new Redis(
  process.env.REDIS_URL || "redis://localhost:6380",
  {
    maxRetriesPerRequest: null,
  }
);