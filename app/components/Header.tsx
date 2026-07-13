"use client";

import React from "react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0F172A]/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-[720px] items-center justify-between px-5 py-3 pt-[calc(0.75rem+env(safe-area-inset-top))]">
        {/* LEFT: LOGO & SUBTITLE */}
        <div className="flex flex-col">
          <h1 className="text-xl font-black tracking-tight text-white">
            PUFI <span className="text-blue-500">HUB</span>
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Human Verified Ads Marketplace
          </p>
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center gap-2">
          {/* MOCK NOTIFICATION */}
          <button className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white active:scale-95">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
            <span className="absolute right-2.5 top-2.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
            </span>
          </button>

          {/* MOCK AVATAR */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}