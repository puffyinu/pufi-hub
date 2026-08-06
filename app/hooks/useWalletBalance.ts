"use client";

import { useState, useEffect, useCallback } from "react";

import {
  getWalletBalance,
  BalanceResult,
} from "../services/walletBalance";

import { useWalletContext } from "../context/WalletProvider";
import { WALLET_SESSION_EVENT } from "../services/walletSession";

export function useWalletBalance() {
  const { wallet } = useWalletContext();

  const [balance, setBalance] = useState<BalanceResult>({
    wld: "0.00",
    pufi: "0.00",
  });

  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!wallet.address) {
      setBalance({
        wld: "0.00",
        pufi: "0.00",
      });
      return;
    }

    setLoading(true);

    try {
      const result = await getWalletBalance(wallet.address);
      setBalance(result);
    } catch (error) {
      console.error("useWalletBalance: Refresh failed", error);
    } finally {
      setLoading(false);
    }
  }, [wallet.address]);

  // Initial load and auto-refresh when address changes
  useEffect(() => {
    const timer = setTimeout(() => {
      refresh();
    }, 0);
    return () => clearTimeout(timer);
  }, [refresh]);

  // Listen for global wallet session changes (e.g. after a transaction)
  useEffect(() => {
    const handleRefresh = () => {
      refresh();
    };
    window.addEventListener(WALLET_SESSION_EVENT, handleRefresh);
    return () => {
      window.removeEventListener(WALLET_SESSION_EVENT, handleRefresh);
    };
  }, [refresh]);

  return {
    balance,
    loading,
    refresh,
  };
}