import {
  getAchievements,
  saveAchievements,
  resetAchievements,
} from "@/app/services/achievementSession";

import type {
  Achievement,
} from "@/app/types/achievement";

export function getAchievementList(): Achievement[] {
  return getAchievements();
}

export function unlockAchievement(
  id: string
): boolean {
  const achievements = getAchievements();

  const achievement = achievements.find(
    (item) => item.id === id
  );

  if (!achievement || achievement.unlocked) {
    return false;
  }

  const updated = achievements.map((item) =>
    item.id === id
      ? {
          ...item,
          unlocked: true,
        }
      : item
  );

  saveAchievements(updated);

  return true;
}

export function isAchievementUnlocked(
  id: string
): boolean {
  return (
    getAchievements().find(
      (item) => item.id === id
    )?.unlocked ?? false
  );
}

export {
  resetAchievements,
};