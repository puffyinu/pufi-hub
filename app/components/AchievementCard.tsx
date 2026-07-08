"use client";

import { useAchievement } from "@/app/hooks/useAchievement";

export default function AchievementCard() {
  const { achievements } =
    useAchievement();

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          🏆 Achievements
        </h2>

        <p className="text-sm text-zinc-400">
          Unlock achievements as you
          use PUFI HUB.
        </p>
      </div>

      <div className="space-y-3">
        {achievements.map(
          (achievement) => (
            <div
              key={achievement.id}
              className="rounded-lg border border-zinc-700 p-3"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">
                  {achievement.title}
                </h3>

                <span
                  className={
                    achievement.unlocked
                      ? "text-green-400 text-sm font-semibold"
                      : "text-zinc-500 text-sm"
                  }
                >
                  {achievement.unlocked
                    ? "Unlocked"
                    : "Locked"}
                </span>
              </div>

              <p className="mt-2 text-sm text-zinc-400">
                {achievement.description}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}