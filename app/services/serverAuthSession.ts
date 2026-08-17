import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE_NAME = "pufi-auth";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

interface ServerAuthSession {
  walletAddress: string;
  authenticatedAt: string;
  expiresAt: string;
}

function getSecret(): string {
  const secret = process.env.PUFI_AUTH_SECRET;

  if (!secret) {
    throw new Error("PUFI_AUTH_SECRET is not configured.");
  }

  return secret;
}

function base64UrlEncode(value: string): string {
  return Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecode(value: string): string {
  return Buffer.from(
    value.replace(/-/g, "+").replace(/_/g, "/"),
    "base64"
  ).toString("utf8");
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function safeCompare(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return timingSafeEqual(aBuffer, bBuffer);
}

export function createServerAuthToken(
  walletAddress: string
): {
  token: string;
  session: ServerAuthSession;
  maxAge: number;
} {
  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + SESSION_TTL_SECONDS * 1000
  );

  const session: ServerAuthSession = {
    walletAddress: walletAddress.toLowerCase(),
    authenticatedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
  };

  const payload = base64UrlEncode(
    JSON.stringify(session)
  );

  const signature = sign(payload);

  return {
    token: `${payload}.${signature}`,
    session,
    maxAge: SESSION_TTL_SECONDS,
  };
}

export function verifyServerAuthToken(
  token: string
): ServerAuthSession | null {
  try {
    const [payload, signature] = token.split(".");

    if (!payload || !signature) {
      return null;
    }

    const expectedSignature = sign(payload);

    if (!safeCompare(signature, expectedSignature)) {
      return null;
    }

    const session = JSON.parse(
      base64UrlDecode(payload)
    ) as ServerAuthSession;

    if (
      !session.walletAddress ||
      !session.expiresAt
    ) {
      return null;
    }

    const expiresAt = new Date(
      session.expiresAt
    ).getTime();

    if (!Number.isFinite(expiresAt)) {
      return null;
    }

    if (expiresAt <= Date.now()) {
      return null;
    }

    return {
      ...session,
      walletAddress: session.walletAddress.toLowerCase(),
    };
  } catch (error) {
    console.error(
      "[SERVER-AUTH] Invalid session token:",
      error
    );

    return null;
  }
}

export function getServerAuthCookieName(): string {
  return COOKIE_NAME;
}

export function getServerAuthCookieOptions(
  maxAge: number
) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export function getServerAuthSessionFromRequest(
  request: Request
): ServerAuthSession | null {
  const cookieHeader =
    request.headers.get("cookie");

  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader
    .split(";")
    .map((part) => part.trim());

  const authCookie = cookies.find(
    (cookie) =>
      cookie.startsWith(`${COOKIE_NAME}=`)
  );

  if (!authCookie) {
    return null;
  }

  const token = authCookie.slice(
    COOKIE_NAME.length + 1
  );

  if (!token) {
    return null;
  }

  return verifyServerAuthToken(token);
}

export type { ServerAuthSession };
