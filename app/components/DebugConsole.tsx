"use client";

import { useEffect } from "react";

export default function DebugConsole() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_RUNTIME_MODE !== "development") {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/eruda";

    script.onload = () => {
      // @ts-ignore
      window.eruda?.init();

      console.log("[DEBUG] Eruda initialized");
    };

    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}