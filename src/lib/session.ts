import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "ava_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

function getSecretKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET não está definido no .env");
  }
  return new TextEncoder().encode(secret);
}

type SessionPayload = {
  role: "professora";
};

async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

async function decrypt(session: string | undefined = "") {
  if (!session) return null;
  try {
    const { payload } = await jwtVerify<SessionPayload>(
      session,
      getSecretKey(),
      { algorithms: ["HS256"] },
    );
    return payload;
  } catch {
    return null;
  }
}

/** Cria a sessão da professora após login bem-sucedido. */
export async function createSession() {
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  const session = await encrypt({ role: "professora" });
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

/** Lê e valida a sessão a partir do cookie (uso em Server Components/Actions). */
export async function getSession() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME)?.value;
  return decrypt(cookie);
}

/** Encerra a sessão (logout). */
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export { COOKIE_NAME as SESSION_COOKIE_NAME, decrypt as decryptSession };
