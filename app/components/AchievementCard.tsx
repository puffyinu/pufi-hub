"use client";

import { useMemo } from "react";
import { useAchievement } from "@/app/hooks/useAchievement";

export default function AchievementCard() {
  const {
    achievements,
    unlockAchievement,
    resetAchievements,
  } = useAchievement();

  const stats = useMemo(() => {
    const total = achievements.length;

    const unlocked =
      achievements.filter(
        (achievement) => achievement.unlocked
      ).length;

    const locked = total - unlocked;

    const completion =
      total === 0
        ? 0
        : Math.round(
            (unlocked / total) * 100
          );

    return {
      total,
      unlocked,
      locked,
      completion,
    };
  }, [achievements]);

  return (
    <div
      style={{
        background: "#1E2A4A",
        borderRadius: 20,
        padding: 24,
        marginTop: 24,
      }}
    >
      <h2
        style={{
          marginBottom: 20,
        }}
      >
        Achievement Center
      </h2>

      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 24,
        }}
      >
        <div>
          <strong>Total</strong>

          <br />

          {stats.total}
        </div>

        <div>
          <strong>Unlocked</strong>

          <br />

          {stats.unlocked}
        </div>

        <div>
          <strong>Locked</strong>

          <br />

          {stats.locked}
        </div>

        <div>
          <strong>Completion</strong>

          <br />

          {stats.completion}%
        </div>
      </div>

      {achievements.length === 0 ? (
        <p>
          No achievements yet.
        </p>
      ) : (
        <>
          {achievements.map(
            (achievement) => (
              <div
                key={achievement.id}
                style={{
                  borderBottom:
                    "1px solid #31456E",
                  paddingBottom: 18,
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <strong>
                      {achievement.title}
                    </strong>

                    <p>
                      {
                        achievement.description
                      }
                    </p>
                  </div>

                  <div>
                    <span
                      style={{
                        display:
                          "inline-block",
                        padding:
                          "4px 10px",
                        borderRadius: 999,
                        background:
                          achievement.unlocked
                            ? "#2E7D32"
                            : "#616161",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 12,
                      }}
                    >
                      {achievement.unlocked
                        ? "UNLOCKED"
                        : "LOCKED"}
                    </span>

                    <br />

                    <button
                      disabled={
                        achievement.unlocked
                      }
                      onClick={() =>
                        unlockAchievement(
                          achievement.id
                        )
                      }
                      style={{
                        marginTop: 12,
                        padding:
                          "10px 18px",
                        border: "none",
                        borderRadius: 10,
                        background:
                          achievement.unlocked
                            ? "#555"
                            : "#2E7D32",
                        color: "#fff",
                        fontWeight: 700,
                        cursor:
                          achievement.unlocked
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {achievement.unlocked
                        ? "Unlocked"
                        : "Unlock"}
                    </button>
                  </div>
                </div>
              </div>
            )
          )}

          <button
            onClick={resetAchievements}
            style={{
              width: "100%",
              padding: 14,
              border: "none",
              borderRadius: 12,
              background: "#E53935",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Reset Achievement Progress
          </button>
        </>
      )}
    </div>
  );
}