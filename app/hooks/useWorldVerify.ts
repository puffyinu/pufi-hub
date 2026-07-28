"use client";

import { useMemo } from "react";
import {
  getWorldVerifyConfig,
  isWorldVerifyConfigured,
} from "@/app/services/worldVerify";

export function useWorldVerify() {
  const configured = useMemo(
    () => isWorldVerifyConfigured(),
    []
  );

  const config = useMemo(
    () => getWorldVerifyConfig(),
    []
  );

  return {
    configured,
    config,
  };
}