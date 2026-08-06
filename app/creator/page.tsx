"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import DashboardTopBar from "@/app/components/DashboardTopBar";
import BottomNav from "@/app/components/BottomNav";
import { useCampaign } from "@/app/hooks/useCampaign";
import { Campaign } from "@/app/types/campaign";
import {
  updateCampaign,
  deleteCampaign,
  addPool,
} from "@/app/services/campaignEngine";
import { getCampaignCapacity } from "@/app/services/campaignUnlockService";
import EditCampaignModal from "@/app/components/EditCampaignModal";
import AddPoolModal from "@/app/components/AddPoolModal";
import UIFeedback from "@/app/components/UIFeedback";
import AppBackground from "@/app/components/layout/AppBackground";

const DEFAULT_LOGO = "/images/brand/pufi-logo.png";

export default function CreatorPage() {
  const { campaigns } = useCampaign();
  const [showCapacityReached, setShowCapacityReached] = useState(false);
  
  const myCampaigns = campaigns.filter(c => c.createdBy === "advertiser-1");
  const campaignCapacity = getCampaignCapacity("advertiser-1");
  const isAtCapacity = myCampaigns.length >= campaignCapacity;

  return (
    <div className="relative min-h-screen bg-[#0D1125] text-white font-sans selection:bg-[#FFC857]/30">
      
      <AppBackground />

      <div className="relative z-0 mx-auto flex max-w-md flex-col px-2">
        <DashboardTopBar />

        <main className="flex-1 pt-4 pb-32 px-4">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-black tracking-tighter text-white uppercase">
                My Campaigns
              </h1>
              <div className="h-1 w-8 bg-[#FFC857] rounded-full blur-[1px]" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Capacity</span>
              <span className="text-sm font-bold text-white">{myCampaigns.length} / {campaignCapacity} Campaigns</span>
            </div>
          </div>

          <div className="space-y-6">
            {myCampaigns.length > 0 ? (
              myCampaigns.map((campaign, index) => (
                <div key={campaign.id}>
                  <SectionTitle title={`CAMPAIGN #${index + 1}`} />
                  <CampaignCard campaign={campaign} />
                </div>
              ))
            ) : (
              <div className="py-12 text-center rounded-2xl border border-dashed border-white/10 bg-white/5">
                <p className="text-slate-400 font-bold text-sm">No campaigns yet.</p>
                <Link href="/creator/create" className="mt-5 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-violet-600 px-5 text-[10px] font-black uppercase tracking-widest text-white transition-transform active:scale-95 touch-manipulation">
                  ＋ Create Campaign
                </Link>
              </div>
            )}
          </div>
        </main>

        {myCampaigns.length > 0 && (
          <div className="fixed bottom-20 left-1/2 w-full max-w-md -translate-x-1/2 px-6 z-40 pb-[env(safe-area-inset-bottom)]">
            {isAtCapacity ? (
              <button
                type="button"
                onClick={() => setShowCapacityReached(true)}
                className="w-full min-h-[56px] rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black uppercase tracking-widest shadow-[0_8px_25px_rgba(124,58,237,0.4)] transition-transform active:scale-95 touch-manipulation"
              >
                ＋ Add Campaign
              </button>
            ) : (
              <Link href="/creator/create" className="block w-full">
                <span className="flex min-h-[56px] w-full items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black uppercase tracking-widest shadow-[0_8px_25px_rgba(124,58,237,0.4)] transition-transform active:scale-95 touch-manipulation">
                  ＋ Add Campaign
                </span>
              </Link>
            )}
          </div>
        )}

        <BottomNav active="creator" />
      </div>

      <UIFeedback
        isOpen={showCapacityReached}
        type="alert"
        title="Campaign Capacity Reached"
        message="Campaign capacity reached. Unlock flow will be implemented later."
        onConfirm={() => setShowCapacityReached(false)}
      />
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

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddPoolModal, setShowAddPoolModal] = useState(false);
  
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

  const formatAmount = (value: number) => {
    const rounded = Math.round(value * 1e6) / 1e6;
    if (Number.isInteger(rounded)) {
      return rounded.toLocaleString();
    }
    return rounded.toFixed(3);
  };

  const handleSaveEdit = (values: Partial<Campaign>) => {
    updateCampaign({ 
      ...campaign, 
      ...values 
    });
  };

  const handleConfirmAddPool = (token: string, amount: number, clicks: number) => {
    addPool(campaign.id, clicks, amount, token);
    setFeedback({
      isOpen: true,
      type: "alert",
      title: "Pool Updated",
      message: `Successfully added ${clicks} claims to the pool!`,
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

  const remainingClicks = campaign.maxClaims - campaign.claimedCount;
  const isActive = campaign.status === "LIVE" && remainingClicks > 0;

  return (
    <>
      <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl shadow-xl transition-colors hover:bg-white/[0.07]">
        <div className="flex items-center gap-4">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 shadow-inner overflow-hidden">
            <Image 
              src={campaign.logo || DEFAULT_LOGO} 
              alt={campaign.title || "Campaign Logo"} 
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-white text-sm line-clamp-1">{campaign.title}</h3>
              <span className={`shrink-0 rounded-md px-2 py-1 text-[9px] font-black uppercase tracking-widest ${campaign.status === 'LIVE' ? 'bg-green-500/10 text-green-400' : 'bg-slate-500/10 text-slate-400'}`}>
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
            <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">Budget</div>
            <div className="text-sm font-bold text-white mt-1">
              {formatAmount(campaign.budget || 0)} <span className="text-[10px]">{campaign.rewardToken || "PUFI"}</span>
            </div>
          </div>
          <div className="border-x border-white/5">
            <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">Progress</div>
            <div className="text-sm font-bold text-white mt-1">{campaign.claimedCount} / {campaign.maxClaims}</div>
          </div>
          <div>
            <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">Reward</div>
            <div className="text-sm font-bold text-white mt-1">
              {formatAmount(campaign.rewardAmount || 0)} <span className="text-[10px]">{campaign.rewardToken || "PUFI"}</span>
            </div>
          </div>
        </div>

        {!isActive && (
          <>
            <div className="my-4 h-px bg-white/5" />

            <div className="flex gap-2">
              <button 
                onClick={() => setShowEditModal(true)}
                className="flex-1 flex items-center justify-center min-h-[44px] rounded-xl bg-white/5 px-2 text-[10px] font-black uppercase tracking-widest text-slate-400 transition-all hover:bg-white/10 active:scale-95 touch-manipulation"
              >
                EDIT
              </button>
              <button 
                onClick={() => setShowAddPoolModal(true)}
                className="flex-1 flex items-center justify-center min-h-[44px] rounded-xl bg-violet-600/20 px-2 text-[10px] font-black uppercase tracking-widest text-violet-400 transition-all hover:bg-violet-600/30 active:scale-95 touch-manipulation"
              >
                ADD POOL
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 flex items-center justify-center min-h-[44px] rounded-xl bg-red-500/10 px-2 text-[10px] font-black uppercase tracking-widest text-red-400 transition-all hover:bg-red-500/20 active:scale-95 touch-manipulation"
              >
                DELETE
              </button>
            </div>
          </>
        )}
      </div>

      {showEditModal && (
        <EditCampaignModal
          campaign={campaign}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEdit}
        />
      )}

      {showAddPoolModal && (
        <AddPoolModal
          campaign={campaign}
          onClose={() => setShowAddPoolModal(false)}
          onConfirm={handleConfirmAddPool}
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
