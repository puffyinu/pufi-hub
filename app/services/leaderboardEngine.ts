import {
  getLeaderboard,
  saveLeaderboard,
  resetLeaderboard,
} from "@/app/services/leaderboardSession";

import type {
  LeaderboardEntry,
} from "@/app/types/leaderboard";

export function getLeaderboardList(): LeaderboardEntry[] {
  return getLeaderboard();
}

export function updateLeaderboard(
  leaderboard: LeaderboardEntry[]
): void {
  const sorted = [...leaderboard].sort(
    (a, b) => b.score - a.score
  );

  const ranked = sorted.map(
    (entry, index) => ({
      ...entry,
      rank: index + 1,
    })
  );

  saveLeaderboard(ranked);
}

export {
  resetLeaderboard,
};