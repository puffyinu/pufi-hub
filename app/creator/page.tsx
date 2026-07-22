"use client";

import Link from "next/link";

export default function CreatorPage() {
  return (
    <main
      style={{
        maxWidth: 600,
        margin: "0 auto",
        padding: "16px 20px",
        paddingBottom: 80,
      }}
    >
      <Link
        href="/dashboard"
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
          fontSize: 16,
          fontWeight: 800,
          marginTop: 0,
          marginBottom: 20,
          letterSpacing: "-0.02em",
        }}
      >
        MY CAMPAIGNS
      </h1>

      <SectionTitle title="FREE SLOT #1" />
      <CampaignCard />

      <SectionTitle title="FREE SLOT #2" />
      <CampaignCard />

      <SectionTitle title="PREMIUM SLOT #3" />
      <LockedSlot price="2 USDC" />

      <SectionTitle title="PREMIUM SLOT #4" />
      <LockedSlot price="3 USDC" />

      <SectionTitle title="PREMIUM SLOT #5" />
      <LockedSlot price="5 USDC" />

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 600,
          padding: "16px 20px",
          background: "linear-gradient(to top, #0F172A 80%, transparent)",
          zIndex: 100,
        }}
      >
        <Link
          href="/creator/create"
          style={{ textDecoration: "none", display: "block" }}
        >
          <button
            style={{
              width: "100%",
              height: 48,
              border: "none",
              borderRadius: 14,
              background: "linear-gradient(90deg, #7C3AED, #9333EA)",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(124, 58, 237, 0.3)",
            }}
          >
            ＋ ADD ADS
          </button>
        </Link>
      </div>
    </main>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <div
      style={{
        color: "#64748B",
        fontWeight: 700,
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginBottom: 8,
        paddingLeft: 4,
      }}
    >
      {title}
    </div>
  );
}

function CampaignCard() {
  return (
    <div style={cardStyle}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          width: "100%",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "#2C4675",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            flexShrink: 0,
          }}
        >
          🚀
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                color: "#FFFFFF",
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              My Awesome App
            </div>

            <div
              style={{
                color: "#22C55E",
                fontWeight: 700,
                fontSize: 10,
                background: "rgba(34, 197, 94, 0.1)",
                padding: "2px 6px",
                borderRadius: 4,
                letterSpacing: 0.5,
              }}
            >
              🟢 LIVE
            </div>
          </div>

          <div
            style={{
              color: "#94A3B8",
              marginTop: 2,
              fontSize: 12,
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            Empowering the next generation of decentralized applications.
          </div>
        </div>
      </div>

      <div
        style={{
          height: 1,
          background: "#31456E",
          margin: "12px 0",
          opacity: 0.5,
        }}
      />

      {/* STATS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div style={{ borderRight: "1px solid rgba(49, 69, 110, 0.3)" }}>
          <div style={statLabelStyle}>Current Pool</div>
          <div style={statValueStyle}>10 PUFI</div>
        </div>

        <div style={{ borderRight: "1px solid rgba(49, 69, 110, 0.3)" }}>
          <div style={statLabelStyle}>Total Clicks</div>
          <div style={statValueStyle}>50</div>
        </div>

        <div>
          <div style={statLabelStyle}>Reward</div>
          <div style={statValueStyle}>1 PUFI</div>
        </div>
      </div>

      <div
        style={{
          height: 1,
          background: "#31456E",
          margin: "12px 0",
          opacity: 0.5,
        }}
      />

      {/* ACTIONS */}
      <div
        style={{
          display: "flex",
          gap: 8,
          width: "100%",
        }}
      >
        <button style={actionButtonStyle}>EDIT</button>
        <button style={addPoolButtonStyle}>ADD POOL</button>
        <button style={deleteButtonStyle}>DELETE</button>
      </div>
    </div>
  );
}

function LockedSlot({ price }: { price: string }) {
  return (
    <div style={lockedCardStyle}>
      <div style={{ fontSize: 24, marginBottom: 8 }}>🔒</div>
      <div
        style={{
          color: "#FFFFFF",
          fontWeight: 700,
          fontSize: 14,
        }}
      >
        Unlock Slot
      </div>
      <div
        style={{
          color: "#64748B",
          fontSize: 12,
          marginTop: 2,
        }}
      >
        One-Time Payment
      </div>
      <div
        style={{
          color: "#7C3AED",
          fontWeight: 800,
          fontSize: 18,
          marginTop: 6,
        }}
      >
        {price}
      </div>
    </div>
  );
}

const cardStyle = {
  width: "100%",
  background: "#1E293B",
  border: "1px solid #334155",
  borderRadius: 16,
  padding: "16px",
  boxSizing: "border-box" as const,
  marginBottom: 16,
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
};

const lockedCardStyle = {
  ...cardStyle,
  display: "flex",
  flexDirection: "column" as const,
  justifyContent: "center",
  alignItems: "center",
  minHeight: 140,
  borderStyle: "dashed",
  background: "rgba(30, 41, 59, 0.5)",
};

const statLabelStyle = {
  color: "#94A3B8",
  fontSize: 10,
  fontWeight: 600,
  textTransform: "uppercase" as const,
  letterSpacing: "0.02em",
};

const statValueStyle = {
  color: "#FFFFFF",
  fontWeight: 700,
  fontSize: 14,
  marginTop: 2,
};

const actionButtonStyle = {
  flex: 1,
  height: 32,
  borderRadius: 8,
  border: "1px solid #334155",
  background: "#334155",
  color: "#FFFFFF",
  fontWeight: 700,
  fontSize: 11,
  cursor: "pointer",
  transition: "all 0.2s",
};

const addPoolButtonStyle = {
  ...actionButtonStyle,
  background: "#7C3AED",
  border: "none",
};

const deleteButtonStyle = {
  ...actionButtonStyle,
  background: "#991B1B",
  border: "none",
};
