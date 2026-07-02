export default function WalletCard() {
  return (
    <div
      style={{
        marginTop: "32px",
        background: "#1E2947",
        border: "1px solid #2A3654",
        borderRadius: "16px",
        padding: "24px",
      }}
    >
      <h2
        style={{
          color: "#FFFFFF",
          marginBottom: "24px",
        }}
      >
        Wallet
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div>
          <p
            style={{
              color: "#94A3B8",
              marginBottom: "8px",
            }}
          >
            Wallet Status
          </p>

          <h3
            style={{
              color: "#FFFFFF",
              margin: 0,
            }}
          >
            Not Connected
          </h3>
        </div>

        <button
          style={{
            background: "#FFC857",
            color: "#111827",
            border: "none",
            padding: "14px",
            borderRadius: "10px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
}