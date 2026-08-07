"use client";

import { SettlementPlan } from "@/app/services/campaignSettlementEngine";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCampaign } from "@/app/hooks/useCampaign";
import { canCreateCampaign } from "@/app/services/campaignEngine";
import CampaignForm from "@/app/components/CampaignForm";
import { Campaign } from "@/app/types/campaign";
import AppBackground from "@/app/components/layout/AppBackground";

export default function CreateCampaignPage() {
  const router = useRouter();
  const { createCampaign } = useCampaign();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCapacityReached, setShowCapacityReached] = useState(false);

  const ADVERTISER_ID = "advertiser-1";

  useEffect(() => {
    if (!canCreateCampaign(ADVERTISER_ID)) {
      Promise.resolve().then(() => setShowCapacityReached(true));
    }
  }, []);

  const handleCreate = async (values: Partial<Campaign>, settlementPlan: SettlementPlan) => {
    setIsSubmitting(true);
      // ...

    try {
      createCampaign({
        title: values.title!,
        description: values.description!,
        logo: values.logo!,
        miniAppUrl: values.miniAppUrl!,
        rewardToken: values.rewardToken!,
        rewardAmount: values.rewardAmount!,
        budget: values.budget!,
        maxClaims: values.maxClaims!,
        createdBy: ADVERTISER_ID,
      }, settlementPlan);

      router.push("/creator");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className="relative min-h-screen text-white"
      style={{
        maxWidth: 600,
        margin: "0 auto",
        padding: "16px 20px",
        paddingBottom: 40,
      }}
    >
      <AppBackground />
      {showCapacityReached && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-6 backdrop-blur-sm">
          <div className="w-full max-w-[340px] overflow-hidden rounded-[32px] border border-white/10 bg-[#1A1D2E] p-8 text-center shadow-2xl">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-600/10 text-4xl">
                🔒
              </div>
            </div>
            <h2 className="mb-2 text-xl font-black uppercase tracking-tight text-white">Campaign Capacity Reached</h2>
            <p className="mb-8 text-xs font-medium text-slate-400">Unlock flow will be implemented in Phase 2.</p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => router.push("/creator")}
                className="h-12 w-full rounded-2xl bg-white/5 text-[11px] font-black uppercase tracking-widest text-slate-400"
              >
                Back to Campaigns
              </button>
            </div>
          </div>
        </div>
      )}

      <Link
        href="/creator"
        style={{
          color: "#94A3B8",
          textDecoration: "none",
          fontSize: 13,
          fontWeight: 600,
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          marginBottom: 16,
        }}
      >
        ← Back
      </Link>

      <h1
        style={{
          color: "#FFFFFF",
          fontSize: 18,
          fontWeight: 800,
          marginTop: 0,
          marginBottom: 24,
          letterSpacing: "-0.02em",
        }}
      >
        CREATE CAMPAIGN
      </h1>

      <CampaignForm 
        mode="create"
        isSubmitting={isSubmitting}
        onSubmit={handleCreate}
      />
    </main>
  );
}
