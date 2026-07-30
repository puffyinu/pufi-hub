"use client";

import DashboardTopBar from "@/app/components/DashboardTopBar";
import IdentityCard from "@/app/components/IdentityCard";
import PortfolioCard from "@/app/components/PortfolioCard";
import LiveCommunityFeed from "@/app/components/LiveCommunityFeed";
import NetworkStats from "@/app/components/NetworkStats";
import BottomNav from "@/app/components/BottomNav";
import AppBackground from "@/app/components/layout/AppBackground";

export default function DashboardPage() {
  return (
    <div className="relative text-white font-sans selection:bg-[#FFC857]/30">

      <AppBackground />

      {/* Content */}
      <div className="relative z-0 mx-auto flex max-w-[480px] flex-col px-2">

        <DashboardTopBar />

<main className="flex-1 pt-2 pb-28">

  <IdentityCard />

  <PortfolioCard />

  <LiveCommunityFeed />

  <NetworkStats />

</main>

        <BottomNav active="dashboard" />

      </div>
    </div>
  );
}