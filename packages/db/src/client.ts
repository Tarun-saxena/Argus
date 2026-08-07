import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Make sure dotenv is loaded before importing @repo/db."
    );
  }

  const poolMax = process.env.DB_POOL_MAX
    ? Number.parseInt(process.env.DB_POOL_MAX, 10)
    : 5;

  if (Number.isNaN(poolMax) || poolMax <= 0) {
    throw new Error(`Invalid DB_POOL_MAX value: "${process.env.DB_POOL_MAX}"`);
  }

  const adapter = new PrismaPg({
    connectionString,
    max: poolMax,
  });

  return new PrismaClient({
    adapter,
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Always store on globalThis to ensure singleton pattern across process / HMR / imports
globalForPrisma.prisma = prisma;