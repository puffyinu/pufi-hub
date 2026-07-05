"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getSession, SESSION_EVENT } from "@/app/services/session";

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
  const session = getSession();
  const [wallet, setWallet] = useState<WalletState>({
    connected: session?.isAuthenticated ?? false,
    address: session?.user?.walletAddress,
    balance: 0,
  });

  useEffect(() => {
    function syncWallet() {
      const currentSession = getSession();

      if (currentSession) {
        setWallet({
          connected: currentSession.isAuthenticated,
          address: currentSession.user?.walletAddress,
          balance: 0,
        });
      } else {
        setWallet({
          connected: false,
          address: undefined,
          balance: 0,
        });
      }
    }

    window.addEventListener(SESSION_EVENT, syncWallet);

    return () => {
      window.removeEventListener(SESSION_EVENT, syncWallet);
    };
  }, []);

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