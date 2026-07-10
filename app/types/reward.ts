export interface RewardState {
  available: number;
  claimed: number;
  pending: number;
  loading: boolean;
  error: string | null;
}