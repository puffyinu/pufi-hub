import { MiniKit } from "@worldcoin/minikit-js";
import { clearSession, hasSession, setSession } from "@/app/services/session";
import type { WorldSession } from "@/app/types/world";

export async function login() {
  const nonce = crypto.randomUUID();

  try {
    const result = await MiniKit.walletAuth({
      nonce,
    });

    if (result?.data?.address) {
      const session: WorldSession = {
        isAuthenticated: true,
        user: {
          walletAddress: result.data.address,
          verified: true,
        },
      };

      setSession(session);

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
}

export function isLoggedIn() {
  return hasSession();
}
