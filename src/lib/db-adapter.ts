import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaLibSql } from "@prisma/adapter-libsql";

/**
 * Escolhe o driver do banco conforme o ambiente:
 * - Se TURSO_DATABASE_URL estiver definido, usa Turso (SQLite hospedado,
 *   necessário em produção na Vercel — o filesystem lá é efêmero).
 * - Caso contrário, usa SQLite local em arquivo (dev.db), para desenvolvimento.
 */
export function createDbAdapter() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;

  if (tursoUrl) {
    return new PrismaLibSql({
      url: tursoUrl,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }

  return new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  });
}
