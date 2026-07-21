"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export default function CreateCampaignPage() {

     const [rewardToken, setRewardToken] = useState("PUFI");

     const [poolAmount, setPoolAmount] = useState("");

     const [rewardPerClick, setRewardPerClick] = useState("");

   const maximumClicks = useMemo(() => {
  const pool = Number(poolAmount);

  const reward = Number(rewardPerClick);

  if (
    !pool ||
    !reward ||
    reward <= 0
  ) {
    return 0;
  }

  return Math.floor(pool / reward);
}, [
  poolAmount,
  rewardPerClick,
]);

const formatAmount = (value: number) => {
  if (rewardToken === "PUFI") {
    return Number.isInteger(value)
      ? value.toString()
      : value.toFixed(2);
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
        maxWidth: 900,
        margin: "0 auto",
        padding: 20,
      }}
    >
      <Link
        href="/creator"
        style={{
          color: "#FFFFFF",
          textDecoration: "none",
          fontSize: 16,
          fontWeight: 600,
        }}
      >
        ← Back
      </Link>

      <h1
        style={{
          color: "#FFFFFF",
          fontSize: 20,
          fontWeight: 700,
          marginTop: 10,
          marginBottom: 30,
        }}
      >
        CREATE CAMPAIGN
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        {/* LOGO URL */}

        <div>
          <label
            style={{
              color: "#FFFFFF",
              fontWeight: 700,
            }}
          >
            LOGO URL  (OPTIONAL)
          </label>
          <div>
          </div>

          <input
            type="text"
            placeholder="https://..."
            style={inputStyle}
          />
          <p
            style={{
            marginTop: 10,
            marginBottom: 8,
            color: "#94A3B8",
            fontSize: 12,
            lineHeight: 1.6,
           }}
          >
            Upload on <strong>imgbb.com</strong> and paste the direct image
           link
         <br />
            (e.g. <strong>i.ibb.co/.../logo.png</strong>), not the
         <br />
         <strong>ibb.co/...</strong> page URL.
        </p>
   
        </div>

        {/* TITLE */}

        <div>
          <label style={labelStyle}>
            TITLE  (APP NAME)
          </label>
          <div>

          </div>

          <input
            type="text"
            placeholder="My Awesome App"
            style={inputStyle}
          />
        </div>

        {/* DESCRIPTION */}

        <div>
          <label style={labelStyle}>
            DESCRIPTION (MAX 150)
          </label>
          <div>

          </div>
                 
          <textarea
            rows={5}
            style={textareaStyle}
            placeholder="Short description..."                  
          />
        </div>

        {/* MINI APP URL */}

        <div>
          <label style={labelStyle}>
            MINI APP URL
          </label>

          <input
            type="text"
            placeholder="https://..."
            style={inputStyle}
          />
        </div>

        {/* Reward Token */}

        <div>
          <label style={labelStyle}>
            REWARD TOKEN
          </label>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 10,
            }}
          >
            <button
              onClick={() => setRewardToken("PUFI")}
              style={{
              ...tokenButton,
              background:
              rewardToken === "PUFI"
              ? "#7C3AED"
              : "#1E2A4A",
           }}
          >
              PUFI
            </button>

            <button
            onClick={() => setRewardToken("WLD")}
            style={{
            ...tokenButton,
            background:
            rewardToken === "WLD"
            ? "#7C3AED"
            : "#1E2A4A",
       }}
        >
            WLD
            </button>

            <button
            onClick={() => setRewardToken("USDC")}
            style={{
            ...tokenButton,
            background:
            rewardToken === "USDC"
            ? "#7C3AED"
            : "#1E2A4A",
         }}
        >
            USDC
          </button>
          </div>
        </div>

        {/* Pool */}

        <div>
          <label style={labelStyle}>
            POOL AMOUNT  (Min 1)
          </label>
          <div>
          </div>

          <input
  type="number"
  value={poolAmount}
  onChange={(e) =>
    setPoolAmount(e.target.value)
  }
  style={inputStyle}
