import Link from "next/link";

export default function CreatorPage() {
  return (
    <main
      style={{
        maxWidth: 900,
        margin: "0 auto",
        padding: 24,
      }}
    >
      <Link
        href="/dashboard"
        style={{
          display: "inline-block",
          marginBottom: 20,
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
          fontSize: 30,
          fontWeight: 700,
          color: "#FFFFFF",
          marginBottom: 24,
        }}
      >
        Creator Center
      </h1>

      <section
        style={{
          background: "#1E2A4A",
          border: "1px solid #31456E",
          borderRadius: 20,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#FFFFFF",
            marginBottom: 12,
          }}
        >
          Create Campaign
        </h2>

        <p
          style={{
            color: "#B8C4E0",
            margin: 0,
          }}
        >
          Coming Soon
        </p>
      </section>

      <section
        style={{
          background: "#1E2A4A",
          border: "1px solid #31456E",
          borderRadius: 20,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#FFFFFF",
            marginBottom: 12,
          }}
        >
          My Campaigns
        </h2>

        <p
          style={{
            color: "#B8C4E0",
            margin: 0,
          }}
        >
          No campaign yet.
        </p>
      </section>

      <section
        style={{
          background: "#1E2A4A",
          border: "1px solid #31456E",
          borderRadius: 20,
          padding: 20,
        }}
      >
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#FFFFFF",
            marginBottom: 16,
          }}
        >
          Campaign Statistics
        </h2>

        <div style={{ color: "#B8C4E0", lineHeight: 2 }}>
          <div>Active Campaign : 0</div>
          <div>Paused Campaign : 0</div>
          <div>Completed Campaign : 0</div>
        </div>
      </section>

      <Link
  href="/creator/create"
  style={{
    position: "fixed",
    left: "50%",
    bottom: 28,
    transform: "translateX(-50%)",
    textDecoration: "none",
    zIndex: 1000,
  }}
>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "14px 22px",
      borderRadius: 999,
      background: "#7C3AED",
      color: "#FFFFFF",
      fontWeight: 700,
      fontSize: 16,
      boxShadow: "0 10px 30px rgba(124,58,237,.35)",
    }}
  >
    <span
      style={{
        fontSize: 24,
        lineHeight: 1,
      }}
    >
      ＋
    </span>

    <span>ADD ADS</span>
  </div>
</Link>

    </main>
  );
}