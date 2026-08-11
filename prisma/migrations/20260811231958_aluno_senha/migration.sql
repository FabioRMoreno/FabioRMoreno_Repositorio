/*
  Warnings:

  - Added the required column `senhaHash` to the `alunos` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_alunos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "turma" TEXT NOT NULL,
    "senhaHash" TEXT NOT NULL
);
INSERT INTO "new_alunos" ("id", "nome", "turma") SELECT "id", "nome", "turma" FROM "alunos";
DROP TABLE "alunos";
ALTER TABLE "new_alunos" RENAME TO "alunos";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
