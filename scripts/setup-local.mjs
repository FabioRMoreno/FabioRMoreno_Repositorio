#!/usr/bin/env node
// Prepara o .env local automaticamente na primeira vez que alguém roda o
// projeto: cria o arquivo a partir do .env.example, gera um SESSION_SECRET
// aleatório e um hash de senha padrão (só se ainda não houver um definido).
//
// Uso: npm run setup

import { existsSync, readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";

const ENV_PATH = ".env";
const DEFAULT_PASSWORD = "professora123";

if (!existsSync(ENV_PATH)) {
  copyFileSync(".env.example", ENV_PATH);
  console.log("Criado .env a partir de .env.example");
}

let env = readFileSync(ENV_PATH, "utf8");

function getVar(source, key) {
  const match = source.match(new RegExp(`^${key}="?([^"\n]*)"?$`, "m"));
  return match?.[1] ?? "";
}

function setVar(source, key, value) {
  const linha = `${key}="${value}"`;
  const re = new RegExp(`^${key}=.*$`, "m");
  return re.test(source) ? source.replace(re, linha) : `${source}\n${linha}\n`;
}

let alterado = false;

if (!getVar(env, "SESSION_SECRET")) {
  env = setVar(env, "SESSION_SECRET", randomBytes(32).toString("base64"));
  alterado = true;
  console.log("Gerado SESSION_SECRET aleatório.");
}

if (!getVar(env, "PROFESSORA_PASSWORD_HASH")) {
  // O Next.js expande "$algo" dentro do .env, então o hash bcrypt (cheio de
  // "$") precisa ser gravado já escapado.
  const hashEscapado = bcrypt.hashSync(DEFAULT_PASSWORD, 10).replaceAll("$", "\\$");
  env = setVar(env, "PROFESSORA_PASSWORD_HASH", hashEscapado);
  alterado = true;
  console.log(`\nSenha padrão da professora definida: "${DEFAULT_PASSWORD}"`);
  console.log(
    'Para trocar depois: node scripts/hash-password.mjs "nova-senha" e cole o resultado no .env\n',
  );
}

if (alterado) {
  writeFileSync(ENV_PATH, env);
}

console.log(".env pronto. Aplicando migrations e seed...");
