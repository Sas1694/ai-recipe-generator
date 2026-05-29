import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// In serverless (Vercel), each function instance processes one request at a time.
// Since we use Neon Pooler (connection pooling server-side), we only need 1
// connection per function to avoid exhausting the database connection limit.
// The pooler handles actual connection distribution to PostgreSQL.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1, // One connection per serverless function (pooler handles the rest)
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
