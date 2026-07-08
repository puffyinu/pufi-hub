"use client";

import { useActivity } from "@/app/hooks/useActivity";

export default function ActivityHistoryCard() {
  const {
    activities,
    clear,
  } = useActivity();

  return (
    <div
      style={{
        background: "#1E2A4A",
        borderRadius: 20,
        padding: 24,
        marginTop: 24,
      }}
    >
      <h2>Activity History</h2>

      {activities.length === 0 ? (
        <p>No activity yet.</p>
      ) : (
        <>
          {activities.map((activity) => (
            <div
              key={activity.id}
              style={{
                marginBottom: 16,
                paddingBottom: 16,
                borderBottom:
                  "1px solid #31456E",
              }}
            >
              <strong>
                {activity.title}
              </strong>

              <p>
                {activity.description}
              </p>

              {activity.amount !==
                undefined && (
                <p>
                  Reward:
                  <strong>
                    {" "}
                    {activity.amount} PUFI
                  </strong>
                </p>
              )}

              <small>
                {new Date(
                  activity.createdAt
                ).toLocaleString()}
              </small>
            </div>
          ))}

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