import { NextResponse } from "next/server";

const SIWE_NONCE_COOKIE = "pufi-siwe-nonce";
const SIWE_NONCE_TTL_SECONDS = 5 * 60;

function createNonce(length = 32): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint32Array(length));

  return Array.from(values, (value) => characters[value % characters.length]).join("");
}

export async function GET() {
  const nonce = createNonce();
  const response = NextResponse.json({ nonce });

  response.cookies.set(SIWE_NONCE_COOKIE, nonce, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/api/world",
    maxAge: SIWE_NONCE_TTL_SECONDS,
  });

  return response;
}
