"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { useActivity } from "@/app/hooks/useActivity";
import { useCampaign } from "@/app/hooks/useCampaign";
import { useReward } from "@/app/hooks/useReward";

export default function NetworkStats() {
  const { t } = useLanguage();
  const { activities } = useActivity();
  const { campaigns, loading: campaignsLoading, error: campaignsError } = useCampaign();
  const { reward } = useReward();
  const claims = activities.filter((activity) => activity.type === "claim").length;

  const stats = [
    { label: t("active_campaigns"), value: campaignsLoading ? null : String(campaigns.length), empty: !campaignsLoading && !campaignsError && campaigns.length === 0, error: campaignsError, icon: "C" },
    { label: t("claim"), value: String(claims), empty: claims === 0, error: null, icon: "R" },
    { label: t("total_rewards"), value: reward.loading ? null : `${reward.claimed} PUFI`, empty: !reward.loading && !reward.error && reward.claimed === 0, error: reward.error, icon: "$" },
    { label: t("activity_log"), value: String(activities.length), empty: activities.length === 0, error: null, icon: "A" },
  ];

  return (
    <section className="w-full" aria-labelledby="performance-heading">
      <h3 id="performance-heading" className="mb-3 px-2 text-[10px] font-black uppercase tracking-widest text-[#FFC857]/50">{t("performance_hub")}</h3>
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl">
            <div className="flex min-h-[80px] flex-col items-start justify-between">
              <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#FFC857]/20 bg-[#FFC857]/10 text-xl font-black text-[#FFC857]">{stat.icon}</span>
              <div className="mt-4">
                <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                {stat.value === null ? <div className="h-6 w-16 animate-pulse rounded bg-white/10" aria-label={t("loading")} /> : stat.error ? <p className="text-xs font-bold text-rose-300">{t("unavailable")}</p> : stat.empty ? <p className="text-xs font-bold text-slate-400">{t("no_data_yet")}</p> : <p className="text-lg font-black tracking-tight text-white">{stat.value}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
