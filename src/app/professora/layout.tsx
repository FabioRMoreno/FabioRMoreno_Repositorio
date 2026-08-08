import Link from "next/link";
import { verifySession } from "@/lib/dal";
import { logout } from "./actions";

export default async function ProfessoraLayout({
  children,
}: LayoutProps<"/professora">) {
  // Checagem definitiva de sessão (a otimista já roda em src/proxy.ts).
  await verifySession();

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <Link href="/professora" className="font-semibold">
          AVA — Área da professora
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            Sair
          </button>
        </form>
      </header>
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
