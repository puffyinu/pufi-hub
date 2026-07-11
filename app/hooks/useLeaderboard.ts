"use client";

import { useEffect, useState } from "react";

import {
  LEADERBOARD_SESSION_EVENT,
} from "@/app/services/leaderboardSession";

import {
  getLeaderboardList,
  updateLeaderboard,
  resetLeaderboard,
} from "@/app/services/leaderboardEngine";

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] =
    useState(getLeaderboardList());

  useEffect(() => {
    const sync = () => {
      setLeaderboard(
        getLeaderboardList()
      );
    };

    sync();

    window.addEventListener(
      LEADERBOARD_SESSION_EVENT,
      sync
    );

    return () => {
      window.removeEventListener(
        LEADERBOARD_SESSION_EVENT,
        sync
      );
    };
  }, []);

  return {
    leaderboard,
    updateLeaderboard,
    resetLeaderboard,
  };
}