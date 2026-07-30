'use client';

import React from 'react';
import Link from 'next/link';
import AppBackground from '@/app/components/layout/AppBackground';

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#0D1125] text-slate-100 pb-32 overflow-hidden font-sans selection:bg-[#FFC857]/30 select-none">
      
      <AppBackground />

      {/* Main Container */}
      <div className="relative z-10 max-w-md mx-auto px-4 pt-4 space-y-6">
        
        {/* Top Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden ring-2 ring-indigo-500/30 bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-900/40">
              <span className="text-white font-black text-base tracking-wider">PU</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="text-base font-black tracking-tight text-white uppercase">PUFI HUB</h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1" />
                  Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">World Chain Ecosystem</p>
            </div>
          </div>

          {/* Verified Badge */}
          <div className="flex items-center space-x-1.5 bg-white/5 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/10 text-[11px] text-slate-300 shadow-sm">
            <span className="text-xs">🛡️</span>
            <span className="font-bold uppercase tracking-wider text-[10px]">Verified ID</span>
          </div>
        </div>

        {/* Hero Portfolio Card */}
        <div className="relative rounded-3xl p-6 bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Total Portfolio Value</p>
              <h2 className="text-3xl font-black text-white mt-1 tracking-tight">1,245.80 <span className="text-xs font-black text-[#FFC857] uppercase tracking-widest">PUFI</span></h2>
            </div>
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-inner">
              <span className="text-xl">🪙</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Daily Yield</p>
              <p className="text-xs font-bold text-emerald-400 mt-1 flex items-center">
                📈 +14.2%
              </p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Staked Power</p>
              <p className="text-xs font-bold text-white mt-1">500.00 PUFI</p>
            </div>
          </div>
        </div>

        {/* Quick Action Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/claim" className="group p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-indigo-500/50 transition-all shadow-xl flex flex-col justify-between active:scale-95 touch-manipulation">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-lg">
                🔥
              </div>
              <span className="text-slate-500 group-hover:text-indigo-400 transition-colors text-xs font-bold">→</span>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-white">Daily Claim</h3>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Claim reward harian</p>
            </div>
          </Link>

          <Link href="/campaign" className="group p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-indigo-500/50 transition-all shadow-xl flex flex-col justify-between active:scale-95 touch-manipulation">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-lg">
                ⚡
              </div>
              <span className="text-slate-500 group-hover:text-indigo-400 transition-colors text-xs font-bold">→</span>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-white">Campaigns</h3>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Jelajahi sponsor aktif</p>
            </div>
          </Link>
        </div>

        {/* Featured Campaign Card */}
        <div className="rounded-3xl p-5 bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Featured Campaign</h3>
            </div>
            <Link href="/campaign" className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors">
              View All →
            </Link>
          </div>

          <Link href="/campaign" className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between space-x-3 group cursor-pointer hover:border-indigo-500/40 transition-all">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-lg shadow-md shrink-0">
                🎁
              </div>
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">World Chain Airdrop Pool</h4>
                <p className="text-[10px] text-slate-400 font-medium">Reward Pool: 50,000 PUFI</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
              Active
            </span>
          </Link>
        </div>

        {/* Footer info */}
        <div className="text-center pt-2">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">PUFI HUB Mini App • Secured by World ID</p>
        </div>

      </div>
    </div>
  );
}