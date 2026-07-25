"use client";

import Link from "next/link";
import { useState } from "react";
import DashboardTopBar from "@/app/components/DashboardTopBar";
import BottomNav from "@/app/components/BottomNav";
import { useCampaign } from "@/app/hooks/useCampaign";
import { Campaign } from "@/app/types/campaign";
import { updateCampaign, deleteCampaign, addPool } from "@/app/services/campaignEngine";
import EditCampaignModal from "@/app/components/EditCampaignModal";
import UIFeedback from "@/app/components/UIFeedback";

const DEFAULT_LOGO = "/images/brand/pufi-logo.png";

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
    <div className="mb-4 flex h-[200px] flex-col items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] shadow-inner transition-all hover:bg-white/[0.05]">
      <Link href="/creator/create" className="flex flex-col items-center justify-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available Slot</p>
        <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-violet-500">Create Campaign →</p>
      </Link>
    </div>
  );
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Feedback State
  const [feedback, setFeedback] = useState<{
    isOpen: boolean;
    type: "alert" | "confirm";
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    type: "alert",
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const handleSaveEdit = (values: Partial<Campaign>) => {
    updateCampaign({ 
      ...campaign, 
      ...values 
    });
  };

  const handleAddPool = () => {
    // Simplified: Always add 100 claims for now to avoid prompt()
    const claims = 100;
    addPool(campaign.id, claims, claims * campaign.rewardAmount);
    setFeedback({
      isOpen: true,
      type: "alert",
      title: "Pool Updated",
      message: `Successfully added ${claims} claims to the pool!`,
      onConfirm: () => setFeedback(f => ({ ...f, isOpen: false })),
    });
  };

  const handleDelete = () => {
    setFeedback({
      isOpen: true,
      type: "confirm",
      title: "Delete Campaign",
      message: `Are you sure you want to delete "${campaign.title}"?`,
      onConfirm: () => {
        setIsDeleting(true);
        const success = deleteCampaign(campaign.id);
        if (!success) setIsDeleting(false);
        setFeedback(f => ({ ...f, isOpen: false }));
      },
    });
  };

  if (isDeleting) return null;

  return (
    <>
      <div className="mb-4 rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20 text-2xl overflow-hidden">
            <img 
              src={campaign.logo || DEFAULT_LOGO} 
              alt="" 
              className="w-full h-full object-cover rounded-xl" 
              onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_LOGO; }}
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm line-clamp-1">{campaign.title}</h3>
              <span className={`rounded-md px-2 py-0.5 text-[9px] font-black tracking-widest ${campaign.status === 'LIVE' ? 'bg-green-500/10 text-green-400' : 'bg-slate-500/10 text-slate-400'}`}>
                {campaign.status === 'LIVE' ? '🟢 LIVE' : `⚪️ ${campaign.status}`}
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
            <div className="text-sm font-bold text-white">
              {Number.isInteger(campaign.budget || 0) ? (campaign.budget || 0).toLocaleString() : Number((campaign.budget || 0).toFixed(3)).toLocaleString()} {campaign.rewardToken || "PUFI"}
            </div>
          </div>
          <div className="border-x border-white/5">
            <div className="text-[9px] font-black uppercase tracking-tighter text-slate-500">Progress</div>
            <div className="text-sm font-bold text-white">{campaign.claimedCount} / {campaign.maxClaims}</div>
          </div>
          <div>
            <div className="text-[9px] font-black uppercase tracking-tighter text-slate-500">Reward</div>
            <div className="text-sm font-bold text-white">
              {Number.isInteger(campaign.rewardAmount || 0) ? (campaign.rewardAmount || 0) : Number((campaign.rewardAmount || 0).toFixed(3))} {campaign.rewardToken || "PUFI"}
            </div>
          </div>
        </div>

        <div className="my-4 h-px bg-white/5" />

        <div className="flex gap-2">
          <button 
            onClick={() => setShowEditModal(true)}
            className="flex-1 rounded-xl bg-white/5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all hover:bg-white/10 active:scale-95"
          >
            EDIT
          </button>
          <button 
            onClick={handleAddPool}
            className="flex-1 rounded-xl bg-violet-600/20 py-2 text-[10px] font-black uppercase tracking-widest text-violet-400 transition-all hover:bg-violet-600/30 active:scale-95"
          >
            ADD POOL
          </button>
          <button 
            onClick={handleDelete}
            className="flex-1 rounded-xl bg-red-500/10 py-2 text-[10px] font-black uppercase tracking-widest text-red-400 transition-all hover:bg-red-500/20 active:scale-95"
          >
            DELETE
          </button>
        </div>
      </div>

      {showEditModal && (
        <EditCampaignModal
          campaign={campaign}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEdit}
        />
      )}

      <UIFeedback
        isOpen={feedback.isOpen}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
        onConfirm={feedback.onConfirm}
        onCancel={() => setFeedback(f => ({ ...f, isOpen: false }))}
      />
    </>
  );
}

function LockedSlot({ price }: { price: string }) {
  const [feedback, setFeedback] = useState<{
    isOpen: boolean;
    type: "alert" | "confirm";
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    type: "alert",
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const handleUnlock = () => {
    setFeedback({
      isOpen: true,
      type: "confirm",
      title: "Unlock Slot",
      message: `Unlock premium slot for ${price}?`,
      onConfirm: () => {
        setFeedback({
          isOpen: true,
          type: "alert",
          title: "Success",
          message: "Mock Transaction Success! Premium slot unlocked.",
          onConfirm: () => setFeedback(f => ({ ...f, isOpen: false })),
        });
      },
    });
  };

  return (
    <>
      <div 
        onClick={handleUnlock}
        className="mb-4 flex cursor-pointer flex-col items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-white/[0.02] py-8 shadow-inner transition-all hover:bg-white/[0.05]"
      >
        <div className="mb-3 text-3xl opacity-40 grayscale">🔒</div>
        <h3 className="text-sm font-bold text-white/60">Unlock Slot</h3>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">One-Time Payment</p>
        <div className="mt-4 rounded-full bg-violet-600/10 px-4 py-1 text-sm font-black text-violet-400">
          {price}
        </div>
      </div>

      <UIFeedback
        isOpen={feedback.isOpen}
        type={feedback.type}
        title={feedback.title}
        message={feedback.message}
        onConfirm={feedback.onConfirm}
        onCancel={() => setFeedback(f => ({ ...f, isOpen: false }))}
      />
    </>
  );
}
