import { PrismaLibSql } from "@prisma/adapter-libsql";

/**
 * Escolhe a conexão do banco conforme o ambiente:
 * - Se TURSO_DATABASE_URL estiver definido, conecta no Turso (SQLite
 *   hospedado, necessário em produção na Vercel — o filesystem lá é efêmero).
 * - Caso contrário, usa um arquivo SQLite local (dev.db).
 *
 * Os dois casos usam o mesmo driver (@prisma/adapter-libsql / @libsql/client)
 * — ele já vem com binários pré-compilados para Windows/Mac/Linux, então
 * não exige Python nem toolchain de C++ instalado na máquina (diferente do
 * better-sqlite3, que exigia compilar na hora do `npm install`).
 */
export function createDbAdapter() {
  const tursoUrl = process.env.TURSO_DATABASE_URL;

  if (tursoUrl) {
    return new PrismaLibSql({
      url: tursoUrl,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }

  return new PrismaLibSql({
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  });
}
