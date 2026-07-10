"use client";

import { useEffect, useState } from "react";

import {
  getRuntimeState,
  resetRuntimeState,
  RUNTIME_SESSION_EVENT,
} from "@/app/services/runtimeSession";

export function useRuntime() {
  const [runtime, setRuntime] =
    useState(getRuntimeState());

  useEffect(() => {
    function sync() {
      setRuntime(getRuntimeState());
    }

    sync();

    window.addEventListener(
      RUNTIME_SESSION_EVENT,
      sync
    );

    return () => {
      window.removeEventListener(
        RUNTIME_SESSION_EVENT,
        sync
      );
    };
  }, []);

  return {
    runtime,
    reset: resetRuntimeState,
  };
}