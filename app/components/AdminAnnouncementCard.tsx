"use client";

import { useEffect, useState } from "react";

const announcements = [
  {
    url: "https://worldcoin.org/mini-app?app_id=app_5613f2d20bf12c10b7c8a09d3cf97840&app_mode=mini-app",
  },
  {
    url: "https://worldcoin.org/mini-app?app_id=app_baea7d46bd43022ca80716a70537ff29&app_mode=mini-app",
  },
  {
    url: "https://worldcoin.org/mini-app?app_id=app_0e3f2e07cf3fb2e43fdddbb73d21d355&app_mode=mini-app",
  },
  {
    url: "https://worldcoin.org/mini-app?app_id=app_9da0f0443ff4a0bb886c78c96c3e9b7d&app_mode=mini-app",
  },
  {
    url: "https://worldcoin.org/mini-app?app_id=app_eaffd104d3bda895e1df76fa3dc3c917&app_mode=mini-app",
  },
];

export default function AdminAnnouncementCard() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === announcements.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const handleOpenAnnouncement = () => {
    window.open(announcements[currentIndex].url, "_self");
  };

  return (
    <section
      onClick={handleOpenAnnouncement}
      className="relative overflow-hidden cursor-pointer rounded-[20px] border border-white/10 bg-white/5 p-2.5 backdrop-blur-2xl transition-all hover:bg-white/10 active:scale-[0.98] group shadow-2xl"
    >
      <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-violet-600/10 blur-2xl transition-all group-hover:bg-violet-600/20" />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/20 text-base shadow-inner">
            📢
          </div>
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-white leading-tight">
              Admin <span className="text-violet-400">Ads</span>
            </h2>
            <p className="mt-0.5 text-[7.5px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Latest Announcements
            </p>
          </div>
        </div>

        <div className="h-5 w-5 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-[#FFC857] transition-colors">
          <span className="text-xs leading-none">›</span>
        </div>
      </div>
     
      <div className="mt-2.5 flex justify-center gap-1.5">
        {announcements.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all duration-500 ${
              index === currentIndex
                ? "w-6 bg-[#FFC857] shadow-[0_0_8px_rgba(255,200,87,0.4)]"
                : "w-1.5 bg-white/10"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
