#!/usr/bin/env node
// Gera o hash bcrypt da senha da professora, para colar em PROFESSORA_PASSWORD_HASH no .env.
// Uso: node scripts/hash-password.mjs "minha-senha"

import bcrypt from "bcryptjs";

const senha = process.argv[2];

if (!senha) {
  console.error('Uso: node scripts/hash-password.mjs "minha-senha"');
  process.exit(1);
}

const hash = bcrypt.hashSync(senha, 10);

// O Next.js expande variáveis com "$" dentro do .env (ex: $VARIAVEL), o que
// corrompe hashes bcrypt se colados sem escapar. Por isso já devolvemos aqui
// o valor pronto para colar em PROFESSORA_PASSWORD_HASH no .env.
const hashEscapado = hash.replaceAll("$", "\\$");

console.log("Hash gerado:", hash);
console.log("\nCole isto no .env (já escapado para o Next.js):");
console.log(`PROFESSORA_PASSWORD_HASH="${hashEscapado}"`);
