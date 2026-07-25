"use client";

import { useState } from "react";
import { useCampaign } from "@/app/hooks/useCampaign";
import { recordClaim } from "@/app/services/campaignEngine";

const DEFAULT_LOGO = "/images/brand/pufi-logo.png";

export default function CampaignCard() {
  const { campaigns } = useCampaign();
  const [visiting, setVisiting] = useState<Record<string, boolean>>({});

  const readyToEarn = campaigns.filter(
    (c) => c.status === "LIVE" && c.claimedCount < c.maxClaims
  );

  const available = campaigns.filter(
    (c) =>
      c.status === "CLAIMED" ||
      c.status === "COMPLETED" ||
      (c.status === "LIVE" && c.claimedCount >= c.maxClaims)
  );

  const handleVisit = (id: string, url: string) => {
    window.open(url, "_blank");
    setVisiting((prev) => ({ ...prev, [id]: true }));
  };

  const handleClaim = (id: string) => {
    const success = recordClaim(id);
    if (success) {
      alert("Reward claimed successfully! Redirecting to portfolio...");
      setVisiting((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  const renderCard = (
    campaign: (typeof campaigns)[number]
  ) => {
    const isCompleted = campaign.claimedCount >= campaign.maxClaims || campaign.status === "COMPLETED";
    const isClaimed = campaign.status === "CLAIMED";
    const hasVisited = visiting[campaign.id];

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
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/20"
                }`}
              >
                {isCompleted ? "COMPLETED" : campaign.status}
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
                disabled={isCompleted || isClaimed}
                onClick={() => {
                  if (hasVisited) {
                    handleClaim(campaign.id);
                  } else {
                    handleVisit(campaign.id, campaign.miniAppUrl);
                  }
                }}
                className={`h-7 px-3.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                  isCompleted || isClaimed
                    ? "cursor-default bg-green-500/10 text-green-400 border border-green-500/10"
                    : "bg-gradient-to-b from-[#FFE580] via-[#FFC857] to-[#E59400] text-[#171717] shadow-lg hover:brightness-110"
                }`}
              >
                {isCompleted ? "DONE" : hasVisited ? "CLAIM NOW" : "CLAIM"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
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
  );
}
