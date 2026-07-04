"use client";

import { useState } from "react";
import { verifyWallet } from "../services/auth";
import type { UserSession } from "../types/auth";

export function useAuth() {
  const [user, setUser] = useState<UserSession | null>(null);

  async function login(address: string) {
    const session = await verifyWallet(address);
    setUser(session);
  }

  return {
    user,
    login,
  };
}