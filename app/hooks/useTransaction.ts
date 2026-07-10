"use client";

import { useEffect, useState } from "react";

import { sendTransaction as sendTransactionRequest } from "@/app/services/transaction";
import {
  getTransactionState,
  resetTransactionState,
  setTransactionState,
  TRANSACTION_SESSION_EVENT,
  type TransactionState,
  type TransactionStatus,
} from "@/app/services/transactionSession";

import type { MiniKitSendTransactionOptions } from "@worldcoin/minikit-js/commands";

export function useTransaction() {
  const [transaction, setTransaction] =
    useState<TransactionState>(() =>
      getTransactionState()
    );

  const [loading, setLoading] =
    useState<boolean>(transaction.loading);

  useEffect(() => {
    const syncTransaction = () => {
      const nextState =
        getTransactionState();

      setTransaction(nextState);
      setLoading(nextState.loading);
    };

    syncTransaction();

    if (typeof window === "undefined") {
      return;
    }

    window.addEventListener(
      TRANSACTION_SESSION_EVENT,
      syncTransaction
    );

    return () => {
      window.removeEventListener(
        TRANSACTION_SESSION_EVENT,
        syncTransaction
      );
    };
  }, []);

  const send = async (
    options: MiniKitSendTransactionOptions
  ) => {
    setLoading(true);

    setTransactionState({
      status: "preparing",
      loading: true,
      error: null,
    });

    const result =
      await sendTransactionRequest(options);

    if (result.success) {
      setTransactionState({
        status:
          (result.status as TransactionStatus | undefined) ??
          "pending",

        transactionId:
          result.transactionId ?? null,

        from:
          result.from ?? null,

        timestamp:
          result.timestamp ?? null,

        loading: false,

        error: null,
      });
    } else {
      setTransactionState({
        status: "failed",
        loading: false,
        error:
          result.error ??
          "Unknown transaction error.",
      });
    }

    const nextState =
      getTransactionState();

    setTransaction(nextState);
    setLoading(nextState.loading);
  };

  const reset = () => {
    resetTransactionState();

    const nextState =
      getTransactionState();

    setTransaction(nextState);
    setLoading(nextState.loading);
  };

  return {
    transaction,
    loading,
    send,
    reset,
  };
}