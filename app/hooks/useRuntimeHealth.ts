"use client";

import { useMemo } from "react";

import { getRuntimeHealth } from "@/app/services/runtimeHealth";

export function useRuntimeHealth() {
  return useMemo(() => getRuntimeHealth(), []);
}