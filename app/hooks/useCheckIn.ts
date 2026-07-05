import { useEffect, useState } from "react";
import {
  CHECKIN_EVENT,
  getCheckInStatus,
  checkIn,
  resetCheckIn,
  type CheckInStatus,
} from "@/app/services/checkin";

export function useCheckIn() {
  const [status, setStatus] = useState<CheckInStatus>({
    checkedIn: false,
    lastCheckIn: null,
  });

  useEffect(() => {
    function syncCheckIn() {
      setStatus(getCheckInStatus());
    }

    syncCheckIn();
    window.addEventListener(CHECKIN_EVENT, syncCheckIn);

    return () => {
      window.removeEventListener(CHECKIN_EVENT, syncCheckIn);
    };
  }, []);

  return {
    status,
    checkIn,
    resetCheckIn,
  };
}
