import { MiniKit } from "@worldcoin/minikit-js";
import type { MiniKitSendTransactionOptions } from "@worldcoin/minikit-js/commands";

export type TransactionStatus =
  | "idle"
  | "preparing"
  | "wallet_prompt"
  | "pending"
  | "confirmed"
  | "failed";

export interface TransactionResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export async function sendTransaction(
  options: MiniKitSendTransactionOptions
): Promise<TransactionResult> {
  try {
    await MiniKit.sendTransaction(options);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown transaction error.",
    };
  }
}
