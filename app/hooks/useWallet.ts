"use client";
import { useState } from "react";
import { useWalletContext } from "../context/WalletProvider";
import { connectAndVerifyWallet } from "@/app/services/walletConnectFlow";

export function useWallet() {
  const { wallet, setWallet } = useWalletContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function connect() {
    setLoading(true);
    setError(null);
    try {
      const result = await connectAndVerifyWallet();
      if (!result.success || !result.address) {
        setError(result.error ?? "Connection failed. Please try again.");
        setLoading(false);
        return;
      }
      setWallet({
        connected: true,
        address: result.address,
        balance: 0,
      });
    } catch (err) {
      console.error(err);
      setError("Unexpected error. Please try again.");
    }
    setLoading(false);
  }

  return {
    wallet,
    connect,
    loading,
    error,
  };
}
