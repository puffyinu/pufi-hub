import { getMiniKit } from "./minikit";

import type {
  MiniKitSendTransactionOptions,
} from "@worldcoin/minikit-js/commands";

export async function walletAuth(
  nonce: string
) {
  return getMiniKit().walletAuth({
    nonce,
  });
}

export async function sendMiniKitTransaction(
  options: MiniKitSendTransactionOptions
) {
  return getMiniKit().sendTransaction(
    options
  );
}

export function isMiniKitReady(): boolean {
  return getMiniKit().isInstalled();
}