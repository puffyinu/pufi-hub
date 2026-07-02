export default function Sidebar() {
  return (
    <aside
      style={{
        width: "260px",
        height: "100%",
        borderRight: "1px solid #23304A",
        padding: "24px",
        boxSizing: "border-box",
      }}
    >
      <h3
        style={{
          color: "#FFFFFF",
          marginBottom: "24px",
        }}
      >
        Navigation
      </h3>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <span style={{ color: "#FFC857" }}>Dashboard</span>
        <span style={{ color: "#94A3B8" }}>Wallet</span>
        <span style={{ color: "#94A3B8" }}>Tasks</span>
        <span style={{ color: "#94A3B8" }}>Rewards</span>
        <span style={{ color: "#94A3B8" }}>Profile</span>
      </nav>
    </aside>
  );
}