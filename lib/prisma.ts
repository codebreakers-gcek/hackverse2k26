import { Pool, PoolConfig } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

function getPoolConfig(): PoolConfig {
  const urlStr =
    process.env.DATABASE_URL ||
    process.env.DIRECT_URL ||
    "postgresql://postgres:postgres@localhost:5432/postgres";

  try {
    const parsed = new URL(urlStr);
    const isSupabase =
      parsed.host.includes("supabase.com") ||
      parsed.host.includes("supabase.co");

    return {
      user: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      host: parsed.hostname,
      port: parsed.port ? parseInt(parsed.port, 10) : 5432,
      database: parsed.pathname.replace(/^\//, "") || "postgres",
      ssl: isSupabase ? false : undefined,
    };
  } catch {
    return { connectionString: urlStr };
  }
}

const pool = new Pool(getPoolConfig());
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPrismaClient(): PrismaClient {
  // If cached client has scannerPinSession model delegate, return it
  if (globalForPrisma.prisma && "scannerPinSession" in (globalForPrisma.prisma as any)) {
    return globalForPrisma.prisma;
  }
  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
  globalForPrisma.prisma = client;
  return client;
}

// Resilient proxy to always resolve the active Prisma Client with all models
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol) {
    const client = getPrismaClient();
    const value = (client as any)[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});
