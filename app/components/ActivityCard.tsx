"use client";

import { useCheckIn } from "@/app/hooks/useCheckIn";

export default function ActivityCard() {
  const { status, checkIn } = useCheckIn();

  return (
    <div
      style={{
        background: "#1C2745",
        border: "1px solid #23304A",
        borderRadius: "16px",
        padding: "24px",
        marginTop: "32px",
      }}
    >
      <h3
        style={{
          marginTop: 0,
          marginBottom: "20px",
          color: "#FFFFFF",
          fontSize: "22px",
        }}
      >
        Daily Check-In
      </h3>

      {status.checkedIn ? (
        <>
          <p
            style={{
              color: "#94A3B8",
              margin: 0,
            }}
          >
            Daily check-in completed.
          </p>
          {status.lastCheckIn ? (
            <p
              style={{
                color: "#94A3B8",
                margin: "8px 0 0",
              }}
            >
              Last Check-In:
              {status.lastCheckIn}
            </p>
          ) : null}
        </>
      ) : (
        <>
          <p
            style={{
              color: "#94A3B8",
              margin: 0,
            }}
          >
            Complete your daily check-in.
          </p>
          <button
            type="button"
            onClick={() => checkIn()}
            style={{
              marginTop: "16px",
              background: "#3B82F6",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              padding: "10px 16px",
              cursor: "pointer",
            }}
          >
            Check In
          </button>
        </>
      )}
    </div>
  );
}