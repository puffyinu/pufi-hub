"use client";

import { useState, useCallback } from "react";
import { publicClient } from "@/app/services/viemClient";
import { getTransactionReceipt } from "viem/actions";
import { parseEventLogs } from "viem";
import { SETTLEMENT_ABI } from "@/app/services/contracts";

export function useUserOperationReceipt() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getReceipt = useCallback(async (hash: `0x${string}`) => {
    setLoading(true);
    setError(null);
    try {
      const receipt = await getTransactionReceipt(publicClient, { hash });
      
      if (receipt.status === 'success') {
          const events = parseEventLogs({
              abi: SETTLEMENT_ABI,
              logs: receipt.logs
          });
          setLoading(false);
          return events;
      }
      
      setLoading(false);
      return null;
    } catch (err) {
      console.error("Receipt check failed:", err);
      setError("Failed to fetch receipt.");
      setLoading(false);
      return null;
    }
  }, []);

  return { getReceipt, loading, error };
}
