import crypto from "node:crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { isAuthConfigured } from "@/lib/auth";

function base64Url(input: Buffer) {
  return input.toString("base64url");
}

export async function GET(request: NextRequest) {
  if (!isAuthConfigured()) {
    return NextResponse.redirect(new URL("/admin/login?error=setup", request.url));
  }

  const state = base64Url(crypto.randomBytes(32));
  const nonce = base64Url(crypto.randomBytes(32));
  const verifier = base64Url(crypto.randomBytes(48));
  const challenge = base64Url(crypto.createHash("sha256").update(verifier).digest());
  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 10,
  };

  cookieStore.set("mg_oauth_state", state, cookieOptions);
  cookieStore.set("mg_oauth_nonce", nonce, cookieOptions);
  cookieStore.set("mg_oauth_verifier", verifier, cookieOptions);

  const callbackUrl = new URL("/api/auth/callback", request.nextUrl.origin).toString();
  const authorizeUrl = new URL("https://vercel.com/oauth/authorize");
  authorizeUrl.search = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_VERCEL_APP_CLIENT_ID!,
    redirect_uri: callbackUrl,
    response_type: "code",
    scope: "openid email profile",
    state,
    nonce,
    code_challenge: challenge,
    code_challenge_method: "S256",
  }).toString();

  return NextResponse.redirect(authorizeUrl);
}
