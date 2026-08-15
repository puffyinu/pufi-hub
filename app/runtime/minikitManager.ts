"use client";

import { MiniKit } from "@worldcoin/minikit-js";
import type { WalletAuthResult } from "@worldcoin/minikit-js/commands";

export interface WalletAuthPayload {
  status: "success" | "error";
  address?: string;
  message?: string;
  signature?: string;
  payload?: WalletAuthResult;
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

  try {
    const result = await MiniKit.walletAuth({
      nonce,
      statement: "Sign in to PUFI HUB",
      expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const payload = result?.data;
    const address = payload?.address;

    if (address && payload?.message && payload.signature) {
      return {
        status: "success",
        address,
        message: payload.message,
        signature: payload.signature,
        payload,
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
