import { setSession } from "@/app/services/session";
import { setWalletState } from "@/app/services/walletSession";

export function createDevelopmentSession() {
  const address = "0xDEV000000000000000000000000000000000001";

  setSession({
    isAuthenticated: true,
    user: {
      walletAddress: address,
      verified: true,
    },
  });

  setWalletState({
    connected: true,
    address,
    isVerified: true,
    loading: false,
    error: null,
  });
}