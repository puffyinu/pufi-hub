export default function HeroBanner() {
  return (
    <div
      style={{
        background:
          "linear-gradient(135deg,#2C3E70 0%,#1E2947 100%)",
        borderRadius: "18px",
        padding: "32px",
        marginBottom: "32px",
        border: "1px solid #30406B",
      }}
    >
      <p
        style={{
          color: "#FFC857",
          margin: 0,
          fontWeight: "700",
        }}
      >
        🐶 Welcome Back
      </p>

      <h1
        style={{
          color: "#FFFFFF",
          marginTop: "12px",
          marginBottom: "12px",
          fontSize: "34px",
        }}
      >
        Claim Your Daily Reward
      </h1>

      <p
        style={{
          color: "#94A3B8",
          marginBottom: "28px",
        }}
      >
        Complete today&apos;s activities and earn PUFI rewards.
      </p>

      <button
        style={{
          background: "#FFC857",
          color: "#111827",
          border: "none",
          padding: "14px 26px",
          borderRadius: "12px",
          fontWeight: "700",
          cursor: "pointer",
        }}
      >
        Claim 5 PUFI
      </button>
    </div>
  );
}