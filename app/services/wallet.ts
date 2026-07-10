import {
  walletAuth,
  isMiniKitReady,
} from "@/app/runtime/minikitManager";

import {
  resetWalletState,
  setWalletState,
} from "@/app/services/walletSession";

export interface WalletResult {
  connected: boolean;
  address?: string;
}

export async function connectWallet(): Promise<WalletResult> {
  if (!isMiniKitReady()) {
    resetWalletState();

    return {
      connected: false,
    };
  }

  try {
    const result = await walletAuth(
      crypto.randomUUID()
    );

    const address = result.data.address;

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