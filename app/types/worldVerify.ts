export interface WorldVerifyState {
  verified: boolean;
  proof: string | null;
  nullifierHash: string | null;
  verificationLevel: string | null;
  verifiedAt: string | null;
}

export const DEFAULT_WORLD_VERIFY_STATE: WorldVerifyState = {
  verified: false,
  proof: null,
  nullifierHash: null,
  verificationLevel: null,
  verifiedAt: null,
};