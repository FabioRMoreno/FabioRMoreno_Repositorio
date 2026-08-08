-- CreateTable
CREATE TABLE "disciplinas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "alunos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "turma" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "atividades" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "disciplinaId" TEXT NOT NULL,
    "dataCriacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "prazo" DATETIME,
    "ativa" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "atividades_disciplinaId_fkey" FOREIGN KEY ("disciplinaId") REFERENCES "disciplinas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "questoes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "atividadeId" TEXT NOT NULL,
    "enunciado" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    CONSTRAINT "questoes_atividadeId_fkey" FOREIGN KEY ("atividadeId") REFERENCES "atividades" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "alternativas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "questaoId" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "correta" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "alternativas_questaoId_fkey" FOREIGN KEY ("questaoId") REFERENCES "questoes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "respostas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "atividadeId" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "questaoId" TEXT NOT NULL,
    "alternativaEscolhidaId" TEXT NOT NULL,
    "dataEnvio" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "respostas_atividadeId_fkey" FOREIGN KEY ("atividadeId") REFERENCES "atividades" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "respostas_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "alunos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "respostas_questaoId_fkey" FOREIGN KEY ("questaoId") REFERENCES "questoes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "respostas_alternativaEscolhidaId_fkey" FOREIGN KEY ("alternativaEscolhidaId") REFERENCES "alternativas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "envios" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "atividadeId" TEXT NOT NULL,
    "alunoId" TEXT NOT NULL,
    "notaFinal" REAL NOT NULL,
    "dataEnvio" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finalizado" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "envios_atividadeId_fkey" FOREIGN KEY ("atividadeId") REFERENCES "atividades" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "envios_alunoId_fkey" FOREIGN KEY ("alunoId") REFERENCES "alunos" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "respostas_atividadeId_alunoId_questaoId_key" ON "respostas"("atividadeId", "alunoId", "questaoId");

-- CreateIndex
CREATE UNIQUE INDEX "envios_atividadeId_alunoId_key" ON "envios"("atividadeId", "alunoId");
