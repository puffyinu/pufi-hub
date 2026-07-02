"use client";

import { useEffect, useState } from "react";
import { miniKit } from "../config/minikit";

export function useMiniKit() {
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    setInstalled(miniKit.isInstalled());
  }, []);

  return {
    installed,
    miniKit,
  };
}