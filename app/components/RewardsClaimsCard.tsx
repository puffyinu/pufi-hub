"use client";

const rewards = [
  {
    token: "PUFI",
    amount: "10 PUFI",
    icon: "🟣",
  },
  {
    token: "USDC",
    amount: "2.50 USDC",
    icon: "💵",
  },
  {
    token: "WLD",
    amount: "0.15 WLD",
    icon: "🌐",
  },
];

export default function RewardsClaimsCard() {
  return (
    <>
      <h2
        style={{
          color: "#FFFFFF",
          fontSize: 11,
          fontWeight: 700,
          marginBottom: 12,
        }}
      >
        🎁 REWARDS CLAIMS
      </h2>

      <section
        style={{
          display: "flex",
          gap: 12,
        }}
      >
        {rewards.map((reward) => (
          <div
            key={reward.token}
            style={{
              flex: 1,
              minWidth: 0,
              boxSizing: "border-box",
              background: "#1E2A4A",
              border: "1px solid #31456E",
              borderRadius: 20,
              padding: 10,
            }}
          >
            <div
              style={{
                fontSize: 20,
                textAlign: "center",
                marginBottom: 5,
              }}
            >
              {reward.icon}
            </div>

            <div
              style={{
                textAlign: "center",
                fontSize: 14,
                fontWeight: 700,
                color: "#FFFFFF",
              }}
            >
              {reward.token}
            </div>

            <div
              style={{
                textAlign: "center",
                fontSize: 13,
                lineHeight: 1.2,
                color: "#B8C4E0",
                marginTop: 4,
                minHeight: 26,
              }}
            >
              {reward.amount}
            </div>

            <button
              style={{
                width: "100%",
                marginTop: 5,
                height: 32,
                border: "none",
                borderRadius: 10,
                background:
                  "linear-gradient(90deg,#7C3AED 0%,#9333EA 100%)",
                color: "#FFFFFF",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              CLAIM
            </button>
          </div>
        ))}
      </section>
    </>
  );
}