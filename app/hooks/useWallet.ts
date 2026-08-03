"use client";
import { useState } from "react";
import { login } from "../runtime/auth";
import { useWalletContext } from "../context/WalletProvider";
import { verifyHuman } from "../services/worldIdVerification";

export function useWallet() {
  const { wallet, setWallet } = useWalletContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function connect() {
    setLoading(true);
    setError(null);

    try {
      const verification = await verifyHuman();

      if (!verification.success) {
        setError(verification.error ?? "World ID verification failed.");
        setLoading(false);
        return;
      }

      const result = await login(true);

      if (result?.address) {
        setWallet({
          connected: true,
          address: result.address,
          balance: 0,
        });
      } else {
        setError("Connection cancelled or failed. Please try again.");
      }
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
