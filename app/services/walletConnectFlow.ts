import { login, markSessionVerified } from "@/app/runtime/auth";
import { verifyHuman } from "@/app/services/worldIdVerification";

export interface ConnectAndVerifyResult {
  success: boolean;
  address?: string;
  error?: string;
}

async function checkWalletVerified(address: string): Promise<boolean> {
  try {
    const response = await fetch("/api/world/wallet-status", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ address }),
    });
    const data = await response.json();
    return response.ok && data.success && data.verified === true;
  } catch (error) {
    console.error("[WALLET-STATUS-CHECK-ERROR]", error);
    return false;
  }
}

export async function connectAndVerifyWallet(): Promise<ConnectAndVerifyResult> {
  const loginResult = await login(false);
  if (!loginResult?.address) {
    return {
      success: false,
      error: "Connection failed. Please authorize the wallet request in World App.",
    };
  }

  const { address } = loginResult;

  const alreadyVerified = await checkWalletVerified(address);

  if (!alreadyVerified) {
    const verification = await verifyHuman(address);
    if (!verification.success) {
      return {
        success: false,
        error: verification.error ?? "World ID verification failed.",
      };
    }
  }

  markSessionVerified(address, true);

  return { success: true, address };
}
