export interface WalletState {
  installed: boolean;
  connected: boolean;
  address: string | null;
  balance: string;
}

export interface WalletContextType extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
}