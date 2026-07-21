import Link from "next/link";

import RewardsClaimsCard from "@/app/components/RewardsClaimsCard";
import AdminAnnouncementCard from "@/app/components/AdminAnnouncementCard";
import CampaignCard from "@/app/components/CampaignCard";

export default function CampaignPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pt-6 pb-28">
      <div className="mb-6 flex items-center gap-4">
        <Link
  href="/dashboard"
  className="flex h-10 w-10 items-center justify-center rounded-full text-3xl font-semibold text-white transition hover:opacity-80"
>
  ←
</Link>

        <h1 className="text-4xl font-bold text-white">
          Campaign
        </h1>
      </div>

      <div className="space-y-8">
        <RewardsClaimsCard />

        <AdminAnnouncementCard />

        <CampaignCard />
      </div>
    </main>
  );
}