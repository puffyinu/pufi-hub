"use client";

import { useState } from "react";
import { login } from "../runtime/auth";
import { useWalletContext } from "../context/WalletProvider";

export function useWallet() {
  const { wallet, setWallet } = useWalletContext();

  const [loading, setLoading] = useState(false);

  async function connect() {
    setLoading(true);

    try {
      const result = await login();

if (result?.address) {
  setWallet({
    connected: true,
    address: result.address,
    balance: 0,
  });
}
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