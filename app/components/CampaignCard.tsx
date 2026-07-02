export default function CampaignCard() {
  return (
    <div
      style={{
        marginTop: "32px",
        background: "#1E2947",
        border: "1px solid #2A3654",
        borderRadius: "16px",
        padding: "24px",
      }}
    >
      <h2
        style={{
          color: "#FFFFFF",
          marginBottom: "24px",
        }}
      >
        Campaigns
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Campaign 1 */}
        <div
          style={{
            background: "#111A30",
            border: "1px solid #2A3654",
            borderRadius: "12px",
            padding: "18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                color: "#FFFFFF",
              }}
            >
              Daily Check-In
            </h3>

            <p
              style={{
                marginTop: "8px",
                color: "#94A3B8",
              }}
            >
              Earn 5 PUFI
            </p>
          </div>

          <span
            style={{
              background: "#16A34A",
              color: "#FFFFFF",
              padding: "6px 12px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            OPEN
          </span>
        </div>

        {/* Campaign 2 */}
        <div
          style={{
            background: "#111A30",
            border: "1px solid #2A3654",
            borderRadius: "12px",
            padding: "18px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                color: "#FFFFFF",
              }}
            >
              Visit Website
            </h3>

            <p
              style={{
                marginTop: "8px",
                color: "#94A3B8",
              }}
            >
              Earn 10 PUFI
            </p>
          </div>

          <span
            style={{
              background: "#16A34A",
              color: "#FFFFFF",
              padding: "6px 12px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: "600",
            }}
          >
            OPEN
          </span>
        </div>
      </div>
    </div>
  );
}