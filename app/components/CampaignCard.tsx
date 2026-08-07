"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCampaign } from "@/app/hooks/useCampaign";
import { recordClaim } from "@/app/services/campaignEngine";
import { startVisit, handleReturnToApp, checkTimeouts, cancelVisit } from "@/app/services/visitEngine";
import UIFeedback from "./UIFeedback";

const DEFAULT_LOGO = "/images/brand/pufi-logo.png";

export default function CampaignCard() {
  const { campaigns, loading, error } = useCampaign();
  
  const visitingCampaign = campaigns.find(c => c.status === "VISITING");
  const activeVisitId = visitingCampaign?.id || null;
  const showOverlay = !!activeVisitId;

  const [currentTime, setCurrentTime] = useState(() => Date.now());
  
  // Feedback State
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
    const onFocus = () => {
      handleReturnToApp(undefined, (message) => {
        setFeedback({
          isOpen: true,
          type: "alert",
          title: "Visit Incomplete",
          message,
          onConfirm: () => setFeedback(f => ({ ...f, isOpen: false })),
        });
      });
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        handleReturnToApp(undefined, (message) => {
          setFeedback({
            isOpen: true,
            type: "alert",
            title: "Visit Incomplete",
            message,
            onConfirm: () => setFeedback(f => ({ ...f, isOpen: false })),
          });
        });
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
      setFeedback({
        isOpen: true,
        type: "alert",
        title: "Visit Error",
        message: result.message,
        onConfirm: () => setFeedback(f => ({ ...f, isOpen: false })),
      });
    }
  };

  const handleClaim = (id: string) => {
    const success = recordClaim(id);
    if (success) {
      setFeedback({
        isOpen: true,
        type: "alert",
        title: "Claim Success",
        message: "Reward claimed successfully! View it in Rewards Claims.",
        onConfirm: () => setFeedback(f => ({ ...f, isOpen: false })),
      });
    }
  };

  const handleLeaveAnyway = () => {
    if (activeVisitId) {
      cancelVisit(activeVisitId);
    }
  };

  const formatAmount = (value: number) => {
    const rounded = Math.round(value * 1e6) / 1e6;
    if (Number.isInteger(rounded)) {
      return rounded.toString();
    }
    return rounded.toFixed(3);
  };

  const renderSkeleton = () => (
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl animate-pulse"
        >
          <div className="flex gap-4">
            <div className="h-14 w-14 shrink-0 rounded-xl bg-white/10" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-white/10" />
              <div className="h-3 w-1/2 rounded bg-white/10" />
              <div className="mt-4 flex items-center justify-between">
                <div className="h-8 w-20 rounded bg-white/10" />
                <div className="h-10 w-24 rounded bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCard = (campaign: (typeof campaigns)[number]) => {
    const isCompleted = campaign.claimedCount >= campaign.maxClaims || campaign.status === "COMPLETED";
    const isClaimed = campaign.status === "CLAIMED";
    const isClaimReady = campaign.status === "CLAIM_READY";
    const isVisiting = campaign.status === "VISITING";
    const isClaiming = campaign.status === "CLAIMING";
    const isBusy = hasAnyVisiting && !isVisiting;

    // Local state fallback untuk error gambar per kartu (menggunakan logo default jika URL rusak)
    const logoSrc = campaign.logo || DEFAULT_LOGO;

    return (
      <div
        key={campaign.id}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-2xl shadow-xl transition-all hover:bg-white/[0.07]"
      >
        {/* Dekorasi Background Glow */}
        <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-violet-600/5 blur-2xl pointer-events-none" />

        <div className="flex gap-4">
          {/* Logo Section */}
          <Link href={`/campaign/${campaign.id}`} className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 shadow-inner overflow-hidden active:scale-95 transition-transform">
            <Image 
              src={logoSrc} 
              alt={campaign.title || "Campaign Logo"} 
              fill
              unoptimized
              className="object-cover"
            />
          </Link>

          {/* Content Section */}
          <div className="flex flex-1 flex-col justify-between">
            <div className="flex items-start justify-between gap-2">
              <Link href={`/campaign/${campaign.id}`} className="flex-1 active:opacity-70 transition-opacity">
                <h3 className="text-sm font-black tracking-tight text-white leading-tight">
                  {campaign.title}
                </h3>
                <p className="mt-1 text-xs font-semibold text-slate-400 line-clamp-2 leading-snug">
                  {campaign.description}
                </p>
              </Link>

              <span
                className={`shrink-0 rounded-md px-2 py-1 text-[9px] font-black uppercase tracking-widest ${
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

            <div className="mt-3 flex items-center justify-between gap-3">
              <Link href={`/campaign/${campaign.id}`} className="flex-1 active:opacity-70 transition-opacity">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                  Reward
                </p>
                <p className="text-base font-black text-[#FFC857] tracking-tight">
                  {formatAmount(campaign.rewardAmount || 0)}{" "}
                  <span className="text-[10px]">{campaign.rewardToken || "PUFI"}</span>
                </p>
                <p className="text-[9px] font-bold text-slate-400 mt-0.5">
                  PROGRESS {campaign.claimedCount} / {campaign.maxClaims}
                </p>
              </Link>

              {/* Action Button - Touch target dioptimalkan (min-h-[44px]) */}
              <button
                disabled={isCompleted || isClaimed || isVisiting || isClaiming || isBusy}
                onClick={() => {
                  if (isClaimReady) {
                    handleClaim(campaign.id);
                  } else {
                    handleVisitAction(campaign.id);
                  }
                }}
                className={`min-h-[44px] min-w-[100px] px-4 flex items-center justify-center rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 touch-manipulation z-10 relative ${
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
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-2xl p-6 text-center select-none">
          <div className="relative mb-8">
            <div className="h-32 w-32 rounded-full border-4 border-white/5 flex items-center justify-center">
               <span className="text-5xl font-black text-white">{countdown}</span>
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" style={{ animationDuration: '3s' }} />
          </div>

          <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Visit Campaign</h3>
          <p className="text-base font-bold text-slate-400 mb-8 max-w-[280px] leading-relaxed">
            Stay on the campaign page. Reward unlocks after 10 seconds.
          </p>

          <div className="flex flex-col w-full gap-3 max-w-[280px]">
            <button 
              onClick={() => {
                setFeedback({
                  isOpen: true,
                  type: "confirm",
                  title: "Leave Campaign?",
                  message: "Leaving now will cancel this visit. You will NOT receive rewards.",
                  onConfirm: () => {
                    handleLeaveAnyway();
                    setFeedback(f => ({ ...f, isOpen: false }));
                  },
                });
              }}
              className="w-full min-h-[44px] py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-sm font-black uppercase tracking-widest text-red-500 hover:bg-red-500/20 transition-all active:scale-95 touch-manipulation"
            >
              Leave Anyway
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* READY TO EARN */}
        <section>
          <div className="mb-3 flex items-center gap-2 px-1">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
              Ready to Earn
            </h2>
          </div>

          <div className="space-y-3">
            {loading ? (
              renderSkeleton()
            ) : error ? (
              <div className="py-10 text-center border border-dashed border-red-500/30 rounded-2xl bg-red-500/5">
                <p className="text-xs font-bold text-red-400 uppercase tracking-widest">Error: {error}</p>
              </div>
            ) : readyToEarn.length > 0 ? (
              readyToEarn.map(renderCard)
            ) : (
              <div className="py-10 text-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No active campaigns</p>
              </div>
            )}
          </div>
        </section>

        {/* AVAILABLE / COMPLETED */}
        {!loading && available.length > 0 && (
          <section>
            <div className="mb-3 flex items-center gap-2 px-1">
              <div className="h-2 w-2 rounded-full bg-slate-600" />
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">
                Completed
              </h2>
            </div>

            <div className="space-y-3">
              {available.map(renderCard)}
            </div>
          </section>
        )}
      </div>

      <UIFeedback
        isOpen={feedback.isOpen}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
        onConfirm={feedback.onConfirm}
        onCancel={() => setFeedback(f => ({ ...f, isOpen: false }))}
      />
    </>
  );
}