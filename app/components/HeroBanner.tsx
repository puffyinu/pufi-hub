"use client";

import React from "react";
import { useWallet } from "@/app/hooks/useWallet";

export default function HeroBanner() {
  const { wallet } = useWallet();

  return (
    <div className="mx-auto w-full max-w-[720px] px-5 pt-6">
      <div className="relative overflow-hidden rounded-[32px] border border-white/5 bg-[#1E293B] p-6 shadow-2xl">
        {/* Ambient Glow */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6">
          {/* TOP SECTION: GREETING */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-black tracking-tight text-white">
                👋 Welcome Human
              </h2>
              <p className="text-sm font-medium text-slate-400">
                Start your daily earning session.
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-xl">
              🛡️
            </div>
          </div>

          {/* STATUS GRID */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1 rounded-2xl bg-white/5 p-4 border border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Wallet Status
              </span>
              <div className="flex items-center gap-2">
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    wallet.connected ? "bg-emerald-500 animate-pulse" : "bg-slate-600"
                  }`}
                />
                <span
                  className={`text-xs font-bold ${
                    wallet.connected ? "text-emerald-400" : "text-slate-400"
                  }`}
                >
                  {wallet.connected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1 rounded-2xl bg-white/5 p-4 border border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Verification
              </span>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-xs font-bold text-blue-400">Verified</span>
              </div>
            </div>
          </div>

          {/* QUICK OVERVIEW */}
          <div className="rounded-2xl bg-blue-500/5 border border-blue-500/10 p-4">
            <p className="text-xs leading-relaxed text-slate-300">
              You are participating in the PUFI HUB ecosystem. Complete human-verified activities to
              accumulate rewards on World Chain.
            </p>
          </div>

          {/* PRIMARY CTA */}
          <button className="group relative w-full overflow-hidden rounded-2xl bg-blue-600 py-4 text-sm font-bold text-white transition-all hover:bg-blue-500 active:scale-[0.98] shadow-lg shadow-blue-600/20">
            <span className="relative z-10">Go to Daily Claim</span>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          </button>
        </div>
      </div>
    </div>
  );
}