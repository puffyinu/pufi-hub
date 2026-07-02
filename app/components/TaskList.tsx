export default function TaskList() {
  const tasks = [
    "Daily Check-In",
    "Visit Sponsor",
    "Claim Reward",
    "Invite Friend",
  ];

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
          color: "#FFFFFF",
          fontSize: "22px",
        }}
      >
        Daily Tasks
      </h3>

      <div style={{ marginTop: "20px" }}>
        {tasks.map((task, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "14px 0",
              borderBottom:
                index !== tasks.length - 1
                  ? "1px solid #23304A"
                  : "none",
            }}
          >
            <span
              style={{
                color: "#FFC857",
                marginRight: "12px",
                fontSize: "18px",
              }}
            >
              ○
            </span>

            <span
              style={{
                color: "#FFFFFF",
                fontSize: "16px",
              }}
            >
              {task}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}