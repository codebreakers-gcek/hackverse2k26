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

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
