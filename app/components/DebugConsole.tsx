"use client";

import { useEffect, useState } from "react";

interface LogEntry {
  level: "log" | "warn" | "error";
  message: string;
  time: string;
}

function checkDebugEnabled(): boolean {
  if (typeof window === "undefined") return false;

  const params = new URLSearchParams(window.location.search);
  const debugFlag = params.get("debug") === "1";
  const keyParam = params.get("key");
  const expectedKey = process.env.NEXT_PUBLIC_DEBUG_KEY;

  if (!debugFlag) return false;

  // If a debug key is configured, require it to match.
  if (expectedKey && expectedKey.length > 0) {
    return keyParam === expectedKey;
  }

  // Fallback: if no key configured, allow ?debug=1 alone (dev convenience).
  return true;
}

/**
 * Redacts sensitive-looking substrings (0x hex addresses/signatures,
 * long alphanumeric nonces) so raw secrets are not fully visible on screen.
 */
function redact(message: string): string {
  let out = message;

  // Mask 0x-prefixed hex strings (addresses, signatures) longer than 10 chars
  out = out.replace(/0x[a-fA-F0-9]{10,}/g, (match) => {
    if (match.length <= 12) return match;
    return `${match.slice(0, 6)}...${match.slice(-4)}`;
  });

  // Mask "nonce = XXXX" style values (alphanumeric, 8+ chars)
  out = out.replace(
    /(nonce\s*[:=]\s*)([A-Za-z0-9]{8,})/gi,
    (_m, prefix: string, value: string) =>
      `${prefix}${value.slice(0, 4)}...${value.slice(-4)}`
  );

  return out;
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

      setLogs((prev) => [
        ...prev.slice(-49),
        { level, message: redact(message), time },
      ]);
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

    push("log", ["[DEBUG] Custom console panel initialized (redacted mode)"]);

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
