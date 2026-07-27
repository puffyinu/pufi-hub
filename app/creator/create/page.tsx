"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCampaign } from "@/app/hooks/useCampaign";
import { useTransaction } from "@/app/hooks/useTransaction";
import { canCreateCampaign } from "@/app/services/campaignEngine";
import CampaignForm from "@/app/components/CampaignForm";
import { Campaign } from "@/app/types/campaign";
import UIFeedback from "@/app/components/UIFeedback";

export default function CreateCampaignPage() {
  const router = useRouter();
  const { createCampaign } = useCampaign();
  const { send, loading: transactionLoading, transaction } = useTransaction();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  
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

  const ADVERTISER_ID = "advertiser-1";

  useEffect(() => {
    if (!canCreateCampaign(ADVERTISER_ID)) {
      Promise.resolve().then(() => setShowLimitPopup(true));
    }
  }, []);

  const handleCreate = async (values: Partial<Campaign>) => {
    setIsSubmitting(true);

    try {
      // BUILD-007.4: Integration with World MiniKit Transaction
      // We use a placeholder for the contract call to pay for the campaign
      await send({
        transactions: [
          {
            address: "0x0000000000000000000000000000000000000000",
            abi: [
              {
                name: "createCampaign",
                type: "function",
                stateMutability: "payable",
                inputs: [],
                outputs: [],
              },
            ],
            functionName: "createCampaign",
            args: [],
          },
        ],
      });

      // We proceed with internal engine update if MiniKit didn't throw
      // In a production app, we would wait for confirmation or verify transactionId
      
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
      });

      router.push("/creator");
    } catch (error) {
      console.error("Transaction failed", error);
      setFeedback({
        isOpen: true,
        type: "alert",
        title: "Transaction Failed",
        message: "Transaction failed. Please try again.",
        onConfirm: () => setFeedback(f => ({ ...f, isOpen: false })),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className="relative"
      style={{
        maxWidth: 600,
        margin: "0 auto",
        padding: "16px 20px",
        paddingBottom: 40,
      }}
    >
      {showLimitPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-6 backdrop-blur-sm">
          <div className="w-full max-w-[340px] overflow-hidden rounded-[32px] border border-white/10 bg-[#1A1D2E] p-8 text-center shadow-2xl">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-600/10 text-4xl">
                🔒
              </div>
            </div>
            <h2 className="mb-2 text-xl font-black uppercase tracking-tight text-white">Free Slot Limit Reached</h2>
            <p className="mb-8 text-xs font-medium text-slate-400">Unlock a Premium Slot to create additional campaigns.</p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => router.push("/creator")}
                className="h-12 w-full rounded-2xl bg-white/5 text-[11px] font-black uppercase tracking-widest text-slate-400"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  // BUILD-007.4: Unlock Premium also uses MiniKit
                  await send({
                    transactions: [
                      {
                        address: "0x0000000000000000000000000000000000000000",
                        abi: [
                          {
                            name: "unlockPremium",
                            type: "function",
                            stateMutability: "payable",
                            inputs: [],
                            outputs: [],
                          },
                        ],
                        functionName: "unlockPremium",
                        args: [],
                      },
                    ],
                  });
                  
                  setFeedback({
                    isOpen: true,
                    type: "alert",
                    title: "Slot Unlocked",
                    message: "Premium slot unlocked via World MiniKit!",
                    onConfirm: () => {
                      setFeedback(f => ({ ...f, isOpen: false }));
                      setShowLimitPopup(false);
                    },
                  });
                }}
                className="h-12 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-[11px] font-black uppercase tracking-widest text-white shadow-lg"
              >
                Unlock Premium
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
        isSubmitting={isSubmitting || transactionLoading}
        onSubmit={handleCreate}
      />

      {transaction.error && (
        <UIFeedback
          isOpen={true}
          type="alert"
          title="Transaction Error"
          message={transaction.error}
          onConfirm={() => setFeedback(f => ({ ...f, isOpen: false }))}
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
    </main>
  );
}
