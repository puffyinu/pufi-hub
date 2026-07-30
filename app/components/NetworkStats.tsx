"use client";

import { useLanguage } from "@/app/context/LanguageContext";

export default function NetworkStats() {
  const { t } = useLanguage();

  const STATS = [
    {
      label: t("campaigns_joined"),
      value: "0",
      icon: "🎯",
    },
    {
      label: t("claim"),
      value: "0",
      icon: "🎁",
    },
    {
      label: t("total_rewards"),
      value: "0 PUFI",
      icon: "💰",
    },
    {
      label: t("activity_log"),
      value: "0",
      icon: "📈",
    },
  ];

  return (
    <div className="w-full">
      <h3 className="text-[#FFC857]/50 text-[10px] font-black uppercase tracking-widest mb-3 px-2">
        {t("performance_hub")}
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="bg-white/5 backdrop-blur-xl rounded-3xl p-5 border border-white/10 shadow-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-3 opacity-10 transition-opacity pointer-events-none">
               <span className="text-4xl grayscale">{stat.icon}</span>
            </div>

            <div className="flex flex-col items-start justify-between min-h-[80px]">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-[#FFC857]/10 text-[#FFC857] text-xl border border-[#FFC857]/20 shrink-0">
                {stat.icon}
              </div>

              <div className="mt-4">
                <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">
                  {stat.label}
                </p>

                <p className="text-white text-lg font-black tracking-tight">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}