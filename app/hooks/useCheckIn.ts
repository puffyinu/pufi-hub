import { useMemo } from "react";
import {
  getCheckInStatus,
  checkIn,
  resetCheckIn,
} from "@/app/services/checkin";

export function useCheckIn() {
  return useMemo(() => {
    return {
      status: getCheckInStatus(),
      checkIn,
      resetCheckIn,
    };
  }, []);
}
