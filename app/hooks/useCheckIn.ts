"use client";

import { useEffect, useState } from "react";

import {
  CHECKIN_SESSION_EVENT,
  getCheckInState,
  resetCheckInState,
  setCheckInState,
} from "@/app/services/checkinSession";

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
    setCheckInState({
      checkedIn: true,
      lastCheckIn: new Date().toISOString(),
      loading: false,
      error: null,
    });
  };

  const reset = () => {
    resetCheckInState();
  };

  return {
    checkIn,
    check,
    reset,
  };
}