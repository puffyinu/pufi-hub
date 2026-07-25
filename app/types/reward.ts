export interface RewardState {
  available: number;
  claimed: number;
  pending: number;
  pendingByToken: Record<string, number>;
  loading: boolean;
  error: string | null;
}