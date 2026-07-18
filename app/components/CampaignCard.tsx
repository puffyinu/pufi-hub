"use client";

import { useCampaign } from "@/app/hooks/useCampaign";

export default function CampaignCard() {
  const {
    campaigns,
    completeCampaign,
    resetCampaigns,
  } = useCampaign();

  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <div className="bg-[#1E2A4A] rounded-[20px] p-6 mt-6 border border-[#31456E]">
      <h2 className="text-[20px] font-bold mb-6 text-white">
        📢 AVAILABLE CAMPAIGNS
      </h2>

      {campaigns.length === 0 ? (
        <p className="text-gray-400 text-center py-4">No campaigns available at the moment.</p>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-[#1E2A4A] border border-[#31456E] rounded-[20px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-[#7C3AED]/50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="text-xl font-bold text-white leading-tight">
                    {campaign.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-[12px] font-bold text-white ${
                      campaign.completed ? "bg-[#16A34A]" : "bg-[#2563EB]"
                    }`}
                  >
                    {campaign.completed ? "COMPLETED" : "ACTIVE"}
                  </span>
                </div>

                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {campaign.description}
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                    REWARD
                  </span>
                  <span className="text-lg font-black text-white">
                    {campaign.reward} PUFI
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  disabled={campaign.completed}
                  onClick={() => completeCampaign(campaign.id)}
                  className={`w-full sm:w-auto px-8 py-3 rounded-[15px] font-bold text-white transition-all transform active:scale-95 ${
                    campaign.completed
                      ? "bg-[#16A34A]/20 text-[#16A34A] cursor-default border border-[#16A34A]/30"
                      : "bg-[#7C3AED] hover:bg-[#8B5CF6] shadow-lg shadow-[#7C3AED]/20 cursor-pointer"
                  }`}
                >
                  {campaign.completed ? "COMPLETED" : "GO"}
                </button>
              </div>
            </div>
          ))}

          {isDevelopment && (
            <button
              onClick={resetCampaigns}
              className="w-full mt-4 py-3 border border-red-500/30 bg-red-500/10 text-red-500 rounded-[15px] font-bold text-sm hover:bg-red-500 hover:text-white transition-all cursor-pointer"
            >
              Reset Campaign Progress
            </button>
          )}
        </div>
      )}
    </div>
  );
}
