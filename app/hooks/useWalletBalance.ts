"use client";

import { useState } from "react";

import {
  getWalletBalance,
  BalanceResult,
} from "../services/walletBalance";

import { useWalletContext } from "../context/WalletProvider";

export function useWalletBalance() {
  const { wallet } = useWalletContext();

  const [balance, setBalance] = useState<BalanceResult>({
    wld: "0.00",
    pufi: "0.00",
  });

  const [loading, setLoading] = useState(false);

  async function refresh() {
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
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return {
    balance,
    loading,
    refresh,
  };
}