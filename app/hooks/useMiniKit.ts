"use client";

import { useMemo } from "react";
import { miniKit } from "../config/minikit";

export function useMiniKit() {
  const installed = useMemo(() => miniKit.isInstalled(), []);

  return {
    installed,
    miniKit,
  };
}