"use client";

import DashboardCard from "@/app/components/DashboardCard";
import { useCampaign } from "@/app/hooks/useCampaign";
import { useReferral } from "@/app/hooks/useReferral";
import { useReward } from "@/app/hooks/useReward";
import { useRewardClaim } from "@/app/hooks/useRewardClaim";

export default function DashboardStats() {
  const { reward } = useReward();
  const { rewardClaim, claim } = useRewardClaim();
  const { campaigns } = useCampaign();
  const { referrals } = useReferral();

  const completedCampaigns =
    campaigns.filter((campaign) => campaign.completed).length;

  const claimedReferrals =
    referrals.filter((referral) => referral.claimed).length;

  return (
    <>
      <div className="dashboard-cards">
        <DashboardCard
          title="Available PUFI"
          value={`${reward.available} PUFI`}
        />

        <DashboardCard
          title="Claim Status"
          value={rewardClaim.status}
        />

        <DashboardCard
          title="Campaign Rewards"
          value={String(completedCampaigns)}
        />

        <DashboardCard
          title="Referral"
          value={String(claimedReferrals)}
        />
      </div>

      <div
        style={{
          marginTop: 24,
          padding: 20,
          borderRadius: 16,
          background: "#1C2745",
          border: "1px solid #23304A",
        }}
      >
        <h3
          style={{
            marginTop: 0,
            color: "#FFFFFF",
          }}
        >
          Reward Claim
        </h3>

        <p
          style={{
            color: "#94A3B8",
          }}
        >
          Available Reward:
          <strong> {reward.available} PUFI</strong>
        </p>

        <button
          onClick={claim}
          disabled={reward.available <= 0}
          style={{
            width: "100%",
            marginTop: 16,
            padding: "14px",
            borderRadius: 12,
            border: "none",
            background:
              reward.available > 0
                ? "#FFC857"
                : "#555",
            color: "#111",
            fontWeight: 700,
            cursor:
              reward.available > 0
                ? "pointer"
                : "not-allowed",
          }}
        >
          Claim Reward
        </button>
      </div>
    </>
  );
}