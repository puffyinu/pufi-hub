import { MiniKit } from "@worldcoin/minikit-js";

export interface WalletResult {
  connected: boolean;
  address?: string;
}

export async function connectWallet(): Promise<WalletResult> {
  if (!MiniKit.isInstalled()) {
    return {
      connected: false,
    };
  }

  try {
    const result = await MiniKit.walletAuth({
      nonce: crypto.randomUUID(),
    });

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