"use client";

import { useMemo } from "react";
import { useActivity } from "@/app/hooks/useActivity";
import type { ActivityType } from "@/app/types/activity";

const TYPE_STYLE: Record<
  ActivityType,
  {
    label: string;
    color: string;
  }
> = {
  checkin: {
    label: "CHECK-IN",
    color: "#2E7D32",
  },
  reward: {
    label: "REWARD",
    color: "#F9A825",
  },
  claim: {
    label: "CLAIM",
    color: "#8E24AA",
  },
  campaign: {
    label: "CAMPAIGN",
    color: "#1565C0",
  },
  transaction: {
    label: "TRANSACTION",
    color: "#EF6C00",
  },
};

export default function ActivityHistoryCard() {
  const { activities, clear } = useActivity();

  const recentActivities = useMemo(() => {
    return [...activities]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      )
      .slice(0, 10);
  }, [activities]);

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
        Activity Timeline
      </h2>

      {recentActivities.length === 0 ? (
        <div
          style={{
            opacity: 0.8,
          }}
        >
          <p
            style={{
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            No activity yet.
          </p>

          <p>
            Complete your first task to start
            building your history.
          </p>
        </div>
      ) : (
        <>
          {recentActivities.map((activity) => {
            const badge =
              TYPE_STYLE[activity.type];

            return (
              <div
                key={activity.id}
                style={{
                  paddingBottom: 18,
                  marginBottom: 18,
                  borderBottom:
                    "1px solid #31456E",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <strong>
                    {activity.title}
                  </strong>

                  <span
                    style={{
                      background:
                        badge.color,
                      color: "#fff",
                      borderRadius: 999,
                      padding:
                        "4px 10px",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {badge.label}
                  </span>
                </div>

                <p
                  style={{
                    marginBottom: 8,
                  }}
                >
                  {activity.description}
                </p>

                {activity.amount !==
                  undefined && (
                  <p
                    style={{
                      marginBottom: 8,
                    }}
                  >
                    Reward:
                    <strong>
                      {" "}
                      {activity.amount}
                      {" "}
                      PUFI
                    </strong>
                  </p>
                )}

                <small
                  style={{
                    opacity: 0.7,
                  }}
                >
                  {new Date(
                    activity.createdAt
                  ).toLocaleString()}
                </small>
              </div>
            );
          })}

          <button
            onClick={clear}
            style={{
              marginTop: 20,
              width: "100%",
              padding: 12,
              border: "none",
              borderRadius: 12,
              background: "#E53935",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Clear History
          </button>
        </>
      )}
    </div>
  );
}