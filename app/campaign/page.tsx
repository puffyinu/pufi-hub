import RewardsClaimsCard from "@/app/components/RewardsClaimsCard";
import AdminAnnouncementCard from "@/app/components/AdminAnnouncementCard";
import CampaignCard from "@/app/components/CampaignCard";

export default function CampaignPage() {
  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 24,
      }}
    >
      <h1
        style={{
          fontSize: 32,
          fontWeight: 700,
          marginBottom: 24,
        }}
      >
        Campaign
      </h1>

      <RewardsClaimsCard />

      <AdminAnnouncementCard />

      <CampaignCard />
    </main>
  );
}