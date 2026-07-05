import { useEffect, useState } from "react";
import {
  CHECKIN_EVENT,
  getCheckInStatus,
  checkIn,
  resetCheckIn,
} from "@/app/services/checkin";

export function useCheckIn() {
  const [status, setStatus] = useState(getCheckInStatus());

  useEffect(() => {
    function syncCheckIn() {
      setStatus(getCheckInStatus());
    }

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
