"use client";

import { useMiniKit } from "../hooks/useMiniKit";
import { useWallet } from "../hooks/useWallet";
import { useWalletBalance } from "../hooks/useWalletBalance";
import { useTokenInfo } from "../hooks/useTokenInfo";
import { useTransaction } from "../hooks/useTransaction";

export default function WalletCard() {
  const { installed } = useMiniKit();
  const { wallet, connect, loading } = useWallet();
  const { balance, loading: balanceLoading, refresh } = useWalletBalance();
  const { token, loading: tokenLoading } = useTokenInfo();
  const { transaction } = useTransaction();

  return (
    <div
      style={{
        background: "#1E2A4A",
        borderRadius: 20,
        padding: 32,
        marginTop: 24,
      }}
    >
      <h2>Wallet</h2>

      {tokenLoading ? (
        <p>Loading token info...</p>
      ) : token ? (
        <>
          <p>
            Token : <strong>{token.name}</strong>
          </p>

          <p>
            Symbol : <strong>{token.symbol}</strong>
          </p>

          <p>
            Decimals : <strong>{token.decimals}</strong>
          </p>

          <p>
            Supply : <strong>{token.totalSupply}</strong>
          </p>
        </>
      ) : (
        <p>Token info unavailable.</p>
      )}

      <p>
        World App :
        <strong>
          {installed ? " Installed ✅" : " Not Installed ❌"}
        </strong>
      </p>

      <p style={{ marginTop: 16 }}>
        Wallet :
        <strong>
          {wallet.connected ? " Connected ✅" : " Not Connected"}
        </strong>
      </p>

      <p>
        WLD :
        <strong> {balance.wld}</strong>
      </p>

      <p>
        PUFI :
        <strong> {balance.pufi}</strong>
      </p>

      <p style={{ marginTop: 16 }}>
        Transaction Status :
        <strong> {transaction.status}</strong>
      </p>

      {transaction.transactionId && (
        <p>
          Transaction ID :
          <strong> {transaction.transactionId}</strong>
        </p>
      )}

      {wallet.connected && (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 8,
            background: "#16213E",
            fontSize: 14,
            wordBreak: "break-all",
          }}
        >
          <strong>Wallet Address</strong>

          <br />

          {wallet.address}
        </div>
      )}

      <button
        onClick={async () => {
          await connect();
          await refresh();
        }}
        disabled={loading}
        style={{
          width: "100%",
          marginTop: 20,
          padding: "16px",
          borderRadius: 12,
          background: "#FFC857",
          color: "#111",
          border: "none",
          fontWeight: 700,
          cursor: loading ? "wait" : "pointer",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading
          ? "Connecting..."
          : wallet.connected
          ? "Connected ✅"
          : "Connect Wallet"}
      </button>

      <button
        onClick={refresh}
        disabled={balanceLoading}
        style={{
          width: "100%",
          marginTop: 12,
          padding: "14px",
          borderRadius: 12,
          border: "none",
          background: "#4CAF50",
          color: "#fff",
          fontWeight: 700,
          cursor: balanceLoading ? "wait" : "pointer",
          opacity: balanceLoading ? 0.6 : 1,
        }}
      >
        {balanceLoading ? "Refreshing..." : "Refresh Balance"}
      </button>
    </div>
  );
}