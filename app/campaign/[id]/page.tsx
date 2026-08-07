"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { getCampaignById } from "@/app/services/campaignEngine";
import { validateCampaignEligibility } from "@/app/services/validationEngine";
import { queueReward } from "@/app/services/rewardClaimEngine";
import { getWalletState } from "@/app/services/walletSession";
import type { Campaign } from "@/app/types/campaign";
import AppBackground from "@/app/components/layout/AppBackground";
import BottomNav from "@/app/components/BottomNav";
import UIFeedback from "@/app/components/UIFeedback";

const DEFAULT_LOGO = "/images/brand/pufi-logo.png";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CampaignDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  
  const [feedback, setFeedback] = useState<{
    isOpen: boolean;
    type: "alert" | "confirm";
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    type: "alert",
    title: "",
    message: "",
    onConfirm: () => {},
  });

  useEffect(() => {
    async function loadCampaign() {
      try {
        const data = await getCampaignById(id);
        if (!data) {
          setError("Campaign not found.");
        } else {
          setCampaign(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load campaign.");
      } finally {
        setLoading(false);
      }
    }
    loadCampaign();
  }, [id]);

  const handleParticipate = async () => {
    if (!campaign) return;

    const wallet = getWalletState();
    if (!wallet.address) {
       setFeedback({
        isOpen: true,
        type: "alert",
        title: "Wallet Required",
        message: "Please connect your wallet first.",
        onConfirm: () => setFeedback(f => ({ ...f, isOpen: false })),
      });
      return;
    }

    setIsValidating(true);
    try {
      const result = await validateCampaignEligibility(campaign);
      
      if (result.isEligible) {
        // Step: Queue the Reward (Pending Queue)
        // userId placeholder for FOUNDATION sprint
        queueReward(campaign.id, "user-placeholder", wallet.address, campaign.rewardToken, campaign.rewardAmount, result);
        
        setFeedback({
          isOpen: true,
          type: "alert",
          title: "Eligibility Verified",
          message: "You are eligible! Reward has been added to your pending queue. (Foundation Flow)",
          onConfirm: () => setFeedback(f => ({ ...f, isOpen: false })),
        });
      } else {
        setFeedback({
          isOpen: true,
          type: "alert",
          title: "Ineligible",
          message: result.message,
          onConfirm: () => setFeedback(f => ({ ...f, isOpen: false })),
        });
      }
    } catch {
      setFeedback({
        isOpen: true,
        type: "alert",
        title: "Validation Error",
        message: "An unexpected error occurred during validation.",
        onConfirm: () => setFeedback(f => ({ ...f, isOpen: false })),
      });
    } finally {
      setIsValidating(false);
    }
  };

  const formatAmount = (value: number) => {
    const rounded = Math.round(value * 1e6) / 1e6;
    if (Number.isInteger(rounded)) {
      return rounded.toString();
    }
    return rounded.toFixed(3);
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-[#0D1125] text-white flex flex-col items-center justify-center p-6">
        <AppBackground />
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-20 w-20 rounded-2xl bg-white/10" />
          <div className="h-6 w-48 rounded bg-white/10" />
          <div className="h-4 w-32 rounded bg-white/10" />
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="relative min-h-screen bg-[#0D1125] text-white flex flex-col items-center justify-center p-6 text-center">
        <AppBackground />
        <h1 className="text-xl font-black uppercase tracking-widest text-red-400 mb-4">Error</h1>
        <p className="text-slate-400 mb-8">{error || "Something went wrong."}</p>
        <Link href="/campaign" className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest transition-all active:scale-95">
          Back to Campaigns
        </Link>
      </div>
    );
  }

  const isCompleted = campaign.claimedCount >= campaign.maxClaims || campaign.status === "COMPLETED";

  return (
    <div className="relative min-h-screen bg-[#0D1125] text-white font-sans selection:bg-[#FFC857]/30 pb-32">
      <AppBackground />

      {/* Header / Banner Area */}
      <header className="relative h-64 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0D1125] z-10" />
        <div className="absolute inset-0 opacity-30 blur-xl scale-110">
           <Image src={campaign.logo || DEFAULT_LOGO} alt="Banner" fill className="object-cover" />
        </div>
        
        <div className="relative z-20 h-full flex flex-col items-center justify-end pb-6 px-6">
           <div className="relative h-24 w-24 rounded-3xl border-4 border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden mb-4">
              <Image src={campaign.logo || DEFAULT_LOGO} alt={campaign.title} fill className="object-cover" />
           </div>
           <h1 className="text-2xl font-black text-center tracking-tight leading-tight uppercase line-clamp-2">
             {campaign.title}
           </h1>
           <div className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#FFC857]">
             by {campaign.createdBy.slice(0, 10)}...
           </div>
        </div>

        <Link href="/campaign" className="absolute top-6 left-6 z-30 h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 backdrop-blur-md transition-all active:scale-90">
           <span className="text-xl">←</span>
        </Link>
      </header>

      <main className="relative z-20 px-6 pt-6 space-y-8 max-w-md mx-auto">
        
        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
             <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Reward</div>
             <div className="text-xl font-black text-[#FFC857]">
               {formatAmount(campaign.rewardAmount)} <span className="text-xs uppercase">{campaign.rewardToken}</span>
             </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
             <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Quota</div>
             <div className="text-xl font-black text-white">
               {campaign.maxClaims - campaign.claimedCount} <span className="text-xs uppercase text-slate-400">Left</span>
             </div>
          </div>
        </div>

        {/* Description */}
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-3 px-1">About Campaign</h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl leading-relaxed text-slate-300 text-sm font-semibold">
            {campaign.description}
          </div>
        </section>

        {/* Rules */}
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-3 px-1">Campaign Rules</h2>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl space-y-4">
            <div className="flex gap-4 items-start">
               <div className="h-6 w-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center shrink-0 text-xs font-black">1</div>
               <p className="text-xs font-bold text-slate-300">Open the campaign mini-app or website.</p>
            </div>
            <div className="flex gap-4 items-start">
               <div className="h-6 w-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center shrink-0 text-xs font-black">2</div>
               <p className="text-xs font-bold text-slate-300">Stay active for at least 10 seconds.</p>
            </div>
            <div className="flex gap-4 items-start">
               <div className="h-6 w-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center shrink-0 text-xs font-black">3</div>
               <p className="text-xs font-bold text-slate-300">Return to PUFI HUB to claim your reward.</p>
            </div>
          </div>
        </section>

        {/* Action Button Container */}
        <div className="fixed bottom-20 left-1/2 w-full max-w-md -translate-x-1/2 px-6 z-40 pb-[env(safe-area-inset-bottom)]">
          <button
            disabled={isCompleted || isValidating}
            onClick={handleParticipate}
            className={`w-full min-h-[60px] rounded-2xl flex items-center justify-center text-sm font-black uppercase tracking-widest transition-all active:scale-95 shadow-2xl ${
              isCompleted 
              ? "bg-white/10 text-slate-500 cursor-not-allowed border border-white/10" 
              : "bg-gradient-to-b from-[#FFE580] via-[#FFC857] to-[#E59400] text-[#171717] hover:brightness-110"
            }`}
          >
            {isValidating ? "Validating..." : (isCompleted ? "Campaign Ended" : "Participate & Earn")}
          </button>
        </div>
      </main>

      <BottomNav active="campaign" />

      <UIFeedback
        isOpen={feedback.isOpen}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
        onConfirm={feedback.onConfirm}
      />
    </div>
  );
}
