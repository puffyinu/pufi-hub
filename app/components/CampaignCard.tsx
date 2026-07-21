"use client";

import { useCampaign } from "@/app/hooks/useCampaign";

const icons = ["📅", "🎁", "🚀"];

export default function CampaignCard() {
  const { campaigns, completeCampaign } = useCampaign();

  const readyToEarn = campaigns.filter((c) => !c.completed);
  const available = campaigns.filter((c) => c.completed);

  const renderCard = (campaign: (typeof campaigns)[number], index: number) => (
    <div
      key={campaign.id}
      className="rounded-[24px] border border-[#31456E] bg-[#1E2A4A] p-5"
    >
      <div className="flex gap-5">
        {/* Logo */}
        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-[24px] bg-[#2A3A63] text-6xl">
          {icons[index % icons.length]}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-white">
                {campaign.title}
              </h3>

              <p className="mt-2 text-lg text-gray-400">
                {campaign.description}
              </p>
            </div>

            <span className="rounded-full bg-[#2563EB] px-5 py-2 text-sm font-bold text-white">
              ACTIVE
            </span>
          </div>

          <div className="mt-8 flex items-end justify-between">
            <div>
              <p className="text-sm uppercase tracking-wider text-gray-500">
                Reward
              </p>

              <p className="mt-1 text-3xl font-black text-white">
                {campaign.reward} PUFI
              </p>
            </div>

            <button
              onClick={() => completeCampaign(campaign.id)}
              className="h-16 w-40 rounded-[20px] bg-gradient-to-r from-violet-600 to-fuchsia-600 text-2xl font-bold text-white transition hover:opacity-90"
            >
              GO
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-8">
      <div className="mb-5 inline-flex rounded-xl bg-[#5145CD] px-6 py-3">
        <span className="text-xl font-bold text-white">
          READY TO EARN
        </span>
      </div>

      <div className="space-y-5">
        {readyToEarn.map(renderCard)}
      </div>

      <div className="mt-10 mb-5 inline-flex rounded-xl bg-[#5145CD] px-6 py-3">
        <span className="text-xl font-bold text-white">
          AVAILABLE
        </span>
      </div>

      <div className="space-y-5">
        {available.map(renderCard)}
      </div>
    </div>
  );
}