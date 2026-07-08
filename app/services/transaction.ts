
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

export async function sendTransaction(): Promise<TransactionResult> {
  return {
    success: false,
    error: "Transaction flow not implemented yet.",
  };
}
