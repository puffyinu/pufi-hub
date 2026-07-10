"use client";

import { useTransaction } from "@/app/hooks/useTransaction";

export default function TransactionStatusCard() {
  const {
    transaction,
    loading,
    reset,
  } = useTransaction();

  const hasTransaction =
    transaction.transactionId !== null;

  const explorerUrl = hasTransaction
    ? `https://worldscan.org/tx/${transaction.transactionId}`
    : null;

  return (
    <div
      style={{
        background: "#1E2A4A",
        borderRadius: 20,
        padding: 32,
        marginTop: 24,
      }}
    >
      <h2>Transaction Center</h2>

      <p>
        Status :
        <strong> {transaction.status}</strong>
      </p>

      <p>
        Loading :
        <strong>{loading ? " Yes" : " No"}</strong>
      </p>

      {!hasTransaction && !transaction.error && (
        <p
          style={{
            marginTop: 16,
            opacity: 0.8,
          }}
        >
          No transaction available.
        </p>
      )}

      {transaction.transactionId && (
        <p
          style={{
            wordBreak: "break-all",
          }}
        >
          Transaction ID :
          <strong> {transaction.transactionId}</strong>
        </p>
      )}

      {transaction.from && (
        <p
          style={{
            wordBreak: "break-all",
          }}
        >
          From :
          <strong> {transaction.from}</strong>
        </p>
      )}

      {transaction.timestamp && (
        <p>
          Timestamp :
          <strong> {transaction.timestamp}</strong>
        </p>
      )}

      {transaction.error && (
        <div
          style={{
            marginTop: 16,
            padding: 16,
            borderRadius: 12,
            background: "#5A1E1E",
            color: "#fff",
          }}
        >
          <strong>Error</strong>
          <br />
          {transaction.error}
        </div>
      )}

      {explorerUrl && (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            marginTop: 20,
            color: "#4FC3F7",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          View on WorldScan ↗
        </a>
      )}

      {(hasTransaction || transaction.error) && (
        <button
          onClick={reset}
          style={{
            width: "100%",
            marginTop: 20,
            padding: "14px",
            borderRadius: 12,
            border: "none",
            background: "#E67E22",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Reset Transaction
        </button>
      )}
    </div>
  );
}