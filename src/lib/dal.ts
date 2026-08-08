import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

/**
 * Verifica se há uma sessão de professora válida; redireciona para /login
 * caso contrário. Usar no início de páginas/Server Actions da área protegida.
 * `cache()` evita reler o cookie mais de uma vez por render.
 */
export const verifySession = cache(async () => {
  const session = await getSession();

  if (!session || session.role !== "professora") {
    redirect("/login");
  }

  return { isAuth: true as const };
});
