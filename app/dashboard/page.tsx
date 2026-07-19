"use client";

import DashboardTopBar from "@/app/components/DashboardTopBar";
import IdentityCard from "@/app/components/IdentityCard";
import LiveCommunityFeed from "@/app/components/LiveCommunityFeed";
import NetworkStats from "@/app/components/NetworkStats";
import BottomNav from "@/app/components/BottomNav";

export default function DashboardPage() {
  return (
    <div className="relative text-white font-sans selection:bg-[#FFC857]/30">

      {/* ========================= */}
      {/* PREMIUM BACKGROUND LAYER (FIXED) */}
      {/* ========================= */}
      <div className="fixed inset-0 z-[-1]">
        {/* Main Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A1757] via-[#181633] to-[#0D1125]" />

        {/* Purple Aurora */}
        <div className="pointer-events-none absolute -top-40 -left-32 h-[420px] w-[420px] rounded-full bg-purple-600/20 blur-[140px]" />

        {/* Gold Glow */}
        <div className="pointer-events-none absolute top-0 right-[-80px] h-[260px] w-[260px] rounded-full bg-[#FFC857]/10 blur-[120px]" />

        {/* Bottom Purple Glow */}
        <div className="pointer-events-none absolute bottom-[-120px] left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[120px]" />

        {/* Soft Gold Aura */}
        <div className="pointer-events-none absolute bottom-0 right-0 h-[220px] w-[220px] rounded-full bg-yellow-400/5 blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-0 mx-auto flex max-w-[480px] flex-col px-2">

        <DashboardTopBar />

<main className="flex-1 pt-2 pb-28">

  <IdentityCard />

  <LiveCommunityFeed />

  <NetworkStats />

</main>

        <BottomNav active="dashboard" />

      </div>
    </div>
  );
}