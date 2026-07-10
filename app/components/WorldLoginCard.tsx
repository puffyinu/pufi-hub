"use client";

import { useState } from "react";
import { useWalletContext } from "@/app/context/WalletProvider";
import { login } from "@/app/runtime/auth";

export default function WorldLoginCard() {
  const [loading, setLoading] = useState(false);
  const { wallet } = useWalletContext();

  async function handleLogin() {
    setLoading(true);
    try {
      await login();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border p-6">
      <h2 className="text-xl font-bold">
        World Login
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        Connect your World App to continue.
      </p>

      <button
        className="mt-4 w-full rounded bg-black px-4 py-2 text-white"
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Connecting..." : "Login with World ID"}
      </button>

      <div className="mt-4 text-sm text-gray-600">
        {wallet.connected ? (
          <>
            <p>Status: Connected</p>
            <p>Wallet: {wallet.address}</p>
          </>
        ) : (
          <p>Status: Not Connected</p>
        )}
      </div>
    </div>
  );
}
