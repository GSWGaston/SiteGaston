import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify, SignJWT } from "jose";

const SESSION_COOKIE = "mg_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

export type AdminSession = {
  sub: string;
  email: string;
  name?: string;
  username?: string;
  picture?: string;
};

export function isAuthConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_VERCEL_APP_CLIENT_ID &&
    process.env.VERCEL_APP_CLIENT_SECRET &&
    process.env.ADMIN_EMAILS &&
    process.env.SESSION_SECRET,
  );
}

function getSessionKey() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET precisa ter pelo menos 32 caracteres.");
  }
  return new TextEncoder().encode(secret);
}

function allowedAdminEmails() {
  return new Set(
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isAllowedAdmin(email: string) {
  return allowedAdminEmails().has(email.trim().toLowerCase());
}

export async function createAdminSession(session: AdminSession) {
  const token = await new SignJWT({
    email: session.email,
    name: session.name,
    username: session.username,
    picture: session.picture,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSessionKey());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export const getAdminSession = cache(async (): Promise<AdminSession | null> => {
  if (!isAuthConfigured()) return null;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSessionKey(), { algorithms: ["HS256"] });
    if (!payload.sub || typeof payload.email !== "string" || !isAllowedAdmin(payload.email)) return null;

    return {
      sub: payload.sub,
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : undefined,
      username: typeof payload.username === "string" ? payload.username : undefined,
      picture: typeof payload.picture === "string" ? payload.picture : undefined,
    };
  } catch {
    return null;
  }
});

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
