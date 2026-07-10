"use client";

import { useTask } from "@/app/hooks/useTask";

export default function TaskList() {
  const {
    tasks,
    completeTask,
    resetTasks,
  } = useTask();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const remainingTasks = totalTasks - completedTasks;
  const rewardEarned = completedTasks * 5;
  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

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
          margin: 0,
          color: "#FFFFFF",
          fontSize: "22px",
        }}
      >
        Task Center
      </h3>

      <p
        style={{
          color: "#9CA3AF",
          marginTop: "8px",
          marginBottom: "20px",
        }}
      >
        {progress}% Completed
      </p>

      <div
        style={{
          width: "100%",
          height: "8px",
          background: "#23304A",
          borderRadius: "999px",
          overflow: "hidden",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "#4ADE80",
            transition: "width 0.3s ease",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <SummaryItem label="Total Tasks" value={totalTasks} />
        <SummaryItem label="Completed" value={completedTasks} />
        <SummaryItem label="Remaining" value={remainingTasks} />
        <SummaryItem label="Reward" value={`+${rewardEarned} PUFI`} />
      </div>

      <div>
        {tasks.map((task, index) => (
          <div
            key={task.id}
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
                color: task.completed
                  ? "#4ADE80"
                  : "#FFC857",
                fontSize: "18px",
                marginRight: "12px",
              }}
            >
              {task.completed ? "✓" : "○"}
            </span>

            <span
              style={{
                color: "#FFFFFF",
                flex: 1,
              }}
            >
              {task.title}
            </span>

            {task.completed && (
              <span
                style={{
                  color: "#4ADE80",
                  fontSize: "13px",
                }}
              >
                +5
              </span>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={resetTasks}
        style={{
          width: "100%",
          marginTop: "24px",
          padding: "12px",
          borderRadius: "10px",
          border: "none",
          cursor: "pointer",
          background: "#374151",
          color: "#FFFFFF",
          fontWeight: 600,
        }}
      >
        Reset Progress
      </button>
    </div>
  );
}

interface SummaryItemProps {
  label: string;
  value: string | number;
}

function SummaryItem({
  label,
  value,
}: SummaryItemProps) {
  return (
    <div
      style={{
        background: "#16213A",
        borderRadius: "12px",
        padding: "16px",
      }}
    >
      <div
        style={{
          color: "#9CA3AF",
          fontSize: "13px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          color: "#FFFFFF",
          fontSize: "22px",
          fontWeight: 700,
          marginTop: "6px",
        }}
      >
        {value}
      </div>
    </div>
  );
}