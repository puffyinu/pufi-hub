"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

import DashboardTopBar from "@/app/components/DashboardTopBar";
import BottomNav from "@/app/components/BottomNav";
import UIFeedback from "@/app/components/UIFeedback";
import AppBackground from "@/app/components/layout/AppBackground";
import { useWalletContext } from "@/app/context/WalletProvider";

type ClaimState = "idle" | "loading" | "claimed";

interface DailyClaimApiResponse {
  success: boolean;
  txHash?: string;
  error?: string;
  nextClaimAt?: string;
}

export default function ClaimPage() {
  const { wallet } = useWalletContext();
  const [claimState, setClaimState] = useState<ClaimState>("idle");
  const [countdown, setCountdown] = useState("23:59:59");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleClaimStart = async () => {
    setErrorMessage(null);

    if (!wallet.connected || !wallet.address) {
      setErrorMessage("Please connect your World Wallet first.");
      return;
    }

    setClaimState("loading");

    try {
      const response = await fetch("/api/claim/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: wallet.address }),
      });

      const result: DailyClaimApiResponse = await response.json();

      if (!result.success) {
        setErrorMessage(result.error ?? "Claim failed. Please try again.");
        setClaimState("idle");
        return;
      }

      setTxHash(result.txHash ?? null);
      setCountdown("23:59:59");
      setClaimState("claimed");
    } catch (error) {
      console.error("[CLAIM] Request failed", error);
      setErrorMessage("Network error. Please try again.");
      setClaimState("idle");
    }
  };

  useEffect(() => {
    if (claimState !== "claimed") return;

    let remaining = 24 * 60 * 60 - 1;

    const timer = setInterval(() => {
      remaining--;

      const hours = String(Math.floor(remaining / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((remaining % 3600) / 60)).padStart(2, "0");
      const seconds = String(remaining % 60).padStart(2, "0");

      setCountdown(`${hours}:${minutes}:${seconds}`);

      if (remaining <= 0) {
        clearInterval(timer);
        setClaimState("idle");
        setCountdown("23:59:59");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [claimState]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col bg-[#0D1125] text-white selection:bg-[#FFC857]/30 select-none">
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

      <AppBackground />

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-4">

        <div className="flex-none">
          <DashboardTopBar />
        </div>

        <main className="flex-1 flex flex-col pt-2 pb-32 px-2 overflow-hidden">

          <div className="text-center flex-none">
            <h2 className="text-2xl font-black tracking-wide uppercase">
              Daily Claim
            </h2>
            <p className="mt-1.5 text-xs text-slate-400 font-medium">
              Claim your daily PUFI reward
            </p>
          </div>

          <div className="flex-1" />

          <div className="flex-none flex items-center justify-center relative w-full my-4">
            <div className="relative flex items-center justify-center">
              <div className="absolute h-[260px] w-[260px] rounded-full bg-purple-600/10 blur-[90px] animate-aura-pulse pointer-events-none" />
              <div className="absolute h-[220px] w-[220px] rounded-full border border-violet-500/20 shadow-[0_0_30px_rgba(139,92,246,0.1)] pointer-events-none" />
              <div className="absolute -bottom-2 h-10 w-36 rounded-[100%] bg-purple-500/20 blur-[25px] pointer-events-none" />

              <div className="absolute top-[-20px] left-[-30px] w-1.5 h-1.5 rounded-full bg-purple-400/40 blur-[1px] animate-particle" style={{ animationDelay: '0s' }} />
              <div className="absolute top-[30px] right-[-20px] w-1 h-1 rounded-full bg-white/30 blur-[0.5px] animate-particle" style={{ animationDelay: '1.2s' }} />
              <div className="absolute bottom-[10px] left-[-40px] w-2 h-2 rounded-full bg-yellow-400/20 blur-[2px] animate-particle" style={{ animationDelay: '2.5s' }} />
              <div className="absolute top-[-40px] right-[20px] w-1 h-1 rounded-full bg-purple-300/40 animate-particle" style={{ animationDelay: '0.8s' }} />

              <Image
                src="/images/mascot/pufi-mascot.png"
                alt="Puffy Inu"
                width={200}
                height={200}
                priority
                className="relative z-10 animate-mascot-float object-contain"
              />
            </div>
          </div>

          <div className="flex-1" />

          {txHash && claimState === "claimed" && (
            <p className="text-center text-[10px] text-slate-500 mb-2 break-all">
              Tx: {txHash}
            </p>
          )}

          <div className="flex-none w-full">
            <button
              disabled={claimState !== "idle"}
              onClick={handleClaimStart}
              className={`
                w-full min-h-[56px] rounded-2xl 
                bg-gradient-to-b from-[#FFE580] via-[#FFB323] to-[#E59400] 
                py-4 text-base font-black text-[#171717]
                shadow-[0_8px_32px_rgba(255,200,87,0.25)] ring-1 ring-yellow-400/30 
                transition-transform duration-150 touch-manipulation
                ${claimState === "idle" ? "hover:scale-[1.01] active:scale-95" : "opacity-50 grayscale-[0.5]"}
              `}
            >
              {claimState === "loading" ? (
                "CLAIMING..."
              ) : claimState === "claimed" ? (
                <div className="flex flex-col items-center leading-tight">
                  <span className="text-xs">✓ CLAIMED TODAY</span>
                  <span className="mt-0.5 text-sm font-bold tabular-nums text-[#171717]/80">
                    {countdown}
                  </span>
                </div>
              ) : (
                "🎁 CLAIM REWARD"
              )}
            </button>
          </div>

        </main>

        <BottomNav active="claim" />

        {errorMessage && (
          <UIFeedback
            isOpen={true}
            type="alert"
            title="Claim Failed"
            message={errorMessage}
            onConfirm={() => setErrorMessage(null)}
          />
        )}
      </div>
    </div>
  );
}
