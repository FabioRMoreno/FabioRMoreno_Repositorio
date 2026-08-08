import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-semibold">AVA — Sistema de Questionários</h1>
      <p className="max-w-sm text-sm text-gray-500">
        As atividades são acessadas por um link específico enviado aos
        alunos. A professora acessa pela área administrativa.
      </p>
      <Link
        href="/login"
        className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
      >
        Entrar como professora
      </Link>
    </main>
  );
}
