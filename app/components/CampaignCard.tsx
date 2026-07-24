"use client";

import { useCampaign } from "@/app/hooks/useCampaign";

const icons = ["📅", "🎁", "🚀"];

export default function CampaignCard() {
  const { campaigns, completeCampaign } = useCampaign();

  const readyToEarn = campaigns.filter(
    (c) => c.status === "ACTIVE"
  );

  const available = campaigns.filter(
    (c) =>
      c.status === "CLAIMED" ||
      c.status === "COMPLETED"
  );

  const renderCard = (
    campaign: (typeof campaigns)[number],
    index: number
  ) => {
    const isClaimed =
      campaign.status === "CLAIMED" ||
      campaign.status === "COMPLETED";

    return (
      <div
        key={campaign.id}
        className="relative overflow-hidden rounded-[20px] border border-white/10 bg-white/5 p-2.5 backdrop-blur-2xl shadow-xl transition-all hover:bg-white/[0.07]"
      >
        <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-violet-600/5 blur-2xl" />

        <div className="flex gap-2.5">
          {/* Logo */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-violet-500/10 text-xl shadow-inner overflow-hidden">
            {campaign.logo ? (
              <img src={campaign.logo} alt="" className="w-full h-full object-cover" />
            ) : (
              icons[index % icons.length]
            )}
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
                  isClaimed
                    ? "bg-green-500/20 text-green-400 border border-green-500/20"
                    : "bg-blue-500/20 text-blue-400 border border-blue-500/20"
                }`}
              >
                {campaign.status}
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
                  {campaign.remainingClicks.toLocaleString()} CLICKS LEFT
                </p>
              </div>

              <button
                disabled={isClaimed || campaign.remainingClicks <= 0}
                onClick={() => {
                  const success = completeCampaign(campaign.id);
                  if (success) {
                    alert(`Claimed ${campaign.rewardAmount} ${campaign.rewardToken} successfully!`);
                  }
                }}
                className={`h-7 px-3.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                  isClaimed || campaign.remainingClicks <= 0
                    ? "cursor-default bg-green-500/10 text-green-400 border border-green-500/10"
                    : "bg-gradient-to-b from-[#FFE580] via-[#FFC857] to-[#E59400] text-[#171717] shadow-lg hover:brightness-110"
                }`}
              >
                {isClaimed ? "DONE" : campaign.remainingClicks <= 0 ? "ENDED" : "GO"}
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
          {readyToEarn.map(renderCard)}
        </div>
      </section>

      {/* AVAILABLE */}
      <section>
        <div className="mb-2.5 flex items-center gap-2 px-1">
          <div className="h-1.5 w-1.5 rounded-full bg-slate-500" />
          <h2 className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-500">
            Available Soon
          </h2>
        </div>

        <div className="space-y-2">
          {available.map(renderCard)}
        </div>
      </section>
    </div>
  );
}
