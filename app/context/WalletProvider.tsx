"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

export interface WalletState {
  connected: boolean;
  address?: string;
  balance: number;
}

interface WalletContextType {
  wallet: WalletState;
  setWallet: (wallet: WalletState) => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    balance: 0,
  });

  return (
    <WalletContext.Provider
      value={{
        wallet,
        setWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWalletContext() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error(
      "useWalletContext must be used inside WalletProvider"
    );
  }

  return context;
}