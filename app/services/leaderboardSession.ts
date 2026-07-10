import { provider } from "@/app/providers/providerAccess";

import type {
  LeaderboardEntry,
  LeaderboardState,
} from "@/app/types/leaderboard";

const STORAGE_KEY = "pufi-leaderboard-session";

export const LEADERBOARD_SESSION_EVENT =
  "pufi-leaderboard-session-changed";

const DEFAULT_STATE: LeaderboardState = {
  leaderboard: [
    {
      id: "1",
      username: "PuffyMaster",
      score: 1250,
      rank: 1,
      isCurrentUser: false,
    },
    {
      id: "2",
      username: "InuHunter",
      score: 980,
      rank: 2,
      isCurrentUser: false,
    },
    {
      id: "3",
      username: "WorldPlayer",
      score: 820,
      rank: 3,
      isCurrentUser: true,
    },
  ],
};

let session: LeaderboardState | null = null;

function storage() {
  return provider();
}

function notify(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(
        LEADERBOARD_SESSION_EVENT
      )
    );
  }
}

function ensureState(): LeaderboardState {
  if (session === null) {
    session =
      storage().load<LeaderboardState>(
        STORAGE_KEY
      ) ?? DEFAULT_STATE;
  }

  return session;
}

export function getLeaderboardState(): LeaderboardState {
  return ensureState();
}

export function getLeaderboard(): LeaderboardEntry[] {
  return ensureState().leaderboard;
}

export function saveLeaderboard(
  leaderboard: LeaderboardEntry[]
): void {
  session = {
    leaderboard,
  };

  storage().save(STORAGE_KEY, session);

  notify();
}

export function resetLeaderboard(): void {
  session = {
    ...DEFAULT_STATE,
  };

  storage().remove(STORAGE_KEY);

  notify();
}