import RewardsClaimsCard from "@/app/components/RewardsClaimsCard";
import AdminAnnouncementCard from "@/app/components/AdminAnnouncementCard";
import CampaignCard from "@/app/components/CampaignCard";
import BottomNav from "@/app/components/BottomNav";
import AppBackground from "@/app/components/layout/AppBackground";

export default function CampaignPage() {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col bg-[#0D1125] text-white font-sans selection:bg-[#FFC857]/30 select-none">
      
      <AppBackground />

      <div className="relative z-0 mx-auto flex min-h-screen w-full max-w-md flex-col px-2">
        <main className="flex-1 pt-4 pb-32 px-4">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase">
              Campaigns
            </h1>
            <div className="h-1 w-8 bg-[#FFC857] rounded-full blur-[1px]" />
          </div>

          <div className="space-y-4">
            <RewardsClaimsCard />
            <AdminAnnouncementCard />
            <CampaignCard />
          </div>
        </main>

        <BottomNav active="campaign" />
      </div>
    </div>
  );
}