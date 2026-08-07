"use client";

import { useMemo, useState } from "react";
import { Campaign } from "@/app/types/campaign";
import { calculateSettlement } from "@/app/services/campaignSettlementService";
import UIFeedback from "./UIFeedback";

interface CampaignFormProps {
  initialValues?: Campaign;
  isSubmitting?: boolean;
  onSubmit: (values: Partial<Campaign>) => void;
  onCancel?: () => void;
  mode: "create" | "edit";
}

export default function CampaignForm({
  initialValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
  mode,
}: CampaignFormProps) {
  // Form State
  const [logo, setLogo] = useState(initialValues?.logo || "");
  const [title, setTitle] = useState(initialValues?.title || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [miniAppUrl, setMiniAppUrl] = useState(initialValues?.miniAppUrl || "");
  const [rewardToken, setRewardToken] = useState(initialValues?.rewardToken || "PUFI");
  const [poolAmount, setPoolAmount] = useState(initialValues?.budget?.toString() || "");
  const [rewardPerClick, setRewardPerClick] = useState(initialValues?.rewardAmount?.toString() || "");

  const [alertOpen, setAlertOpen] = useState(false);

  const settlement = useMemo(() => {
    const pool = Number(poolAmount);
    return calculateSettlement(pool);
  }, [poolAmount]);

  const maximumClaims = useMemo(() => {
    const reward = Number(rewardPerClick);

    if (!settlement.rewardPool || !reward || reward <= 0) {
      return 0;
    }

    return Math.floor(settlement.rewardPool / reward);
  }, [settlement.rewardPool, rewardPerClick]);

  const handleSubmit = () => {
    if (!title || !description || !miniAppUrl || !poolAmount || !rewardPerClick) {
      setAlertOpen(true);
      return;
    }

    // Stabilize arithmetic values before submission to avoid precision drift
    const stabilizedReward = Math.round(Number(rewardPerClick) * 1e6) / 1e6;
    const stabilizedBudget = Math.round(Number(poolAmount) * 1e6) / 1e6;

    onSubmit({
      title,
      description,
      logo,
      miniAppUrl,
      rewardToken,
      rewardAmount: stabilizedReward,
      budget: stabilizedBudget,
      maxClaims: mode === "create" ? maximumClaims : initialValues?.maxClaims,
      // Pass settlement info if needed by service later
      // settlement, 
    });
  };


  return (
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
          (e.g. <strong>i.ibb.co/.../logo.png</strong>). Default PUFI logo will be used if empty.
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

      {mode === "create" && (
        <>
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
            <label style={labelStyle}>CAMPAIGN BUDGET (MIN 1)</label>
            <input
              type="text"
              inputMode="numeric"
              value={poolAmount}
              onChange={(e) => {
                // Allow only digits
                const val = e.target.value.replace(/[^0-9]/g, "");
                setPoolAmount(val);
              }}
              style={inputStyle}
              placeholder="0"
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
              type="text"
              inputMode="decimal"
              value={rewardPerClick}
              onChange={(e) => {
                // Allow digits and one dot
                const val = e.target.value.replace(/[^0-9.]/g, "");
                const parts = val.split(".");
                if (parts.length > 2) return; // Ignore if more than one dot
                setRewardPerClick(val);
              }}
              style={inputStyle}
              placeholder="0.00"
            />
          </div>

          {/* Maximum Click */}
          <div style={cardStyle}>
            <div style={labelStyle}>MAXIMUM CLAIMS</div>
            <div
              style={{
                fontSize: 22,
                color: "#FFFFFF",
                fontWeight: 800,
                marginTop: 4,
              }}
            >
              {maximumClaims.toLocaleString()} Claims
            </div>
          </div>

          {/* Platform Fee Detail */}
          <div style={{ ...cardStyle, background: "transparent", padding: 12 }}>
            <label
              style={{
                ...labelStyle,
                fontSize: 10,
                display: "block",
                marginBottom: 8,
              }}
            >
              PLATFORM FEE STRUCTURE
            </label>
            
            <div style={rowStyle}>
              <span>30% Platform Management Fee</span>
            </div>

            <div style={rowStyle}>
              <span>70% Campaign Reward Pool</span>
            </div>
          </div>
        </>
      )}

      {/* Buttons */}
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        {onCancel && (
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              height: 52,
              border: "1px solid #334155",
              borderRadius: 14,
              background: "transparent",
              color: "#94A3B8",
              fontWeight: 800,
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            CANCEL
          </button>
        )}
        <button
          disabled={isSubmitting}
          onClick={handleSubmit}
          style={{
            flex: 2,
            height: 52,
            border: "none",
            borderRadius: 14,
            background: isSubmitting ? "#475569" : "linear-gradient(90deg, #7C3AED, #9333EA)",
            color: "#FFFFFF",
            fontWeight: 800,
            fontSize: 16,
            cursor: isSubmitting ? "default" : "pointer",
            boxShadow: isSubmitting ? "none" : "0 4px 15px rgba(124, 58, 237, 0.3)",
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          {isSubmitting 
            ? "PROCESSING..." 
            : mode === "create" 
              ? "CONFIRM & PAY" 
              : "SAVE CHANGES"}
        </button>
      </div>

      <UIFeedback
        isOpen={alertOpen}
        type="alert"
        title="Form Incomplete"
        message="Please fill in all required fields."
        onConfirm={() => setAlertOpen(false)}
      />
    </div>
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
  pointerEvents: "none" as const,
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
