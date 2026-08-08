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
console.log(hash);
