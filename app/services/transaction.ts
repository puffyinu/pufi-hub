import {
  sendMiniKitTransaction,
} from "@/app/runtime/minikitManager";

import type {
  MiniKitSendTransactionOptions,
} from "@worldcoin/minikit-js/commands";

export interface TransactionResult {
  success: boolean;
  transactionId?: string;
  status?: string;
  from?: string;
  timestamp?: string;
  error?: string;
}

export type TransactionStatus =
  | "idle"
  | "preparing"
  | "wallet_prompt"
  | "pending"
  | "confirmed"
  | "failed";

export async function sendTransaction(
  options: MiniKitSendTransactionOptions
): Promise<TransactionResult> {
  try {
    const result =
      await sendMiniKitTransaction(
        options
      );

    return {
      success: true,
      transactionId:
        result.data.userOpHash,
      status: result.data.status,
      from: result.data.from,
      timestamp: result.data.timestamp,
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