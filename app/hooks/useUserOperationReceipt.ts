"use client";

import { useCallback } from "react";
import { useUserOperationReceipt as useMiniKitUserOperationReceipt } from "@worldcoin/minikit-react";
import { publicClient } from "@/app/services/viemClient";
import { parseEventLogs } from "viem";
import { SETTLEMENT_ABI } from "@/app/services/contracts";

export function useUserOperationReceipt() {
  const {
    poll,
    isLoading,
    reset,
  } = useMiniKitUserOperationReceipt({
    client: publicClient,
  });

  const getReceipt = useCallback(
    async (userOpHash: `0x${string}`) => {
      try {
        const result = await poll(userOpHash);

        if (!result?.receipt) {
          return null;
        }

        if (result.receipt.status !== "success") {
          return null;
        }

        if (!result.transactionHash) {
          console.error("[Receipt] Transaction hash missing from receipt result.");
          return null;
        }

        const events = parseEventLogs({
          abi: SETTLEMENT_ABI,
          logs: result.receipt.logs,
        });

        return {
          transactionHash: result.transactionHash,
          events,
        };
      } catch (error) {
        console.error("[Receipt] User operation receipt check failed:", error);
        return null;
      }
    },
    [poll],
  );

  return {
    getReceipt,
    loading: isLoading,
    error: null,
    reset,
  };
}
