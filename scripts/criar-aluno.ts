// Cadastra um ou mais alunos na turma, gerando uma senha (PIN de 6 dígitos)
// individual para cada um. A senha só é exibida aqui, uma vez — anote/imprima
// para entregar ao aluno, pois depois só é possível redefinir, não recuperar.
//
// Uso: npm run aluno:novo -- "Turma X" "Nome do Aluno 1" "Nome do Aluno 2" ...

import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { createDbAdapter } from "../src/lib/db-adapter";

const [turma, ...nomes] = process.argv.slice(2);

if (!turma || nomes.length === 0) {
  console.error(
    'Uso: npm run aluno:novo -- "Turma X" "Nome do Aluno 1" "Nome do Aluno 2" ...',
  );
  process.exit(1);
}

function gerarPin() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6 dígitos
}

const prisma = new PrismaClient({ adapter: createDbAdapter() });

async function main() {
  const linhas: string[] = [];

  for (const nome of nomes) {
    const pin = gerarPin();
    const senhaHash = bcrypt.hashSync(pin, 10);
    await prisma.aluno.create({ data: { nome, turma, senhaHash } });
    linhas.push(`${nome.padEnd(30)} ${pin}`);
  }

  console.log(
    "\nSenhas geradas — anote e entregue aos alunos (não ficam salvas em texto puro em lugar nenhum):\n",
  );
  console.log(linhas.join("\n"));
  console.log("");
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
