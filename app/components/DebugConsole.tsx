"use client";

import { useEffect } from "react";

export default function DebugConsole() {
  useEffect(() => {
    const shouldDebug =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("debug") === "1";

    if (!shouldDebug) return;

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/eruda";
    script.onload = () => {
      // @ts-expect-error - eruda attaches to window at runtime
      window.eruda?.init();
      console.log("[DEBUG] Eruda console initialized");
    };
    document.body.appendChild(script);
  }, []);

  return null;
}
