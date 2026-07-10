"use client";

import { useEffect, useState } from "react";

import {
  CHECKIN_SESSION_EVENT,
  getCheckInState,
  resetCheckInState,
} from "@/app/services/checkinSession";

import {
  performDailyCheckIn,
} from "@/app/services/checkinEngine";

import type { CheckInState } from "@/app/types/checkin";

export function useCheckIn() {
  const [checkIn, setCheckIn] =
    useState<CheckInState>(() =>
      getCheckInState()
    );

  useEffect(() => {
    const sync = () => {
      setCheckIn(getCheckInState());
    };

    sync();

    window.addEventListener(
      CHECKIN_SESSION_EVENT,
      sync
    );

    return () => {
      window.removeEventListener(
        CHECKIN_SESSION_EVENT,
        sync
      );
    };
  }, []);

  const check = () => {
    performDailyCheckIn();

    setCheckIn(getCheckInState());
  };

  const reset = () => {
    resetCheckInState();

    setCheckIn(getCheckInState());
  };

  return {
    checkIn,
    check,
    reset,
  };
}