"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createSession } from "@/lib/session";

export async function login(formData: FormData) {
  const senha = formData.get("senha");
  const hash = process.env.PROFESSORA_PASSWORD_HASH;

  if (!hash) {
    console.error(
      "PROFESSORA_PASSWORD_HASH não está definido no .env — login sempre falhará.",
    );
    redirect("/login?erro=1");
  }

  if (typeof senha !== "string" || senha.length === 0) {
    redirect("/login?erro=1");
  }

  const senhaValida = await bcrypt.compare(senha, hash);

  if (!senhaValida) {
    redirect("/login?erro=1");
  }

  await createSession();
  redirect("/professora");
}
