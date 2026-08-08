# AVA — Sistema de Questionários (Múltipla Escolha)

Sistema web para uma professora aplicar atividades de múltipla escolha para
uma turma (até 15 alunos), em duas disciplinas. Os alunos respondem por
link, a correção é automática, e todos os envios ficam registrados de forma
permanente para eventual auditoria da coordenação da escola.

Ver as instruções completas do projeto (escopo, telas, requisitos) no
documento fornecido no início do projeto.

## Stack

- **Next.js 16** (App Router) — frontend + backend (API/Server Actions) no mesmo projeto
- **Prisma 7** + **SQLite** — arquivo local (`@prisma/adapter-better-sqlite3`) em dev, [Turso](https://turso.tech) (`@prisma/adapter-libsql`) em produção — ver [`src/lib/db-adapter.ts`](./src/lib/db-adapter.ts)
- **bcryptjs** — hash da senha da professora (nunca fica em texto puro)
- **Tailwind CSS** — estilização

## Modelo de dados

Definido em [`prisma/schema.prisma`](./prisma/schema.prisma):

- `Disciplina` — id, nome
- `Aluno` — id, nome, turma
- `Atividade` — id, título, disciplina, data de criação, prazo (opcional), ativa
- `Questao` — id, atividade, enunciado, ordem
- `Alternativa` — id, questão, texto, é correta
- `Resposta` — id, atividade, aluno, questão, alternativa escolhida, data de envio (1 por questão/aluno/atividade)
- `Envio` — id, atividade, aluno, nota final, data de envio, finalizado (1 por aluno/atividade — bloqueia reenvio)

**Importante:** registros de `Resposta` e `Envio` nunca devem ser apagados
ou sobrescritos — são o histórico de auditoria da coordenação.

## Configuração

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Copie o arquivo de exemplo de variáveis de ambiente:

   ```bash
   cp .env.example .env
   ```

3. Gere o hash da senha da professora e cole em `PROFESSORA_PASSWORD_HASH` no `.env`:

   ```bash
   node scripts/hash-password.mjs "sua-senha-aqui"
   ```

   O script já imprime o valor com os `$` escapados (`\$`) — cole exatamente
   o que ele mostrar. O Next.js expande `$algo` dentro do `.env`, então um
   hash bcrypt colado sem escapar quebra o login silenciosamente.

4. Gere um valor aleatório para `SESSION_SECRET` no `.env` (usado para assinar o cookie de sessão).

5. Aplique as migrations do banco (cria o arquivo `dev.db`):

   ```bash
   npx prisma migrate dev
   ```

6. Rode o seed para criar as 2 disciplinas iniciais (**edite os nomes em
   `prisma/seed.ts`** antes de rodar — os que estão lá são só placeholders):

   ```bash
   npm run db:seed
   ```

## Rodando em desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Deploy (Vercel + Turso)

O filesystem da Vercel é efêmero — o arquivo `dev.db` local não sobrevive
entre deploys/execuções. Por isso, em produção o projeto usa o
[Turso](https://turso.tech) (SQLite hospedado, com backup). A troca é
automática: `src/lib/db-adapter.ts` usa Turso se `TURSO_DATABASE_URL`
estiver definido, senão cai para o SQLite local — o resto do código
(queries Prisma) não muda.

### 1. Criar o banco no Turso

```bash
curl -sSfL https://get.tur.so/install.sh | bash   # instala o CLI do Turso
turso auth signup                                  # ou: turso auth login
turso db create sistema-ava

turso db show sistema-ava --url        # -> TURSO_DATABASE_URL
turso db tokens create sistema-ava     # -> TURSO_AUTH_TOKEN
```

### 2. Aplicar o schema no Turso

O `prisma migrate deploy` não fala o protocolo do Turso diretamente — a
forma simples é rodar o SQL da migration direto pelo CLI do Turso:

```bash
turso db shell sistema-ava < prisma/migrations/20260808203336_init/migration.sql
```

(se no futuro houver mais migrations, rode cada `migration.sql` na ordem)

### 3. Rodar o seed contra o Turso

Defina `TURSO_DATABASE_URL` e `TURSO_AUTH_TOKEN` temporariamente no seu
`.env` local (ou exporte na sessão do terminal) e rode:

```bash
npm run db:seed
```

### 4. Deploy na Vercel

1. Em [vercel.com](https://vercel.com), "Add New… → Project" e importe o
   repositório `FabioRMoreno/FabioRMoreno_Repositorio` (branch com o código
   mais recente). A Vercel detecta o Next.js automaticamente.
2. Em "Environment Variables", adicione:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `SESSION_SECRET`
   - `PROFESSORA_PASSWORD_HASH` — **cole o hash puro, sem escapar os `$`**.
     A regra de escapar `\$` vale só para arquivos `.env` lidos em disco; o
     painel da Vercel injeta a variável diretamente, sem essa expansão.
3. Deploy. A Vercel te dá uma URL pública (ex: `sistema-ava.vercel.app`).

## Scripts úteis

- `npm run dev` — servidor de desenvolvimento
- `npm run build` — build de produção
- `npm run lint` — lint
- `npm run db:seed` — cria as disciplinas iniciais (edite `prisma/seed.ts` primeiro)
- `npx prisma studio` — interface visual para inspecionar o banco
- `npx prisma migrate dev --name <descrição>` — criar uma nova migration após alterar o schema

## Status

- [x] Estrutura inicial do projeto (Next.js + Prisma + SQLite + modelos de dados)
- [x] Login da professora e listagem de atividades
- [ ] Criação de atividade com questões de múltipla escolha
- [ ] Tela pública do aluno com correção automática
- [ ] Tela de resultados da professora + exportação CSV
- [x] Preparação para deploy (Vercel + Turso) — código pronto; falta você criar
      a conta/banco no Turso e conectar o repo na Vercel (ver seção "Deploy" acima)
