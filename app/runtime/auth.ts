import type { WalletAuthPayload } from "@/app/runtime/minikitManager";
import { clearSession, hasSession, setSession } from "@/app/services/session";
import type { WorldSession } from "@/app/types/world";
import { resetWalletState, setWalletState } from "@/app/services/walletSession";
import { walletAuth, isMiniKitInstalled } from "@/app/runtime/minikitManager";

export async function login(): Promise<{
  address: string;
  result: WalletAuthPayload;
} | null> {
  const nonce = crypto.randomUUID();

  console.log("========== BUILD 009 DEBUG ==========");
    console.log("[AUTH-1] login()");
  console.log("[AUTH-2] nonce =", nonce);

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
          verified: true,
        },
      };

      setSession(session);

      setWalletState({
        connected: true,
        address: result.address,
        isVerified: true,
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

export function logout() {
  clearSession();
  resetWalletState();
}

export function isLoggedIn() {
  return hasSession();
}