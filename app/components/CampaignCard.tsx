"use client";

import { useMemo } from "react";
import { useCampaign } from "@/app/hooks/useCampaign";

export default function CampaignCard() {
  const {
    campaigns,
    completeCampaign,
    resetCampaigns,
  } = useCampaign();

  const stats = useMemo(() => {
    const total = campaigns.length;

    const completed =
      campaigns.filter(
        (campaign) => campaign.completed
      ).length;

    const active = total - completed;

    return {
      total,
      completed,
      active,
    };
  }, [campaigns]);

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
        Campaign Center
      </h2>

      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <div>
          <strong>Total</strong>

          <br />

          {stats.total}
        </div>

        <div>
          <strong>Active</strong>

          <br />

          {stats.active}
        </div>

        <div>
          <strong>Completed</strong>

          <br />

          {stats.completed}
        </div>
      </div>

      {campaigns.length === 0 ? (
        <p>No campaign available.</p>
      ) : (
        <>
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
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
                    {campaign.title}
                  </strong>

                  <p>
                    {campaign.description}
                  </p>

                  <p>
                    Reward:
                    <strong>
                      {" "}
                      {campaign.reward}
                      {" "}
                      PUFI
                    </strong>
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
                        campaign.completed
                          ? "#2E7D32"
                          : "#1565C0",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {campaign.completed
                      ? "COMPLETED"
                      : "ACTIVE"}
                  </span>

                  <br />

                  <button
                    disabled={
                      campaign.completed
                    }
                    onClick={() =>
                      completeCampaign(
                        campaign.id
                      )
                    }
                    style={{
                      marginTop: 12,
                      padding:
                        "10px 18px",
                      border: "none",
                      borderRadius: 10,
                      cursor:
                        campaign.completed
                          ? "not-allowed"
                          : "pointer",
                      background:
                        campaign.completed
                          ? "#555"
                          : "#2E7D32",
                      color: "#fff",
                      fontWeight: 700,
                    }}
                  >
                    {campaign.completed
                      ? "Completed"
                      : "Complete"}
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={resetCampaigns}
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
            Reset Campaign Progress
          </button>
        </>
      )}
    </div>
  );
}