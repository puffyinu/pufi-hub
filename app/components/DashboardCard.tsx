type DashboardCardProps = {
  title: string;
  value: string;
};

export default function DashboardCard({
  title,
  value,
}: DashboardCardProps) {
  return (
    <div
      style={{
        background: "#16213E",
        border: "1px solid #23304A",
        borderRadius: "16px",
        padding: "24px",
        minWidth: "240px",
      }}
    >
      <p
        style={{
          margin: 0,
          color: "#94A3B8",
          fontSize: "14px",
        }}
      >
        {title}
      </p>

      <h2
        style={{
          marginTop: "12px",
          color: "#FFFFFF",
          fontSize: "32px",
        }}
      >
        {value}
      </h2>
    </div>
  );
}