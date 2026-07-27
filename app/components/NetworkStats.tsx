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
    <div className="mx-4 mb-4">
      <h3 className="text-[#FFC857]/40 text-[9px] font-black uppercase tracking-[0.4em] mb-3 px-2">
        {t("performance_hub")}
      </h3>

      <div className="grid grid-cols-2 gap-2.5">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#1A1635]/40 backdrop-blur-xl rounded-[24px] p-5 border border-white/5 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
               <span className="text-3xl grayscale">{stat.icon}</span>
            </div>

            <div className="flex flex-col items-start justify-between min-h-[80px]">
              <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#FFC857]/10 text-[#FFC857] text-lg border border-[#FFC857]/20">
                {stat.icon}
              </div>

              <div className="mt-4">
                <p className="text-slate-500 text-[8px] font-black uppercase tracking-[0.2em] mb-0.5">
                  {stat.label}
                </p>

                <p className="text-white text-lg font-black tracking-tighter">
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