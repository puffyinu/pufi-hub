"use client";

import DashboardCard from "@/app/components/DashboardCard";
import { useCampaign } from "@/app/hooks/useCampaign";
import { useReferral } from "@/app/hooks/useReferral";
import { useReward } from "@/app/hooks/useReward";

export default function DashboardStats() {
  const { reward } = useReward();
  const { campaigns } = useCampaign();
  const { referrals } = useReferral();

  const completedCampaigns =
    campaigns.filter((campaign) => campaign.completed).length;

  const claimedReferrals =
    referrals.filter((referral) => referral.claimed).length;

  return (
    <div className="dashboard-cards">
      <DashboardCard
        title="PUFI Balance"
        value={`${reward.available} PUFI`}
      />

      <DashboardCard
        title="Completed Tasks"
        value="0"
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
  );
}