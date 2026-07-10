import { load, save, remove } from "@/app/services/storage";

export type TransactionStatus =
  | "idle"
  | "preparing"
  | "wallet_prompt"
  | "pending"
  | "confirmed"
  | "failed";

export interface TransactionState {
  status: TransactionStatus;
  transactionId: string | null;
  from: string | null;
  timestamp: string | null;
  loading: boolean;
  error: string | null;
}

const STORAGE_KEY = "pufi-transaction-session";
export const TRANSACTION_SESSION_EVENT = "pufi-transaction-session-changed";

const DEFAULT_TRANSACTION_STATE: TransactionState = {
  status: "idle",
  transactionId: null,
  from: null,
  timestamp: null,
  loading: false,
  error: null,
};

function notifyTransactionSessionChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(TRANSACTION_SESSION_EVENT));
  }
}

let transactionState: TransactionState | null = null;

function ensureTransactionState(): TransactionState {
  if (transactionState === null) {
    transactionState =
      load<TransactionState>(STORAGE_KEY) ?? DEFAULT_TRANSACTION_STATE;
  }

  return transactionState;
}

export function getTransactionState(): TransactionState {
  return ensureTransactionState();
}

export function setTransactionState(nextState: Partial<TransactionState>): void {
  const currentState = ensureTransactionState();
  transactionState = {
    ...currentState,
    ...nextState,
  };

  save(STORAGE_KEY, transactionState);
  notifyTransactionSessionChanged();
}

export function resetTransactionState(): void {
  transactionState = { ...DEFAULT_TRANSACTION_STATE };
  remove(STORAGE_KEY);
  notifyTransactionSessionChanged();
}
