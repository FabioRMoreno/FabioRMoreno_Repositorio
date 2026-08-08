// Cria as disciplinas iniciais (v1: 2 disciplinas fixas).
// IMPORTANTE: troque os nomes abaixo pelas disciplinas reais antes de usar
// em produção — estes são apenas placeholders de exemplo.
//
// Rodar com: npm run db:seed

import { PrismaClient } from "../src/generated/prisma/client";
import { createDbAdapter } from "../src/lib/db-adapter";

const prisma = new PrismaClient({ adapter: createDbAdapter() });

const DISCIPLINAS = ["Disciplina 1 (edite em prisma/seed.ts)", "Disciplina 2 (edite em prisma/seed.ts)"];

async function main() {
  for (const nome of DISCIPLINAS) {
    const existente = await prisma.disciplina.findFirst({ where: { nome } });
    if (existente) {
      console.log(`Já existe: ${nome}`);
      continue;
    }
    await prisma.disciplina.create({ data: { nome } });
    console.log(`Criada: ${nome}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (erro) => {
    console.error(erro);
    await prisma.$disconnect();
    process.exit(1);
  });
