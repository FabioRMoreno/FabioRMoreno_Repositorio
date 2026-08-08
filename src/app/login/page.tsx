import { login } from "./actions";

export default async function LoginPage(props: PageProps<"/login">) {
  const searchParams = await props.searchParams;
  const temErro = searchParams.erro === "1";

  return (
    <main className="flex flex-1 flex-col items-center justify-center p-8">
      <form action={login} className="w-full max-w-xs space-y-4">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Área da professora</h1>
          <p className="text-sm text-gray-500">Sistema de questionários</p>
        </div>

        {temErro && (
          <p
            role="alert"
            className="rounded bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            Senha incorreta. Tente novamente.
          </p>
        )}

        <div className="space-y-1">
          <label htmlFor="senha" className="block text-sm font-medium">
            Senha
          </label>
          <input
            id="senha"
            name="senha"
            type="password"
            required
            autoFocus
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
