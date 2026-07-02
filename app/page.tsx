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

        <main
          className="main-content"
          style={{
            flex: 1,
            padding: "32px",
          }}
        >
          <h2
            style={{
              color: "#FFFFFF",
              marginBottom: "24px",
            }}
          >
            Dashboard
          </h2>

          <div
            className="dashboard-cards"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <DashboardCard title="PUFI Balance" value="0 PUFI" />
            <DashboardCard title="Completed Tasks" value="0" />
            <DashboardCard title="Campaign Rewards" value="0" />
            <DashboardCard title="Referral" value="0" />
          </div>

          <div
            className="dashboard-sections"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              marginTop: "24px",
            }}
          >
            <ActivityCard />
            <TaskList />
            <CampaignCard />
            <WalletCard />
            <LeaderboardCard />
          </div>
        </main>
      </div>

      <BottomNav />

      <style jsx>{`
        @media (max-width: 767px) {
          .sidebar-wrapper {
            display: none;
          }

          .main-content {
            padding: 16px;
            padding-bottom: 96px;
          }

          .dashboard-cards {
            flex-direction: column;
            gap: 16px;
          }

          .dashboard-sections {
            gap: 16px;
          }
        }
      `}</style>
    </>
  );
}