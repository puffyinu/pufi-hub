import {
  getAchievements,
  saveAchievements,
  resetAchievements,
} from "@/app/services/achievementSession";

export function getAchievementList() {
  return getAchievements();
}

export function unlockAchievement(
  id: string
): void {
  const achievements =
    getAchievements().map(
      (achievement) =>
        achievement.id === id
          ? {
              ...achievement,
              unlocked: true,
            }
          : achievement
    );

  saveAchievements(achievements);
}

export {
  resetAchievements,
};