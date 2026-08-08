import { PrismaClient } from "@/generated/prisma/client";
import { createDbAdapter } from "@/lib/db-adapter";

// Evita recriar o client (e reabrir a conexão) a cada hot-reload em dev.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter: createDbAdapter() });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
