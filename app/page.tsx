import Header from "./components/Header";
import HeroBanner from "./components/HeroBanner";
import Sidebar from "./components/Sidebar";
import DashboardStats from "./components/DashboardStats";

import WalletCard from "./components/WalletCard";

import CampaignCard from "./components/CampaignCard";

import ActivityCard from "./components/ActivityCard";
import ActivityHistoryCard from "./components/ActivityHistoryCard";

import DailyStreakCard from "./components/DailyStreakCard";

import AchievementCard from "./components/AchievementCard";

import TaskList from "./components/TaskList";

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

          <DashboardStats />

          <div className="dashboard-sections">

            <WalletCard />

            <ActivityCard />

            <DailyStreakCard />

            <AchievementCard />

            <CampaignCard />

            <ActivityHistoryCard />

            <TaskList />

            <LeaderboardCard />

          </div>
        </main>
      </div>

      <BottomNav />
    </>
  );
}