"use client";

import { useStreak } from "@/app/hooks/useStreak";

export default function DailyStreakCard() {
  const { streak } = useStreak();

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          🔥 Daily Streak
        </h2>

        <p className="text-sm text-zinc-400">
          Build your streak by checking in every day.
        </p>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Current Streak</span>
          <span className="font-bold">
            {streak.currentStreak} day
            {streak.currentStreak !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Best Streak</span>
          <span className="font-bold">
            {streak.bestStreak} day
            {streak.bestStreak !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Last Check-In</span>
          <span className="text-right text-xs">
            {streak.lastCheckIn
              ? new Date(streak.lastCheckIn).toLocaleString()
              : "-"}
          </span>
        </div>
      </div>
    </div>
  );
}