import { load, save, remove } from "@/app/services/storage";
import { addReward } from "@/app/services/reward";

export interface Referral {
  id: string;
  username: string;
  reward: number;
  claimed: boolean;
}

export const REFERRAL_EVENT = "referralUpdated";

const STORAGE_KEY = "pufi_referrals";

const DEFAULT_REFERRALS: Referral[] = [
  {
    id: "referral-1",
    username: "@world_friend",
    reward: 100,
    claimed: false,
  },
  {
    id: "referral-2",
    username: "@crypto_user",
    reward: 100,
    claimed: false,
  },
];

function notifyReferralUpdated(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(REFERRAL_EVENT));
  }
}

function getReferrals(): Referral[] {
  const storedReferrals = load<Referral[]>(STORAGE_KEY);

  if (!storedReferrals || storedReferrals.length === 0) {
    saveReferrals(DEFAULT_REFERRALS);
    return DEFAULT_REFERRALS;
  }

  return storedReferrals;
}

function saveReferrals(referrals: Referral[]): void {
  save(STORAGE_KEY, referrals);
  notifyReferralUpdated();
}

function claimReferral(id: string): boolean {
  const referrals = getReferrals();
  const referral = referrals.find(item => item.id === id);

  if (!referral || referral.claimed) {
    return false;
  }

  const updatedReferrals = referrals.map(item =>
    item.id === id
      ? { ...item, claimed: true }
      : item
  );

  saveReferrals(updatedReferrals);
  addReward(referral.reward);
  return true;
}

function resetReferrals(): void {
  remove(STORAGE_KEY);
  saveReferrals(DEFAULT_REFERRALS);
}

export { getReferrals, saveReferrals, claimReferral, resetReferrals };
