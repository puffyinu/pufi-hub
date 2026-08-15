import { login } from "@/app/runtime/auth";
import {
  resetWalletState,
  setWalletState,
} from "@/app/services/walletSession";

export interface WalletResult {
  connected: boolean;
  address?: string;
}

export async function connectWallet(): Promise<WalletResult> {
  try {
    const result = await login(false);
    const address = result?.address;

    if (address) {
      setWalletState({
        connected: true,
        address,
        loading: false,
        error: null,
      });
      return {
        connected: true,
        address,
      };
    }

    resetWalletState();
    return {
      connected: false,
    };
  } catch (err) {
    console.error(err);
    setWalletState({
      connected: false,
      loading: false,
      error: "Wallet authentication failed.",
    });
    return {
      connected: false,
    };
  }
}
