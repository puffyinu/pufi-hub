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

export interface WorldUserMetadata {
  username?: string;
  profilePictureUrl?: string;
}

function normalizeOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalized = value.trim();
  return normalized || undefined;
}

function normalizeProfilePictureUrl(value: unknown): string | undefined {
  const url = normalizeOptionalString(value);
  if (!url) {
    return undefined;
  }

  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && !parsed.username && !parsed.password
      ? parsed.href
      : undefined;
  } catch {
    return undefined;
  }
}

function isForWallet(
  user: { walletAddress?: string },
  walletAddress: string
): boolean {
  return user.walletAddress?.toLowerCase() === walletAddress.toLowerCase();
}

/**
 * Display-only World profile metadata. The SIWE-verified address remains the
 * canonical identity and is never derived from this response.
 */
export async function getWorldUserMetadata(
  walletAddress: string
): Promise<WorldUserMetadata> {
  let directoryUser: Awaited<ReturnType<typeof MiniKit.getUserByAddress>> | null = null;

  try {
    const result = await MiniKit.getUserByAddress(walletAddress);
    if (isForWallet(result, walletAddress)) {
      directoryUser = result;
    }
  } catch (error) {
    console.warn("[MINIKIT] Unable to resolve World user metadata", error);
  }

  const currentUser = isForWallet(MiniKit.user, walletAddress)
    ? MiniKit.user
    : undefined;

  return {
    username: normalizeOptionalString(
      directoryUser?.username ?? currentUser?.username
    ),
    profilePictureUrl: normalizeProfilePictureUrl(
      directoryUser?.profilePictureUrl ?? currentUser?.profilePictureUrl
    ),
  };
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
