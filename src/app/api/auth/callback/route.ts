import { cookies } from "next/headers";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { createAdminSession, isAllowedAdmin, isAuthConfigured } from "@/lib/auth";

type TokenResponse = {
  access_token: string;
  id_token: string;
  expires_in: number;
};

const vercelJwks = createRemoteJWKSet(new URL("https://vercel.com/.well-known/jwks"));

function loginError(request: NextRequest, code: string) {
  return NextResponse.redirect(new URL(`/admin/login?error=${code}`, request.url));
}

export async function GET(request: NextRequest) {
  if (!isAuthConfigured()) return loginError(request, "setup");

  const error = request.nextUrl.searchParams.get("error");
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const cookieStore = await cookies();
  const storedState = cookieStore.get("mg_oauth_state")?.value;
  const nonce = cookieStore.get("mg_oauth_nonce")?.value;
  const verifier = cookieStore.get("mg_oauth_verifier")?.value;

  cookieStore.delete("mg_oauth_state");
  cookieStore.delete("mg_oauth_nonce");
  cookieStore.delete("mg_oauth_verifier");

  if (error || !code) return loginError(request, "cancelled");
  if (!state || !storedState || state !== storedState || !nonce || !verifier) return loginError(request, "invalid");

  const callbackUrl = new URL("/api/auth/callback", request.nextUrl.origin).toString();
  const tokenResponse = await fetch("https://api.vercel.com/login/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.NEXT_PUBLIC_VERCEL_APP_CLIENT_ID!,
      client_secret: process.env.VERCEL_APP_CLIENT_SECRET!,
      code,
      code_verifier: verifier,
      redirect_uri: callbackUrl,
    }),
    cache: "no-store",
  });

  if (!tokenResponse.ok) return loginError(request, "exchange");
  const tokens = (await tokenResponse.json()) as TokenResponse;

  try {
    const { payload } = await jwtVerify(tokens.id_token, vercelJwks, {
      issuer: "https://vercel.com",
      audience: process.env.NEXT_PUBLIC_VERCEL_APP_CLIENT_ID!,
    });

    if (payload.nonce !== nonce || typeof payload.email !== "string" || !isAllowedAdmin(payload.email) || !payload.sub) {
      return loginError(request, "forbidden");
    }

    await createAdminSession({
      sub: payload.sub,
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : undefined,
      username: typeof payload.preferred_username === "string" ? payload.preferred_username : undefined,
      picture: typeof payload.picture === "string" ? payload.picture : undefined,
    });

    return NextResponse.redirect(new URL("/admin", request.url));
  } catch {
    return loginError(request, "token");
  }
}
