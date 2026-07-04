import type { UserSession } from "../types/auth";

export async function verifyWallet(
  address: string
): Promise<UserSession> {
  return {
    address,
    authenticated: true,
  };
}