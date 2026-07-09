"use client";

import { useCampaign } from "@/app/hooks/useCampaign";

export default function CampaignCard() {
  const {
    campaigns,
    completeCampaign,
  } = useCampaign();

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          🎯 Campaigns
        </h2>

        <p className="text-sm text-zinc-400">
          Complete campaigns to earn PUFI rewards.
        </p>
      </div>

      <div className="space-y-3">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="rounded-lg border border-zinc-700 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">
                  {campaign.title}
                </h3>

                <p className="mt-1 text-sm text-zinc-400">
                  {campaign.description}
                </p>

                <p className="mt-2 text-xs text-emerald-400">
                  Reward: {campaign.reward} PUFI
                </p>
              </div>

              <button
                disabled={campaign.completed}
                onClick={() =>
                  completeCampaign(campaign.id)
                }
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  campaign.completed
                    ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-500 text-white"
                }`}
              >
                {campaign.completed
                  ? "Completed"
                  : "Complete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}