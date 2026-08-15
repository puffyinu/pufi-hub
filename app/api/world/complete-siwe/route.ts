import { NextRequest, NextResponse } from "next/server";
import type { WalletAuthResult } from "@worldcoin/minikit-js/commands";
import { verifySiweMessage } from "@worldcoin/minikit-js/siwe";

const SIWE_NONCE_COOKIE = "pufi-siwe-nonce";

function invalidRequest(error: string): NextResponse {
  return NextResponse.json({ isValid: false, error }, { status: 400 });
}

function clearNonce(response: NextResponse): NextResponse {
  response.cookies.set(SIWE_NONCE_COOKIE, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/api/world",
    maxAge: 0,
  });
  return response;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      nonce?: string;
      payload?: WalletAuthResult;
    };
    const { nonce, payload } = body;
    const storedNonce = request.cookies.get(SIWE_NONCE_COOKIE)?.value;

    if (!nonce || !payload?.address || !payload.message || !payload.signature) {
      return invalidRequest("Missing SIWE authentication data.");
    }

    if (!storedNonce || nonce !== storedNonce) {
      return invalidRequest("Invalid or expired authentication nonce.");
    }

    const verification = await verifySiweMessage(
      payload,
      nonce,
      "Sign in to PUFI HUB"
    );

    if (!verification.isValid || !verification.siweMessageData.address) {
      return invalidRequest("Invalid wallet signature.");
    }

    return clearNonce(
      NextResponse.json({
        isValid: true,
        address: verification.siweMessageData.address,
      })
    );
  } catch (error) {
    console.error("[API /world/complete-siwe] SIWE verification failed:", error);
    return invalidRequest("Unable to verify wallet signature.");
  }
}
