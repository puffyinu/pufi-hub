"use client";

import { useReferral } from "@/app/hooks/useReferral";

export default function ReferralCard() {
  const { referrals, claimReferral } = useReferral();

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
        Referrals
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {referrals.map(referral => (
          <div
            key={referral.id}
            style={{
              background: "#111A30",
              border: "1px solid #2A3654",
              borderRadius: "12px",
              padding: "18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3
                style={{
                  margin: 0,
                  color: "#FFFFFF",
                }}
              >
                {referral.username}
              </h3>

              <p
                style={{
                  marginTop: "8px",
                  color: "#94A3B8",
                }}
              >
                Reward: {referral.reward} PUFI
              </p>

              <p
                style={{
                  marginTop: "6px",
                  color: "#94A3B8",
                  fontSize: "14px",
                }}
              >
                Status: {referral.claimed ? "Claimed" : "Pending"}
              </p>
            </div>

            {referral.claimed ? (
              <button
                type="button"
                disabled
                style={{
                  background: "#16A34A",
                  color: "#FFFFFF",
                  padding: "8px 12px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: "600",
                  border: "none",
                  cursor: "default",
                }}
              >
                Claimed
              </button>
            ) : (
              <button
                type="button"
                onClick={() => claimReferral(referral.id)}
                style={{
                  background: "#16A34A",
                  color: "#FFFFFF",
                  padding: "8px 12px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: "600",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Claim
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
