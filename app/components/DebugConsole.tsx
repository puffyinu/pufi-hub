"use client";

import { useEffect, useState } from "react";

interface LogEntry {
  level: "log" | "warn" | "error";
  message: string;
  time: string;
}

function checkDebugEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("debug") === "1";
}

export default function DebugConsole() {
  const [enabled] = useState<boolean>(checkDebugEnabled);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!enabled) return;

    const push = (level: LogEntry["level"], args: unknown[]) => {
      const message = args
        .map((a) => {
          try {
            return typeof a === "string" ? a : JSON.stringify(a);
          } catch {
            return String(a);
          }
        })
        .join(" ");

      const time = new Date().toLocaleTimeString();

      setLogs((prev) => [...prev.slice(-49), { level, message, time }]);
    };

    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = (...args: unknown[]) => {
      push("log", args);
      originalLog(...args);
    };
    console.warn = (...args: unknown[]) => {
      push("warn", args);
      originalWarn(...args);
    };
    console.error = (...args: unknown[]) => {
      push("error", args);
      originalError(...args);
    };

    push("log", ["[DEBUG] Custom console panel initialized"]);

    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 999999,
        maxHeight: visible ? "45vh" : "32px",
        overflowY: "auto",
        background: "rgba(0,0,0,0.92)",
        color: "#0f0",
        fontFamily: "monospace",
        fontSize: "10px",
        padding: "4px 8px",
        borderTop: "2px solid #0f0",
      }}
    >
      <div
        onClick={() => setVisible((v) => !v)}
        style={{
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
          marginBottom: "4px",
        }}
      >
        DEBUG CONSOLE ({logs.length}) — tap to {visible ? "hide" : "show"}
      </div>
      {visible &&
        logs.map((l, i) => (
          <div
            key={i}
            style={{
              color:
                l.level === "error"
                  ? "#f66"
                  : l.level === "warn"
                  ? "#fd0"
                  : "#0f0",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              marginBottom: "2px",
            }}
          >
            [{l.time}] {l.message}
          </div>
        ))}
    </div>
  );
}
