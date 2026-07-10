import {
  walletAuth,
  isMiniKitReady,
} from "@/app/runtime/minikitManager";

export interface WalletResult {
  connected: boolean;
  address?: string;
}

export async function connectWallet(): Promise<WalletResult> {
  if (!isMiniKitReady()) {
    return {
      connected: false,
    };
  }

  try {
    const result =
      await walletAuth(
        crypto.randomUUID()
      );

    if (result.data.address) {
      return {
        connected: true,
        address: result.data.address,
      };
    }

    return {
      connected: false,
    };
  } catch (err) {
    console.error(err);

    return {
      connected: false,
    };
  }
}