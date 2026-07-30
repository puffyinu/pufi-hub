import RewardsClaimsCard from "@/app/components/RewardsClaimsCard";
import AdminAnnouncementCard from "@/app/components/AdminAnnouncementCard";
import CampaignCard from "@/app/components/CampaignCard";
import BottomNav from "@/app/components/BottomNav";

export default function CampaignPage() {
  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-[#FFC857]/30">
      
      {/* Background Layers */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2A1757] via-[#181633] to-[#0D1125]" />
        <div className="pointer-events-none absolute -top-40 -left-32 h-[420px] w-[420px] rounded-full bg-purple-600/20 blur-[140px]" />
        <div className="pointer-events-none absolute top-0 right-[-80px] h-[260px] w-[260px] rounded-full bg-[#FFC857]/10 blur-[120px]" />
      </div>

      <div className="relative z-0 mx-auto flex max-w-[480px] flex-col px-2">
        <main className="flex-1 pt-3 pb-16 px-4">
          <div className="mb-2.5 flex items-center justify-between">
            <h1 className="text-xl font-black tracking-tighter text-white uppercase">
              Campaign
            </h1>
            <div className="h-1 w-10 bg-[#FFC857] rounded-full blur-[1px]" />
          </div>

          <div className="space-y-3.5">
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