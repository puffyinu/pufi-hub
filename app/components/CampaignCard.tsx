"use client";

import { useEffect, useState } from "react";
import { useCampaign } from "@/app/hooks/useCampaign";
import { recordClaim } from "@/app/services/campaignEngine";
import { startVisit, handleReturnToApp, checkTimeouts, cancelVisit } from "@/app/services/visitEngine";

const DEFAULT_LOGO = "/images/brand/pufi-logo.png";

export default function CampaignCard() {
  const { campaigns } = useCampaign();
  
  const visitingCampaign = campaigns.find(c => c.status === "VISITING");
  const activeVisitId = visitingCampaign?.id || null;
  const showOverlay = !!activeVisitId;

  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    const onFocus = () => {
      handleReturnToApp();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        handleReturnToApp();
      }
    });

    const timeoutInterval = setInterval(() => {
      checkTimeouts();
    }, 30000);

    const clockInterval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
      clearInterval(timeoutInterval);
      clearInterval(clockInterval);
    };
  }, []);

  const getCountdown = () => {
    if (!visitingCampaign || !visitingCampaign.visitStartedAt) return 10;
    const start = new Date(visitingCampaign.visitStartedAt).getTime();
    const elapsed = Math.floor((currentTime - start) / 1000);
    const remaining = 10 - elapsed;
    return Math.max(0, remaining);
  };

  const countdown = getCountdown();

  const hasAnyVisiting = campaigns.some(c => c.status === "VISITING");

  const readyToEarn = campaigns.filter(
    (c) =>
      (c.status === "LIVE" ||
        c.status === "VISITING" ||
        c.status === "VISITED" ||
        c.status === "CLAIM_READY" ||
        c.status === "CLAIMING") &&
      c.claimedCount < c.maxClaims
  );

  const available = campaigns.filter(
    (c) =>
      c.status === "CLAIMED" ||
      c.status === "COMPLETED" ||
      ((c.status === "LIVE" ||
        c.status === "VISITING" ||
        c.status === "VISITED" ||
        c.status === "CLAIM_READY" ||
        c.status === "CLAIMING") &&
        c.claimedCount >= c.maxClaims)
  );

  const handleVisitAction = (id: string) => {
    const result = startVisit(id);
    if (!result.success && result.message) {
      alert(result.message);
    }
  };

  const handleClaim = (id: string) => {
    const success = recordClaim(id);
    if (success) {
      alert("Reward claimed successfully! View it in Rewards Claims.");
    }
  };

  const handleLeaveAnyway = () => {
    if (activeVisitId) {
      cancelVisit(activeVisitId);
    }
  };

  const renderCard = (
    campaign: (typeof campaigns)[number]
  ) => {
    const isCompleted = campaign.claimedCount >= campaign.maxClaims || campaign.status === "COMPLETED";
    const isClaimed = campaign.status === "CLAIMED";
    const isClaimReady = campaign.status === "CLAIM_READY";
    const isVisiting = campaign.status === "VISITING";
    const isClaiming = campaign.status === "CLAIMING";
    const isBusy = hasAnyVisiting && !isVisiting;

    return (
      <div
        key={campaign.id}
        className="relative overflow-hidden rounded-[20px] border border-white/10 bg-white/5 p-2.5 backdrop-blur-2xl shadow-xl transition-all hover:bg-white/[0.07]"
      >
        <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-violet-600/5 blur-2xl" />

        <div className="flex gap-2.5">
          {/* Logo */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-violet-500/10 text-xl shadow-inner overflow-hidden">
            <img 
              src={campaign.logo || DEFAULT_LOGO} 
              alt="" 
              className="w-full h-full object-cover" 
              onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_LOGO; }}
            />
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-between py-0.5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-[12px] font-black tracking-tight text-white leading-tight">
                  {campaign.title}
                </h3>
                <p className="mt-0.5 text-[8.5px] font-bold text-slate-400 line-clamp-2 leading-tight">
                  {campaign.description}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full px-1 py-0.5 text-[6px] font-black uppercase tracking-widest ${
                  isCompleted || isClaimed
                    ? "bg-green-500/20 text-green-400 border border-green-500/20"
                    : isClaimReady
                    ? "bg-[#FFC857]/20 text-[#FFC857] border border-[#FFC857]/20"
                    : isVisiting || isClaiming || isBusy
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/20"
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/20"
                }`}
              >
                {isCompleted ? "COMPLETED" : isClaimed ? "CLAIMED" : isClaimReady ? "CLAIM READY" : isVisiting ? "VISITING" : isClaiming ? "CLAIMING" : isBusy ? "BUSY" : campaign.status}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between gap-3">
              <div>
                <p className="text-[6.5px] font-black uppercase tracking-[0.2em] text-slate-500">
                  Reward
                </p>
                <p className="text-[13px] font-black text-[#FFC857] tracking-tight">
                  {campaign.rewardAmount} <span className="text-[7.5px]">{campaign.rewardToken}</span>
                </p>
                <p className="text-[6px] font-bold text-slate-400">
                  PROGRESS {campaign.claimedCount} / {campaign.maxClaims}
                </p>
              </div>

              <button
                disabled={isCompleted || isClaimed || isVisiting || isClaiming || isBusy}
                onClick={() => {
                  if (isClaimReady) {
                    handleClaim(campaign.id);
                  } else {
                    handleVisitAction(campaign.id);
                  }
                }}
                className={`h-7 px-3.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                  isCompleted || isClaimed
                    ? "cursor-default bg-green-500/10 text-green-400 border border-green-500/10"
                    : isVisiting || isClaiming || isBusy
                    ? "cursor-wait bg-blue-500/10 text-blue-400 border border-blue-500/10"
                    : "bg-gradient-to-b from-[#FFE580] via-[#FFC857] to-[#E59400] text-[#171717] shadow-lg hover:brightness-110"
                }`}
              >
                {isCompleted || isClaimed ? "DONE" : isClaimReady ? "CLAIM NOW" : isVisiting ? "VISITING..." : isClaiming ? "CLAIMING..." : isBusy ? "BUSY" : "CLAIM"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {showOverlay && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a]/95 backdrop-blur-2xl p-6 text-center">
          <div className="relative mb-8">
            <div className="h-32 w-32 rounded-full border-4 border-white/5 flex items-center justify-center">
               <span className="text-5xl font-black text-white">{countdown}</span>
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" style={{ animationDuration: '3s' }} />
          </div>

          <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Visit Campaign</h3>
          <p className="text-sm font-bold text-slate-400 mb-8 max-w-[240px]">
            Stay on the campaign page. Reward unlocks after 10 seconds.
          </p>

          <div className="flex flex-col w-full gap-3 max-w-[280px]">
            <button 
              onClick={() => {
                if (confirm("Leave Campaign? Leaving now will cancel this visit. You will NOT receive rewards.")) {
                  handleLeaveAnyway();
                }
              }}
              className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-500/20 transition-all"
            >
              Leave Anyway
            </button>
          </div>
        </div>
      )}

      <div className="space-y-5">
        {/* READY TO EARN */}
        <section>
          <div className="mb-2.5 flex items-center gap-2 px-1">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <h2 className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500">
              Ready to Earn
            </h2>
          </div>

          <div className="space-y-2">
            {readyToEarn.length > 0 ? (
              readyToEarn.map(renderCard)
            ) : (
              <div className="py-8 text-center border border-dashed border-white/5 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">No active campaigns</p>
              </div>
            )}
          </div>
        </section>

        {/* AVAILABLE */}
        {available.length > 0 && (
          <section>
            <div className="mb-2.5 flex items-center gap-2 px-1">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-500" />
              <h2 className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500">
                Completed
              </h2>
            </div>

            <div className="space-y-2">
              {available.map(renderCard)}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
