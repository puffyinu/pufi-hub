import type { WalletAuthPayload } from "@/app/runtime/minikitManager";
import {
  getWorldUserMetadata,
  walletAuth,
  isMiniKitInstalled,
} from "@/app/runtime/minikitManager";
import { clearSession, getSession, hasSession, setSession } from "@/app/services/session";
import { resetWalletState, setWalletState } from "@/app/services/walletSession";
import type { WorldSession } from "@/app/types/world";

async function getSiweNonce(): Promise<string | null> {
  const response = await fetch("/api/world/nonce", {
    credentials: "same-origin",
  });
  const body = (await response.json()) as { nonce?: string };

  return response.ok && typeof body.nonce === "string" ? body.nonce : null;
}

async function verifyWalletAuth(
  result: WalletAuthPayload,
  nonce: string
): Promise<string | null> {
  if (!result.payload) {
    return null;
  }

  const response = await fetch("/api/world/complete-siwe", {
    method: "POST",
    credentials: "same-origin",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ payload: result.payload, nonce }),
  });
  const body = (await response.json()) as {
    isValid?: boolean;
    address?: string;
  };

  return response.ok && body.isValid && typeof body.address === "string"
    ? body.address
    : null;
}

export async function login(
  verifiedHuman: boolean
): Promise<{
  address: string;
  result: WalletAuthPayload;
} | null> {
  if (!isMiniKitInstalled()) {
    return null;
  }

  try {
    const nonce = await getSiweNonce();
    if (!nonce) {
      return null;
    }

    const result = await walletAuth(nonce);
    const address =
      result.status === "success" ? await verifyWalletAuth(result, nonce) : null;

    if (!address) {
      return null;
    }

    const worldUser = await getWorldUserMetadata(address);

    const session: WorldSession = {
      isAuthenticated: true,
      user: {
        walletAddress: address,
        ...worldUser,
        verified: verifiedHuman,
      },
    };
    setSession(session);
    setWalletState({
      connected: true,
      address,
      isVerified: verifiedHuman,
      loading: false,
      error: null,
    });

    return { address, result };
  } catch (error) {
    console.error("[AUTH-ERROR]", error);
    return null;
  }
}

export function markSessionVerified(address: string, verified: boolean): void {
  const existingUser = getSession()?.user;
  const identityMetadata =
    existingUser?.walletAddress.toLowerCase() === address.toLowerCase()
      ? {
          username: existingUser.username,
          profilePictureUrl: existingUser.profilePictureUrl,
        }
      : {};

  const session: WorldSession = {
    isAuthenticated: true,
    user: {
      walletAddress: address,
      ...identityMetadata,
      verified,
    },
  };
  setSession(session);
  setWalletState({
    connected: true,
    address,
    isVerified: verified,
    loading: false,
    error: null,
  });
}

export function logout() {
  clearSession();
  resetWalletState();
}

export function isLoggedIn() {
  return hasSession();
}
