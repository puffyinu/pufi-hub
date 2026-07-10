"use client";

import { useEffect, useState } from "react";

import {
  ACHIEVEMENT_SESSION_EVENT,
} from "@/app/services/achievementSession";

import {
  getAchievementList,
  unlockAchievement,
  resetAchievements,
} from "@/app/services/achievementEngine";

export function useAchievement() {
  const [achievements, setAchievements] =
    useState(getAchievementList());

  useEffect(() => {
    const sync = () => {
      setAchievements(
        getAchievementList()
      );
    };

    sync();

    window.addEventListener(
      ACHIEVEMENT_SESSION_EVENT,
      sync
    );

    return () => {
      window.removeEventListener(
        ACHIEVEMENT_SESSION_EVENT,
        sync
      );
    };
  }, []);

  return {
    achievements,
    unlockAchievement,
    resetAchievements,
  };
}