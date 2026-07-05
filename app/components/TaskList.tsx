"use client";

import { useTask } from "@/app/hooks/useTask";

export default function TaskList() {
  const {
    tasks,
    completeTask,
  } = useTask();

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
            onClick={() => {
              if (!task.completed) {
                completeTask(task.id);
              }
            }}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "14px 0",
              borderBottom:
                index !== tasks.length - 1
                  ? "1px solid #23304A"
                  : "none",
              cursor: task.completed
                ? "default"
                : "pointer",
            }}
          >
            <span
              style={{
                color: "#FFC857",
                marginRight: "12px",
                fontSize: "18px",
              }}
            >
              {task.completed ? "✓" : "○"}
            </span>

            <span
              style={{
                color: "#FFFFFF",
                fontSize: "16px",
              }}
            >
              {task.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}