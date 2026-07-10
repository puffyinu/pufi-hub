"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getSession } from "@/app/services/session";
import {
  getWalletState,
  setWalletState,
  WALLET_SESSION_EVENT,
  type WalletState as WalletSessionState,
} from "@/app/services/walletSession";

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

function toContextWalletState(state: WalletSessionState): WalletState {
  return {
    connected: state.connected,
    address: state.address ?? undefined,
    balance: Number(state.nativeBalance) || 0,
  };
}

export function WalletProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [wallet, setWalletValue] = useState<WalletState>(() =>
    toContextWalletState(getWalletState())
  );

  function setWallet(nextWallet: WalletState): void {
    setWalletValue(nextWallet);

    const current = getWalletState();

    setWalletState({
      ...current,
      connected: nextWallet.connected,
      address: nextWallet.address ?? null,
      nativeBalance: String(nextWallet.balance),
    });
  }

  useEffect(() => {
    function syncWallet() {
      setWalletValue(toContextWalletState(getWalletState()));
    }

    const currentSession = getSession();

    if (currentSession?.isAuthenticated && currentSession.user?.walletAddress) {
      const existingState = getWalletState();

      if (!existingState.connected || existingState.address !== currentSession.user.walletAddress) {
        setWalletState({
          connected: true,
          address: currentSession.user.walletAddress,
          isVerified: currentSession.user?.verified ?? false,
          chainId: existingState.chainId,
          nativeBalance: existingState.nativeBalance,
          tokenBalance: existingState.tokenBalance,
          tokenSymbol: existingState.tokenSymbol,
          tokenDecimals: existingState.tokenDecimals,
          transactionStatus: existingState.transactionStatus,
          loading: existingState.loading,
          error: existingState.error,
        });
      }
    }

    syncWallet();
    window.addEventListener(WALLET_SESSION_EVENT, syncWallet);

    return () => {
      window.removeEventListener(WALLET_SESSION_EVENT, syncWallet);
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