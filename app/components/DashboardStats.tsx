"use client";

import DashboardCard from "@/app/components/DashboardCard";
import { useReward } from "@/app/hooks/useReward";

export default function DashboardStats() {
  const { reward } = useReward();

  return (
    <div className="dashboard-cards">
      <DashboardCard title="PUFI Balance" value={`${reward.points} PUFI`} />
      <DashboardCard title="Completed Tasks" value="0" />
      <DashboardCard title="Campaign Rewards" value="0" />
      <DashboardCard title="Referral" value="0" />
    </div>
  );
}
