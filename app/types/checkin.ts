export interface CheckInState {
  checkedIn: boolean;
  lastCheckIn: string | null;
  loading: boolean;
  error: string | null;
}