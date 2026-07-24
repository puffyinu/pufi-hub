"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useCampaign } from "@/app/hooks/useCampaign";

export default function CreateCampaignPage() {
  const router = useRouter();
  const { createCampaign } = useCampaign();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [logo, setLogo] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [miniAppUrl, setMiniAppUrl] = useState("");
  const [rewardToken, setRewardToken] = useState("PUFI");
  const [poolAmount, setPoolAmount] = useState("");
  const [rewardPerClick, setRewardPerClick] = useState("");

  const maximumClicks = useMemo(() => {
    const pool = Number(poolAmount);
    const reward = Number(rewardPerClick);

    if (!pool || !reward || reward <= 0) {
      return 0;
    }

    return Math.floor(pool / reward);
  }, [poolAmount, rewardPerClick]);

  const handleCreate = async () => {
    if (!title || !description || !miniAppUrl || !poolAmount || !rewardPerClick) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    // Mock Wallet Transaction
    try {
      // Simulate transaction delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      createCampaign({
        title,
        description,
        logo,
        miniAppUrl,
        rewardToken,
        rewardAmount: Number(rewardPerClick),
        budget: Number(poolAmount),
        totalClicks: maximumClicks,
        createdBy: "advertiser-1", // Mock user id
      });

      router.push("/creator");
    } catch (error) {
      console.error("Transaction failed", error);
      alert("Transaction failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatAmount = (value: number) => {
    if (rewardToken === "PUFI") {
      return Number.isInteger(value) ? value.toString() : value.toFixed(2);
    }
    return value.toFixed(3);
  };

  const platformFee = useMemo(() => {
    const pool = Number(poolAmount);
    if (!pool) return 0;
    return pool * 0.3;
  }, [poolAmount]);

  const totalPayment = useMemo(() => {
    const pool = Number(poolAmount);
    return pool + platformFee;
  }, [poolAmount, platformFee]);

  return (
    <main
      style={{
        maxWidth: 600,
        margin: "0 auto",
        padding: "16px 20px",
        paddingBottom: 40,
      }}
    >
      <Link
        href="/creator"
        style={{
          color: "#94A3B8",
          textDecoration: "none",
          fontSize: 13,
          fontWeight: 600,
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          marginBottom: 16,
        }}
      >
        ← Back
      </Link>

      <h1
        style={{
          color: "#FFFFFF",
          fontSize: 18,
          fontWeight: 800,
          marginTop: 0,
          marginBottom: 24,
          letterSpacing: "-0.02em",
        }}
      >
        CREATE CAMPAIGN
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* LOGO URL */}
        <div>
          <label style={labelStyle}>LOGO URL (OPTIONAL)</label>
          <input 
            type="text" 
            placeholder="https://..." 
            style={inputStyle} 
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
          />
          <p
            style={{
              marginTop: 6,
              color: "#64748B",
              fontSize: 11,
              lineHeight: 1.5,
              paddingLeft: 4,
            }}
          >
            Upload on <strong>imgbb.com</strong> and paste the direct image link
            (e.g. <strong>i.ibb.co/.../logo.png</strong>).
          </p>
        </div>

        {/* TITLE */}
        <div>
          <label style={labelStyle}>TITLE (APP NAME)</label>
          <input 
            type="text" 
            placeholder="My Awesome App" 
            style={inputStyle} 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label style={labelStyle}>DESCRIPTION (MAX 150)</label>
          <textarea
            rows={3}
            style={textareaStyle}
            placeholder="What is your app about?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* MINI APP URL */}
        <div>
          <label style={labelStyle}>MINI APP URL</label>
          <input 
            type="text" 
            placeholder="https://..." 
            style={inputStyle} 
            value={miniAppUrl}
            onChange={(e) => setMiniAppUrl(e.target.value)}
          />
        </div>

        {/* Reward Token */}
        <div>
          <label style={labelStyle}>REWARD TOKEN</label>
          <div
            style={{
              display: "flex",
              gap: 8,
              marginTop: 8,
            }}
          >
            {["PUFI", "WLD", "USDC"].map((token) => (
              <button
                key={token}
                onClick={() => setRewardToken(token)}
                style={{
                  ...tokenButton,
                  background: rewardToken === token ? "#7C3AED" : "#1E293B",
                  borderColor: rewardToken === token ? "#7C3AED" : "#334155",
                  boxShadow:
                    rewardToken === token
                      ? "0 4px 12px rgba(124, 58, 237, 0.2)"
                      : "none",
                }}
              >
                {token}
              </button>
            ))}
          </div>
        </div>

        {/* Pool */}
        <div>
          <label style={labelStyle}>POOL AMOUNT (MIN 1)</label>
          <input
            type="number"
            value={poolAmount}
            onChange={(e) => setPoolAmount(e.target.value)}
            style={inputStyle}
            placeholder="0.00"
          />
        </div>

        {/* Reward */}
        <div>
          <label style={labelStyle}>REWARD PER CLICK</label>
          <div style={helperStyle}>
            How much each user earns per click (Min.{" "}
            {rewardToken === "PUFI" ? "1" : "0.001"})
          </div>
          <input
            type="number"
            step={rewardToken === "PUFI" ? "1" : "0.001"}
            value={rewardPerClick}
            onChange={(e) => setRewardPerClick(e.target.value)}
            style={inputStyle}
            placeholder="0.00"
          />
        </div>

        {/* Maximum Click */}
        <div style={cardStyle}>
          <div style={labelStyle}>MAXIMUM CLICKS</div>
          <div
            style={{
              fontSize: 22,
              color: "#FFFFFF",
              fontWeight: 800,
              marginTop: 4,
            }}
          >
            {maximumClicks.toLocaleString()} Clicks
          </div>
          <div style={{ ...helperStyle, marginTop: 2 }}>(Auto Calculated)</div>
        </div>

        {/* TOTAL PAYMENT */}
        <div
          style={{
            ...cardStyle,
            background: "#1E293B",
            borderColor: "#334155",
          }}
        >
          <div style={labelStyle}>TOTAL PAYMENT</div>

          <div style={{ marginTop: 12 }}>
            <div style={rowStyle}>
              <span>Pool Amount</span>
              <strong>
                {formatAmount(Number(poolAmount || 0))} {rewardToken}
              </strong>
            </div>

            <div style={rowStyle}>
              <span>Platform Fee (30%)</span>
              <strong>
                {formatAmount(platformFee)} {rewardToken}
              </strong>
            </div>

            <div
              style={{
                height: 1,
                background: "#334155",
                margin: "12px 0",
                opacity: 0.5,
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                color: "#FFFFFF",
                marginTop: 8,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#94A3B8",
                  paddingBottom: 4,
                }}
              >
                TOTAL
              </span>
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                }}
              >
                {formatAmount(totalPayment)}{" "}
                <span style={{ fontSize: 16, fontWeight: 700 }}>
                  {rewardToken}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Platform Fee Detail */}
        <div style={{ ...cardStyle, background: "transparent", padding: 12 }}>
          <label
            style={{
              ...labelStyle,
              fontSize: 10,
              display: "block",
              marginBottom: 4,
            }}
          >
            PLATFORM FEE STRUCTURE
          </label>
          <div
            style={{
              color: "#64748B",
              fontSize: 11,
              lineHeight: 1.4,
            }}
          >
            30% Management Fee applied to pool. 70% Distributed as User Rewards.
          </div>
        </div>

        {/* Button */}
        <button
          disabled={isSubmitting}
          onClick={handleCreate}
          style={{
            height: 52,
            border: "none",
            borderRadius: 14,
            background: isSubmitting ? "#475569" : "linear-gradient(90deg, #7C3AED, #9333EA)",
            color: "#FFFFFF",
            fontWeight: 800,
            fontSize: 16,
            cursor: isSubmitting ? "default" : "pointer",
            marginTop: 8,
            boxShadow: isSubmitting ? "none" : "0 4px 15px rgba(124, 58, 237, 0.3)",
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          {isSubmitting ? "PROCESSING TRANSACTION..." : "CONFIRM & PAY"}
        </button>
      </div>
    </main>
  );
}

const labelStyle = {
  color: "#64748B",
  fontWeight: 700,
  fontSize: 11,
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  display: "block",
  marginBottom: 6,
  paddingLeft: 4,
};

const helperStyle = {
  color: "#94A3B8",
  fontSize: 12,
  marginBottom: 6,
  paddingLeft: 4,
  lineHeight: 1.4,
};

const inputStyle = {
  width: "100%",
  background: "#1E293B",
  border: "1px solid #334155",
  borderRadius: 12,
  color: "#FFFFFF",
  padding: "12px 16px",
  fontSize: 15,
  fontWeight: 600,
  boxSizing: "border-box" as const,
  outline: "none",
  transition: "border-color 0.2s",
};

const textareaStyle = {
  ...inputStyle,
  resize: "none" as const,
};

const cardStyle = {
  background: "rgba(30, 41, 59, 0.5)",
  border: "1px solid #334155",
  borderRadius: 16,
  padding: 16,
};

const tokenButton = {
  flex: 1,
  height: 40,
  borderRadius: 10,
  border: "1px solid #334155",
  color: "#FFFFFF",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 13,
  transition: "all 0.2s",
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 8,
  color: "#94A3B8",
  fontSize: 13,
  fontWeight: 500,
} as const;
