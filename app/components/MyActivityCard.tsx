"use client";

import { useCheckIn } from "@/app/hooks/useCheckIn";

export default function ActivityCard() {
  const {
    checkIn,
    check,
  } = useCheckIn();

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

      {checkIn.checkedIn ? (
        <>
          <p
            style={{
              color: "#94A3B8",
              margin: 0,
            }}
          >
            Daily check-in completed.
          </p>

          {checkIn.lastCheckIn && (
            <p
              style={{
                color: "#94A3B8",
                margin: "8px 0 0",
              }}
            >
              Last Check-In:
              <br />
              {checkIn.lastCheckIn}
            </p>
          )}
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
            onClick={check}
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