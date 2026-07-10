export interface LeaderboardEntry {
  id: string;

  username: string;

  score: number;

  rank: number;

  isCurrentUser: boolean;
}

export interface LeaderboardState {
  leaderboard: LeaderboardEntry[];
}