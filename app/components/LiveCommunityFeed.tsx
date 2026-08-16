"use client";

import { useLanguage } from "@/app/context/LanguageContext";
import { useActivity } from "@/app/hooks/useActivity";

function formatActivityTime(createdAt: string): string {
  const timestamp = new Date(createdAt);
  if (Number.isNaN(timestamp.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(timestamp);
}

export default function LiveCommunityFeed() {
  const { t } = useLanguage();
  const { activities } = useActivity();
  const recentActivities = activities.slice(0, 3);

  return (
    <section className="w-full" aria-labelledby="activity-heading">
      <div className="mb-3 flex items-center px-2">
        <h3 id="activity-heading" className="text-[#FFC857]/50 text-[10px] font-black uppercase tracking-widest">{t("activity_log")}</h3>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/5 p-2 shadow-xl backdrop-blur-xl">
        {recentActivities.length === 0 ? (
          <p className="px-4 py-5 text-center text-xs font-medium text-slate-400">{t("no_recent_activity")}</p>
        ) : recentActivities.map((item) => (
          <div key={item.id} className="flex min-h-[48px] items-center justify-between rounded-2xl px-4 py-3 transition-colors hover:bg-white/5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#FFC857]" />
              </div>
              <div className="min-w-0">
                <p className="line-clamp-1 text-xs font-bold tracking-tight text-slate-200">{item.title}</p>
                <p className="line-clamp-1 text-[10px] text-slate-400">{item.description}</p>
              </div>
            </div>
            <span className="ml-2 shrink-0 text-[9px] font-black uppercase tracking-widest text-slate-500">{formatActivityTime(item.createdAt)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
