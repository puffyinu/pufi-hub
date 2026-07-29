"use client";

import { MiniKit } from "@worldcoin/minikit-js";

export interface WalletAuthPayload {
  status: "success" | "error";
  address?: string;
  message?: string;
  signature?: string;
}

export function getMiniKit() {
  return MiniKit;
}

export function isMiniKitInstalled(): boolean {
  return MiniKit.isInstalled();
}

export function isMiniKitReady(): boolean {
  return MiniKit.isInstalled();
}

export async function walletAuth(nonce: string): Promise<WalletAuthPayload> {
  if (!MiniKit.isInstalled()) {
    console.warn("[MINIKIT] Not installed");
    return { status: "error", message: "MiniKit not installed" };
  }

  console.log("[MINIKIT-1] walletAuth() called, nonce =", nonce);

  try {
    const result = await MiniKit.walletAuth({
      nonce,
      statement: "Sign in to PUFI HUB",
      expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    console.log("[MINIKIT-2] result =", result);

    // v2 shape: { executedWith: "minikit"|"wagmi", data: WalletAuthResult }
    // WalletAuthResult = { address: string }
    const address = result?.data?.address;

    if (address) {
      return {
        status: "success",
        address,
      };
    }

    return { status: "error", message: "No address returned" };

  } catch (error) {
    console.error("[MINIKIT-ERROR]", error);
    return { status: "error", message: "walletAuth exception" };
  }
}

export async function sendMiniKitTransaction(
  options: Parameters<typeof MiniKit.sendTransaction>[0]
) {
  if (!MiniKit.isInstalled()) {
    throw new Error("MiniKit not installed");
  }
  return MiniKit.sendTransaction(options);
}
