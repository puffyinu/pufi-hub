"use client";

import { useState } from "react";
import Image from "next/image";

import DashboardTopBar from "@/app/components/DashboardTopBar";
import BottomNav from "@/app/components/BottomNav";
import { executeDailyClaim } from "@/app/services/dailyClaimService";

type ClaimState = "idle" | "loading" | "claimed";

export default function ClaimPage() {
  const [claimState, setClaimState] = useState<ClaimState>("idle");

  const handleClaimStart = async () => {
  setClaimState("loading");

  const result = await executeDailyClaim();

  if (!result.success) {
    console.warn(result.error);
    setClaimState("idle");
    return;
  }

  // BUILD #009
  // Placeholder integrasi World MiniKit.
  // Nantinya proses ini diganti dengan:
  // await verifyWithIDKit();
  // await sendTransaction();

  setTimeout(() => {
    setClaimState("claimed");
  }, 1000);
};

  return (
    <div className="relative h-dvh w-full overflow-hidden flex flex-col bg-[#0D1125] text-white selection:bg-[#FFC857]/30">
      {/* Custom Keyframes for Premium Polish */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes mascot-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes aura-pulse {
          0%, 100% { transform: scale(0.96); opacity: 0.18; }
          50% { transform: scale(1.04); opacity: 0.32; }
        }
        @keyframes particle-drift {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          25% { opacity: 0.5; }
          50% { transform: translate(15px, -20px); opacity: 0.3; }
          75% { opacity: 0.6; }
        }
        .animate-mascot-float { animation: mascot-float 3.5s ease-in-out infinite; }
        .animate-aura-pulse { animation: aura-pulse 4s ease-in-out infinite; }
        .animate-particle { animation: particle-drift 6s ease-in-out infinite; }
      `}} />

      {/* ========================= */}
      {/* BACKGROUND LAYERS         */}
      {/* ========================= */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2A1757] via-[#181633] to-[#0D1125]" />

      <div className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[150px]" />

      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[260px] w-[260px] -translate-x-1/2 rounded-full bg-[#FFC857]/10 blur-[120px]" />

      {/* ========================= */}
      {/* VIEWPORT CONTENT WRAPPER  */}
      {/* ========================= */}
      <div className="relative mx-auto flex h-full w-full max-w-[480px] flex-col">

        {/* 1. Header (Fixed Height) */}
        <div className="flex-none">
          <DashboardTopBar />
        </div>

        {/* 2. Main Content (Flex-1) */}
        <main className="flex-1 flex flex-col px-6 pb-24 overflow-hidden">

          {/* Title Section */}
          <div className="text-center flex-none">
            <h2 className="text-3xl font-black tracking-wide">
              Daily Claim
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Claim your daily PUFI reward
            </p>
          </div>

          {/* Dynamic Spacer */}
          <div className="flex-1" />

          {/* Hero Section (Centered Mascot) */}
          <div className="flex-none flex items-center justify-center relative w-full">
            
            <div className="relative flex items-center justify-center">
                {/* Layer 1: Large Purple Radial Glow */}
                <div className="absolute h-[300px] w-[300px] rounded-full bg-purple-600/10 blur-[100px] animate-aura-pulse" />

                {/* Layer 2: Thin Glowing Circle */}
                <div className="absolute h-[260px] w-[260px] rounded-full border border-violet-500/20 shadow-[0_0_30px_rgba(139,92,246,0.1)]" />

                {/* Layer 3: Purple Energy Floor */}
                <div className="absolute -bottom-2 h-12 w-40 rounded-[100%] bg-purple-500/20 blur-[30px]" />

                {/* Premium Particles (Behind Mascot) */}
                <div className="absolute top-[-20px] left-[-40px] w-1.5 h-1.5 rounded-full bg-purple-400/40 blur-[1px] animate-particle" style={{ animationDelay: '0s' }} />
                <div className="absolute top-[40px] right-[-30px] w-1 h-1 rounded-full bg-white/30 blur-[0.5px] animate-particle" style={{ animationDelay: '1.2s' }} />
                <div className="absolute bottom-[20px] left-[-50px] w-2 h-2 rounded-full bg-yellow-400/20 blur-[2px] animate-particle" style={{ animationDelay: '2.5s' }} />
                <div className="absolute top-[-60px] right-[20px] w-1 h-1 rounded-full bg-purple-300/40 animate-particle" style={{ animationDelay: '0.8s' }} />
                <div className="absolute bottom-[-10px] right-[-40px] w-1.5 h-1.5 rounded-full bg-white/20 blur-[1px] animate-particle" style={{ animationDelay: '3.1s' }} />
                <div className="absolute top-[80px] left-[-20px] w-1 h-1 rounded-full bg-purple-500/30 animate-particle" style={{ animationDelay: '1.9s' }} />
                <div className="absolute bottom-[60px] right-[-60px] w-2 h-2 rounded-full bg-yellow-200/10 blur-[3px] animate-particle" style={{ animationDelay: '4.2s' }} />
                <div className="absolute top-[-10px] left-[60px] w-1 h-1 rounded-full bg-white/40 blur-[0.5px] animate-particle" style={{ animationDelay: '2.2s' }} />

                {/* Premium Sparkles */}
                <div className="absolute -top-10 -left-6 h-1 w-1 rounded-full bg-white opacity-40 blur-[0.5px]" />
                <div className="absolute top-10 -right-4 h-1.5 w-1.5 rounded-full bg-purple-300 opacity-60 blur-[1px]" />
                <div className="absolute bottom-16 -left-8 h-1 w-1 rounded-full bg-white opacity-30" />
                <div className="absolute -bottom-2 right-12 h-1.5 w-1.5 rounded-full bg-purple-400 opacity-50 blur-[1px]" />
                <div className="absolute top-0 right-1/4 h-1 w-1 rounded-full bg-white opacity-20" />

                <Image
                  src="/images/mascot/pufi-mascot.png"
                  alt="Puffy Inu"
                  width={240}
                  height={240}
                  priority
                  className="relative z-10 animate-mascot-float"
                />
            </div>
          </div>

          {/* Dynamic Spacer */}
          <div className="flex-1" />

          {/* CTA Button Section */}
          <div className="flex-none">
            <button
              disabled={claimState !== "idle"}
              onClick={handleClaimStart}
              className={`
                w-full rounded-[24px] 
                bg-gradient-to-b from-[#FFE580] via-[#FFB323] to-[#E59400] 
                py-5 text-xl font-black text-[#171717]
                shadow-[0_8px_32px_rgba(255,200,87,0.25)] ring-1 ring-yellow-400/30 
                transition-all duration-200 
                ${claimState === "idle" ? "hover:scale-[1.02] hover:shadow-[0_8px_40px_rgba(255,200,87,0.4)] active:scale-[0.98]" : "opacity-50 grayscale-[0.5]"}
              `}
            >
              {
  claimState === "loading"
    ? "CHECKING..."
    : claimState === "claimed"
    ? "CLAIMED TODAY"
    : "🎁 CLAIM REWARD"
}
            </button>
          </div>

        </main>
        
        <BottomNav active="claim" />

        {/* Overlays */}

      </div>
    </div>
  );
}