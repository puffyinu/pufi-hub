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
    <div className="relative min-h-screen bg-[#0D1125] text-white font-sans selection:bg-[#FFC857]/30">
      
      <AppBackground />

      {/* Content Wrapper */}
      <div className="relative z-0 mx-auto flex max-w-md flex-col px-2">
        
        <DashboardTopBar />

        {/* Main Content:
          - flex-col dan gap-6 memastikan jarak antar kartu konsisten.
          - pb-32 memastikan scroll mentok dengan aman di atas Bottom Nav.
        */}
        <main className="flex-1 flex flex-col gap-6 pt-4 pb-32 px-2">
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