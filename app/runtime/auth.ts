import { walletAuth } from "@/app/runtime/minikitManager";
import { clearSession, hasSession, setSession } from "@/app/services/session";
import type { WorldSession } from "@/app/types/world";
import { setWalletState, resetWalletState } from "@/app/services/walletSession";

export async function login() {
  const nonce = crypto.randomUUID();

  try {
    console.log("[AUTH-1] login()");

console.log("[AUTH-2] before walletAuth");

  const result = await walletAuth(nonce);
  
console.log("[AUTH-3] walletAuth returned", result);

console.log("[AUTH-4] login success");

  if (result?.data?.address) {
    const session: WorldSession = {
      isAuthenticated: true,
      user: {
        walletAddress: result.data.address,
        verified: true,
      },
    };

    setSession(session);

setWalletState({
  connected: true,
  address: result.data.address,
  isVerified: true,
  loading: false,
  error: null,
});

return {
  address: result.data.address,
  result,
    };
  }
} catch {
  return null;
}

return null;
}

export function logout() {
  clearSession();
  resetWalletState();
}

export function isLoggedIn() {
  return hasSession();
}
