"use client";

import { Campaign } from "@/app/types/campaign";
import CampaignForm from "./CampaignForm";

interface EditCampaignModalProps {
  campaign: Campaign;
  onClose: () => void;
  onSave: (values: Partial<Campaign>) => void;
}

export default function EditCampaignModal({
  campaign,
  onClose,
  onSave,
}: EditCampaignModalProps) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 px-4 backdrop-blur-md">
      <div className="w-full max-w-[500px] max-h-[90vh] overflow-y-auto rounded-[32px] border border-white/10 bg-[#0D1125] p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-black uppercase tracking-tight text-white">
            Edit Campaign
          </h2>
          <button 
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white/5 text-slate-400 transition-all hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        <CampaignForm
          mode="edit"
          initialValues={campaign}
          onSubmit={(values) => {
            onSave(values);
            onClose();
          }}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
