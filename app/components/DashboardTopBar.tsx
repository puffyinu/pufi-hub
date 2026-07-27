"use client";

import Link from "next/link";
import { useLanguage } from "@/app/context/LanguageContext";

export default function DashboardTopBar() {
  const { t } = useLanguage();

  return (
    <header className="relative mx-auto flex w-full max-w-[480px] items-center justify-between bg-transparent px-4 py-5">

      {/* Brand */}
      <div className="select-none">
        <h1 className="text-xl font-black tracking-wide text-[#FFC857]">
          PUFI HUB
        </h1>

        <p className="text-[10px] uppercase tracking-[0.22em] text-slate-400">
          Human Verified Ads Marketplace
        </p>
      </div>

      {/* Right Menu */}
      <div className="flex items-center gap-2">

        {/* Language */}
        <Link
          href="/language"
          className="rounded-full p-2 text-[#FFC857] transition-all hover:bg-[#FFC857]/10 hover:scale-105"
          aria-label={t("language")}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </Link>

        {/* Settings button hidden as per BUILD-007.4 instructions */}

      </div>
    </header>
  );
}