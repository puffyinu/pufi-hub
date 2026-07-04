"use client";

import { useEffect, useState } from "react";
import { getTokenInfo, TokenInfo } from "../services/tokenInfo";

export function useTokenInfo() {
  const [token, setToken] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const info = await getTokenInfo();
        setToken(info);
      } catch (error) {
        console.error("Failed to load token info:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return {
    token,
    loading,
  };
}