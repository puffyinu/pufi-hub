"use client";

import { useMemo } from "react";
import { useStreak } from "@/app/hooks/useStreak";

export default function DailyStreakCard() {
  const {
    streak,
    update,
  } = useStreak();

  const nextMilestone = useMemo(() => {
    const milestones = [1, 3, 7, 14, 30, 60, 100];

    return (
      milestones.find(
        (value) => value > streak.currentStreak
      ) ?? streak.currentStreak
    );
  }, [streak.currentStreak]);

  const progress = useMemo(() => {
    if (nextMilestone === 0) {
      return 0;
    }

    return Math.min(
      100,
      Math.round(
        (streak.currentStreak / nextMilestone) *
          100
      )
    );
  }, [
    streak.currentStreak,
    nextMilestone,
  ]);

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
        Daily Streak
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
          <strong>Current</strong>

          <br />

          {streak.currentStreak}
        </div>

        <div>
          <strong>Best</strong>

          <br />

          {streak.bestStreak}
        </div>

        <div>
          <strong>Next</strong>

          <br />

          {nextMilestone}
        </div>

        <div>
          <strong>Progress</strong>

          <br />

          {progress}%
        </div>
      </div>

      <div
        style={{
          width: "100%",
          height: 10,
          background: "#31456E",
          borderRadius: 999,
          overflow: "hidden",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "#2E7D32",
          }}
        />
      </div>

      <p>
        <strong>Current Streak:</strong>{" "}
        {streak.currentStreak} day
        {streak.currentStreak !== 1
          ? "s"
          : ""}
      </p>

      <p>
        <strong>Best Streak:</strong>{" "}
        {streak.bestStreak} day
        {streak.bestStreak !== 1
          ? "s"
          : ""}
      </p>

      <p>
        <strong>Last Check-In:</strong>{" "}
        {streak.lastCheckIn
          ? new Date(
              streak.lastCheckIn
            ).toLocaleString()
          : "-"}
      </p>

      <p>
        <strong>Next Milestone:</strong>{" "}
        {nextMilestone} days
      </p>

      <button
        onClick={update}
        style={{
          width: "100%",
          marginTop: 20,
          padding: 14,
          border: "none",
          borderRadius: 12,
          background: "#2E7D32",
          color: "#fff",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Update Daily Streak
      </button>
    </div>
  );
}