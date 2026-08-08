import { prisma } from "@/lib/prisma";

function statusDaAtividade(ativa: boolean, prazo: Date | null) {
  if (!ativa) return { label: "Fechada", classe: "bg-gray-100 text-gray-600" };
  if (prazo && prazo.getTime() < Date.now()) {
    return { label: "Prazo encerrado", classe: "bg-amber-100 text-amber-700" };
  }
  return { label: "Aberta", classe: "bg-green-100 text-green-700" };
}

export default async function ListaAtividadesPage() {
  const disciplinas = await prisma.disciplina.findMany({
    orderBy: { nome: "asc" },
    include: {
      atividades: {
        orderBy: { dataCriacao: "desc" },
        include: {
          _count: { select: { envios: true } },
        },
      },
    },
  });

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <h1 className="text-xl font-semibold">Atividades</h1>

      {disciplinas.length === 0 && (
        <p className="text-sm text-gray-500">
          Nenhuma disciplina cadastrada ainda. Rode{" "}
          <code className="rounded bg-gray-100 px-1">npm run db:seed</code>{" "}
          para criar as disciplinas iniciais.
        </p>
      )}

      {disciplinas.map((disciplina) => (
        <section key={disciplina.id} className="flex flex-col gap-3">
          <h2 className="text-base font-medium text-gray-800">
            {disciplina.nome}
          </h2>

          {disciplina.atividades.length === 0 ? (
            <p className="text-sm text-gray-500">
              Nenhuma atividade criada nesta disciplina ainda.
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-gray-200 rounded border border-gray-200">
              {disciplina.atividades.map((atividade) => {
                const status = statusDaAtividade(
                  atividade.ativa,
                  atividade.prazo,
                );
                return (
                  <li
                    key={atividade.id}
                    className="flex items-center justify-between gap-4 px-4 py-3"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium">
                        {atividade.titulo}
                      </span>
                      <span className="text-xs text-gray-500">
                        Criada em{" "}
                        {atividade.dataCriacao.toLocaleDateString("pt-BR")}
                        {atividade.prazo &&
                          ` · Prazo: ${atividade.prazo.toLocaleDateString("pt-BR")}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">
                        {atividade._count.envios}{" "}
                        {atividade._count.envios === 1
                          ? "resposta recebida"
                          : "respostas recebidas"}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.classe}`}
                      >
                        {status.label}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
