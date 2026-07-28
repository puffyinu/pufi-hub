"use client";

import { useState } from "react";

import {
  verifyWorldId,
  getWorldVerifyConfig,
  isWorldVerifyConfigured,
} from "@/app/services/worldVerify";

export function useWorldVerify() {
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  async function verify() {
    setLoading(true);
    setError(null);

    const result = await verifyWorldId();

    if (!result.success) {
      setError(result.error ?? "Verification failed.");
    }

    setLoading(false);

    return result;
  }

  return {
    configured: isWorldVerifyConfigured(),
    config: getWorldVerifyConfig(),
    loading,
    error,
    verify,
  };
}