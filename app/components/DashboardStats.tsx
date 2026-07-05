"use client";

import DashboardCard from "@/app/components/DashboardCard";
import { useCampaign } from "@/app/hooks/useCampaign";
import { useReward } from "@/app/hooks/useReward";

export default function DashboardStats() {
  const { reward } = useReward();
  const { campaigns } = useCampaign();
  const completedCampaigns = campaigns.filter(campaign => campaign.completed).length;

  return (
    <div className="dashboard-cards">
      <DashboardCard title="PUFI Balance" value={`${reward.points} PUFI`} />
      <DashboardCard title="Completed Tasks" value="0" />
      <DashboardCard title="Campaign Rewards" value={String(completedCampaigns)} />
      <DashboardCard title="Referral" value="0" />
    </div>
  );
}
