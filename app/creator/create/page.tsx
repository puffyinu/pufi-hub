"use client";

import { SettlementPlan, buildSettlementCalldata } from "@/app/services/campaignSettlementEngine";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCampaign } from "@/app/hooks/useCampaign";
import { useTransaction } from "@/app/hooks/useTransaction";
import { useWallet } from "@/app/hooks/useWallet";
import { useUserOperationReceipt } from "@/app/hooks/useUserOperationReceipt";
import { getTransactionState } from "@/app/services/transactionSession";
import { canCreateCampaign } from "@/app/services/campaignEngine";
import CampaignForm from "@/app/components/CampaignForm";
import { Campaign } from "@/app/types/campaign";
import AppBackground from "@/app/components/layout/AppBackground";
import { TOKEN_CONTRACTS, getSettlementContract } from "@/app/services/contracts";

const WORLD_CHAIN_ID = 480;

export default function CreateCampaignPage() {
  const router = useRouter();
  const { createCampaign } = useCampaign();
  const { send, reset } = useTransaction();
  const { wallet } = useWallet();
  const { getReceipt } = useUserOperationReceipt();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCapacityReached, setShowCapacityReached] = useState(false);

  const ADVERTISER_ID = wallet.address ?? "advertiser-1";

  useEffect(() => {
    if (!canCreateCampaign(ADVERTISER_ID)) {
      Promise.resolve().then(() => setShowCapacityReached(true));
    }
  }, [ADVERTISER_ID]);

  const handleCreate = async (values: Partial<Campaign>, settlementPlan: SettlementPlan) => {
    setIsSubmitting(true);
    reset();

    try {
      const campaignId = `campaign-${Date.now()}`;
      
      const calldata = buildSettlementCalldata(
          campaignId,
          TOKEN_CONTRACTS[values.rewardToken as keyof typeof TOKEN_CONTRACTS],
          values.budget!,
          ADVERTISER_ID as `0x${string}`
      );

      // 3. Send transaction to Settlement Contract
      // Permit2 flow note: The settlement contract is expected to handle Permit2 internally.
      await send({
          transactions: [
              { to: getSettlementContract(), data: calldata }
          ],
          chainId: WORLD_CHAIN_ID,
      });

      // 4. Check success
      const finalState = getTransactionState();
      if (!finalState.transactionId || finalState.status === "failed" || finalState.error) {
           throw new Error(finalState.error ?? "Transaction failed.");
      }

      // 5. Verify receipt
      const events = await getReceipt(finalState.transactionId as `0x${string}`);
      if (!events || events.length === 0) {
          throw new Error("Transaction verification failed or no events found.");
      }
      
      console.log("Parsed Events:", events);

      // 6. Create Campaign
      createCampaign(campaignId, {
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
    } catch (e) {
      console.error("Campaign creation failed:", e);
      setIsSubmitting(false);
      alert("Campaign creation failed. Please try again.");
    } finally {
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
