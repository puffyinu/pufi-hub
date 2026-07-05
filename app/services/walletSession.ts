import { load, save, remove } from "@/app/services/storage";

export interface WalletState {
  connected: boolean;
  address: string | null;
  chainId: number | null;
  isVerified: boolean;
  nativeBalance: string;
  tokenBalance: string;
  tokenSymbol: string;
  tokenDecimals: number;
  transactionStatus: "idle" | "pending" | "success" | "error";
  loading: boolean;
  error: string | null;
}

const STORAGE_KEY = "pufi-wallet-session";
export const WALLET_SESSION_EVENT = "pufi-wallet-session-changed";

const DEFAULT_WALLET_STATE: WalletState = {
  connected: false,
  address: null,
  chainId: null,
  isVerified: false,
  nativeBalance: "0",
  tokenBalance: "0",
  tokenSymbol: "PUFI",
  tokenDecimals: 18,
  transactionStatus: "idle",
  loading: false,
  error: null,
};

function notifyWalletSessionChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(WALLET_SESSION_EVENT));
  }
}

let walletState: WalletState | null = null;

function ensureWalletState(): WalletState {
  if (walletState === null) {
    walletState = load<WalletState>(STORAGE_KEY) ?? DEFAULT_WALLET_STATE;
  }

  return walletState;
}

export function getWalletState(): WalletState {
  return ensureWalletState();
}

export function setWalletState(nextState: Partial<WalletState>): void {
  const currentState = ensureWalletState();
  walletState = {
    ...currentState,
    ...nextState,
  };

  save(STORAGE_KEY, walletState);
  notifyWalletSessionChanged();
}

export function resetWalletState(): void {
  walletState = { ...DEFAULT_WALLET_STATE };
  remove(STORAGE_KEY);
  notifyWalletSessionChanged();
}
