"use client";

import { useEffect } from "react";
import { runtimeCoordinator } from "./runtimeCoordinator";

export default function RuntimeBootstrap() {
  useEffect(() => {
    void runtimeCoordinator.initialize();
  }, []);

  return null;
}