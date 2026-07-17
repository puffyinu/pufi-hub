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
    <section
      style={{
        background: "#1E2A4A",
        borderRadius: 20,
        padding: 24,
      }}
    >
      <h2
        style={{
          fontSize: 20,
          fontWeight: 700,
          marginBottom: 20,
        }}
      >
        🎁 REWARDS CLAIMS
      </h2>

      {rewards.map((reward) => (
        <div
          key={reward.token}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "18px 0",
            borderBottom: "1px solid #31456E",
          }}
        >
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              {reward.icon} {reward.token}
            </div>

            <div
              style={{
                color: "#B8C4E0",
                marginTop: 6,
              }}
            >
              {reward.amount}
            </div>
          </div>

          <button
            style={{
              background: "#7C3AED",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "10px 20px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            CLAIM
          </button>
        </div>
      ))}
    </section>
  );
}