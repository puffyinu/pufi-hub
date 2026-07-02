export default function ActivityCard() {
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
        Recent Activity
      </h3>

      <p
        style={{
          color: "#94A3B8",
          margin: 0,
        }}
      >
        No activity yet.
      </p>
    </div>
  );
}