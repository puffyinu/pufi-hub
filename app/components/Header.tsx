export default function Header() {
  return (
    <header
      style={{
        width: "100%",
        padding: "20px 24px",
        borderBottom: "1px solid #23304A",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            color: "#FFFFFF",
            fontSize: "24px",
            fontWeight: "700",
          }}
        >
          PUFI HUB
        </h2>

        <p
          style={{
            margin: "4px 0 0",
            color: "#94A3B8",
            fontSize: "14px",
          }}
        >
          Human Verified Ads Marketplace
        </p>
      </div>
    </header>
  );
}