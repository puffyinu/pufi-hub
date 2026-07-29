import { sendMiniKitTransaction } from "@/app/runtime/minikitManager";
import type { MiniKitSendTransactionOptions } from "@worldcoin/minikit-js/commands";

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

interface SendTransactionData {
  userOpHash?: string;
  status?: string;
  from?: string;
  timestamp?: string;
}

export async function sendTransaction(
  options: MiniKitSendTransactionOptions
): Promise<TransactionResult> {
  try {
    const result = await sendMiniKitTransaction(options);

    const data = result?.data as SendTransactionData | undefined;

    return {
      success: true,
      transactionId: data?.userOpHash,
      status: data?.status,
      from: data?.from,
      timestamp: data?.timestamp,
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
