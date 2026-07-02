import Header from "./components/Header";
import HeroBanner from "./components/HeroBanner";
import Sidebar from "./components/Sidebar";
import DashboardCard from "./components/DashboardCard";
import ActivityCard from "./components/ActivityCard";
import TaskList from "./components/TaskList";
import CampaignCard from "./components/CampaignCard";
import WalletCard from "./components/WalletCard";
import LeaderboardCard from "./components/LeaderboardCard";
import BottomNav from "./components/BottomNav";

export default function Home() {
  return (
    <>
      <Header />
      <HeroBanner />

      <div
        style={{
          display: "flex",
          minHeight: "calc(100vh - 90px)",
        }}
      >
        <div className="sidebar-wrapper">
          <Sidebar />
        </div>

        <main className="main-content">

          <h2
            style={{
              color: "#FFFFFF",
              marginBottom: "24px",
            }}
          >
            Dashboard
          </h2>

          <div className="dashboard-cards">

            <DashboardCard
              title="PUFI Balance"
              value="0 PUFI"
            />

            <DashboardCard
              title="Completed Tasks"
              value="0"
            />

            <DashboardCard
              title="Campaign Rewards"
              value="0"
            />

            <DashboardCard
              title="Referral"
              value="0"
            />

          </div>

          <div className="dashboard-sections">

            <ActivityCard />

            <TaskList />

            <CampaignCard />

            <WalletCard />

            <LeaderboardCard />

          </div>

        </main>

      </div>

      <BottomNav />

    </>
  );
}