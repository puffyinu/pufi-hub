"use client";

import Link from "next/link";
import DashboardTopBar from "@/app/components/DashboardTopBar";
import BottomNav from "@/app/components/BottomNav";
import { useCampaign } from "@/app/hooks/useCampaign";
import { Campaign } from "@/app/types/campaign";

export default function CreatorPage() {
  const { campaigns } = useCampaign();
  
  const myCampaigns = campaigns.filter(c => c.createdBy === "advertiser-1");

  return (
    <div className="relative min-h-screen bg-[#0D1125] text-white font-sans selection:bg-[#FFC857]/30">
      
      {/* Background Layers */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A1757] via-[#181633] to-[#0D1125]" />
        <div className="pointer-events-none absolute -top-40 -left-32 h-[420px] w-[420px] rounded-full bg-purple-600/20 blur-[140px]" />
        <div className="pointer-events-none absolute top-0 right-[-80px] h-[260px] w-[260px] rounded-full bg-[#FFC857]/10 blur-[120px]" />
      </div>

      <div className="relative z-0 mx-auto flex max-w-[480px] flex-col px-2">
        <DashboardTopBar />

        <main className="flex-1 pt-4 pb-32 px-4">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase">
              My Campaigns
            </h1>
            <div className="h-1 w-8 bg-[#FFC857] rounded-full blur-[1px]" />
          </div>

          <div className="space-y-6">
            {myCampaigns.length > 0 ? (
              myCampaigns.map((campaign, index) => (
                <div key={campaign.id}>
                  <SectionTitle title={`SLOT #${index + 1}`} />
                  <CampaignCard campaign={campaign} />
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">No active campaigns</p>
                <p className="text-slate-400 text-xs mt-1">Start by adding your first ad campaign.</p>
              </div>
            )}

            {/* Fill remaining slots with placeholders if less than 2 */}
            {myCampaigns.length < 2 && Array.from({ length: 2 - myCampaigns.length }).map((_, i) => (
              <div key={`empty-${i}`}>
                <SectionTitle title={`FREE SLOT #${myCampaigns.length + i + 1}`} />
                <EmptySlot />
              </div>
            ))}

            <div>
              <SectionTitle title="PREMIUM SLOT #3" />
              <LockedSlot price="2 USDC" />
            </div>

            <div>
              <SectionTitle title="PREMIUM SLOT #4" />
              <LockedSlot price="3 USDC" />
            </div>

            <div>
              <SectionTitle title="PREMIUM SLOT #5" />
              <LockedSlot price="5 USDC" />
            </div>
          </div>
        </main>

        {/* Floating Add Button */}
        <div className="fixed bottom-24 left-1/2 w-full max-w-[440px] -translate-x-1/2 px-6 z-40">
          <Link href="/creator/create">
            <button className="w-full h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black uppercase tracking-widest shadow-[0_8px_25px_rgba(124,58,237,0.4)] transition-all active:scale-95 hover:brightness-110">
              ＋ ADD ADS
            </button>
          </Link>
        </div>

        <BottomNav active="creator" />
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div className="mb-3 px-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
      {title}
    </div>
  );
}

function EmptySlot() {
  return (
    <div className="mb-4 flex h-[200px] flex-col items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] shadow-inner">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Available Slot</p>
    </div>
  );
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  return (
    <div className="mb-4 rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-xl">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20 text-2xl">
          {campaign.logo ? <img src={campaign.logo} alt="" className="w-full h-full object-cover rounded-xl" /> : "🚀"}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-sm line-clamp-1">{campaign.title}</h3>
            <span className={`rounded-md px-2 py-0.5 text-[9px] font-black tracking-widest ${campaign.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400' : 'bg-slate-500/10 text-slate-400'}`}>
              {campaign.status === 'ACTIVE' ? '🟢 LIVE' : '⚪️ ENDED'}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400 line-clamp-1">
            {campaign.description}
          </p>
        </div>
      </div>

      <div className="my-4 h-px bg-white/5" />

      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-[9px] font-black uppercase tracking-tighter text-slate-500">Budget</div>
          <div className="text-sm font-bold text-white">{campaign.budget} {campaign.rewardToken}</div>
        </div>
        <div className="border-x border-white/5">
          <div className="text-[9px] font-black uppercase tracking-tighter text-slate-500">Left</div>
          <div className="text-sm font-bold text-white">{campaign.remainingClicks}</div>
        </div>
        <div>
          <div className="text-[9px] font-black uppercase tracking-tighter text-slate-500">Reward</div>
          <div className="text-sm font-bold text-white">{campaign.rewardAmount} {campaign.rewardToken}</div>
        </div>
      </div>

      <div className="my-4 h-px bg-white/5" />

      <div className="flex gap-2">
        <button className="flex-1 rounded-xl bg-white/5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all opacity-50 cursor-not-allowed">
          EDIT
        </button>
        <button className="flex-1 rounded-xl bg-violet-600/20 py-2 text-[10px] font-black uppercase tracking-widest text-violet-400 transition-all opacity-50 cursor-not-allowed">
          ADD POOL
        </button>
        <button className="flex-1 rounded-xl bg-red-500/10 py-2 text-[10px] font-black uppercase tracking-widest text-red-400 transition-all opacity-50 cursor-not-allowed">
          DELETE
        </button>
      </div>
    </div>
  );
}

function LockedSlot({ price }: { price: string }) {
  return (
    <div className="mb-4 flex flex-col items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] py-8 shadow-inner">
      <div className="mb-3 text-3xl opacity-40 grayscale">🔒</div>
      <h3 className="text-sm font-bold text-white/60">Unlock Slot</h3>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">One-Time Payment</p>
      <div className="mt-4 rounded-full bg-violet-600/10 px-4 py-1 text-sm font-black text-violet-400">
        {price}
      </div>
    </div>
  );
}