/>
        </div>

        {/* Reward */}

        <div>
          <label style={labelStyle}>
            REWARD PER CLICK
          </label>

          <div style={helperStyle}>
  How much each user earns per click.
  <br />
  {rewardToken === "PUFI"
    ? "Min. 1"
    : "Min. 0.001"}
</div>

          <input
  type="number"
  step={
    rewardToken === "PUFI"
      ? "1"
      : "0.001"
  }
  value={rewardPerClick}
  onChange={(e) =>
    setRewardPerClick(e.target.value)
  }
  style={inputStyle}
/>
        </div>

        {/* Maximum Click */}

        <div
          style={cardStyle}
        >
          <div style={labelStyle}>
            MAXIMUM CLICKS
          </div>

          <div
            style={{
              fontSize: 26,
              color: "#FFFFFF",
              fontWeight: 700,
              marginTop: 10,
            }}
          >
            {maximumClicks} Clicks
          </div>

          <div style={helperStyle}>
            (Auto Calculate)
          </div>
        </div>

{/* TOTAL PAYMENT */}

<div style={cardStyle}>
  <div style={labelStyle}>
    TOTAL PAYMENT
  </div>

  <div style={{ marginTop: 18 }}>

    <div style={rowStyle}>
      <span>Pool Amount</span>

      <strong>
        {formatAmount(Number(poolAmount || 0))}{" "}
        {rewardToken}
      </strong>
    </div>

    <div style={rowStyle}>
      <span>Platform Fee (30%)</span>

      <strong>
        {formatAmount(platformFee)}{" "}
        {rewardToken}
      </strong>
    </div>

    <hr
      style={{
        borderColor: "#31456E",
        margin: "18px 0",
      }}
    />

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "#FFFFFF",
        fontWeight: 700,
        fontSize: 22,
      }}
    >
      <span>TOTAL</span>

      <span>
        {formatAmount(totalPayment)}{" "}
        {rewardToken}
      </span>
    </div>

  </div>
</div>

        {/* Fee */}

        <div
          style={cardStyle}
        >
          <div style={labelStyle}>
            PLATFORM FEE
          </div>

          <div
            style={{
              color: "#FFFFFF",
              marginTop: 14,
            }}
          >
            30% Management Fee
          </div>

          <div
            style={{
              color: "#B8C4E0",
              marginTop: 10,
            }}
          >
            70% Distributed as User Rewards
          </div>
        </div>

        {/* Button */}

        <button
          style={{
            height: 55,
            border: "none",
            borderRadius: 15,
            background:
              "linear-gradient(90deg,#7C3AED,#9333EA)",
            color: "#FFFFFF",
            fontWeight: 700,
            fontSize: 20,
            cursor: "pointer",
            marginBottom: 30,
          }}
        >
          CONFIRM & PAY
        </button>
      </div>
    </main>
  );
}

const labelStyle = {
  color: "#FFFFFF",
  fontWeight: 700,
} as const;

const helperStyle = {
  color: "#94A3B8",
  fontSize: 13,
  marginTop: 4,
} as const;

const inputStyle = {
  width: "100%",
  marginTop: 10,
  background: "#1E2A4A",
  border: "1px solid #31456E",
  borderRadius: 16,
  color: "#FFFFFF",
  padding: 16,
  fontSize: 16,
  boxSizing: "border-box" as const,
};

const textareaStyle = {
  ...inputStyle,
  resize: "none" as const,
};

const cardStyle = {
  background: "#1E2A4A",
  border: "1px solid #31456E",
  borderRadius: 18,
  padding: 18,
};

const tokenButton = {
  flex: 1,
  height: 48,
  borderRadius: 14,
  border: "1px solid #31456E",
  background: "#1E2A4A",
  color: "#FFFFFF",
  cursor: "pointer",
  fontWeight: 700,
};

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
  color: "#FFFFFF",
  fontSize: 16,
} as const;