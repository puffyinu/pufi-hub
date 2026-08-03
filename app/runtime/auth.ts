import type { WalletAuthPayload } from "@/app/runtime/minikitManager";
import { generateAlphanumericNonce } from "@/app/runtime/nonce";
import { clearSession, hasSession, setSession } from "@/app/services/session";
import type { WorldSession } from "@/app/types/world";
import { resetWalletState, setWalletState } from "@/app/services/walletSession";
import { walletAuth, isMiniKitInstalled } from "@/app/runtime/minikitManager";

export async function login(
  verifiedHuman: boolean
): Promise<{
  address: string;
  result: WalletAuthPayload;
} | null> {
  const nonce = generateAlphanumericNonce();
  console.log("========== BUILD 010 DEBUG ==========");
  console.log("[AUTH-1] login()");
  console.log("[AUTH-2] nonce =", nonce);
  console.log("[AUTH-2b] verifiedHuman =", verifiedHuman);
  if (!isMiniKitInstalled()) {
    console.warn("[AUTH] MiniKit not installed — skipping walletAuth");
    console.warn("[AUTH] Are you running inside World App?");
    return null;
  }
  try {
    console.log("[AUTH-3] BEFORE walletAuth");
    const result = await walletAuth(nonce);
    console.log("[AUTH-4] AFTER walletAuth");
    console.log("[AUTH-5] result =", result);
    if (result.status === "success" && result.address) {
      console.log("[AUTH-6] SUCCESS");
      const session: WorldSession = {
        isAuthenticated: true,
        user: {
          walletAddress: result.address,
          verified: verifiedHuman,
        },
      };
      setSession(session);
      setWalletState({
        connected: true,
        address: result.address,
        isVerified: verifiedHuman,
        loading: false,
        error: null,
      });
      return {
        address: result.address,
        result,
      };
    }
    console.log("[AUTH-7] No address returned — status:", result.status);
    return null;
  } catch (error) {
    console.error("[AUTH-ERROR]", error);
    return null;
  }
}

export function markSessionVerified(address: string, verified: boolean): void {
  const session: WorldSession = {
    isAuthenticated: true,
    user: {
      walletAddress: address,
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
