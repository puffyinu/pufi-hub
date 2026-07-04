"use client";

import { useState } from "react";
import { connectWallet } from "../services/wallet";
import { useWalletContext } from "../context/WalletProvider";

export function useWallet() {
  const { wallet, setWallet } = useWalletContext();

  const [loading, setLoading] = useState(false);

  async function connect() {
    setLoading(true);

    try {
      const result = await connectWallet();
      setWallet({
        ...result,
        balance: 0,
      });
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  return {
    wallet,
    connect,
    loading,
  };
}