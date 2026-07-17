import { provider } from "@/app/providers/providerAccess";

import type {
  Campaign,
  CampaignState,
} from "@/app/types/campaign";

const STORAGE_KEY = "pufi-campaign-session";

export const CAMPAIGN_SESSION_EVENT =
  "pufi-campaign-session-changed";

const DEFAULT_STATE: CampaignState = {
  campaigns: [
    {
      id: "daily-checkin",
      title: "Daily Check-In",
      description: "Complete today's daily check-in.",
      reward: 1,
      completed: false,
    },
    {
      id: "first-reward",
      title: "First Reward",
      description: "Claim your first reward.",
      reward: 20,
      completed: false,
    },
  ],
};

let session: CampaignState | null = null;

function storage() {
  return provider();
}

function notify(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(
        CAMPAIGN_SESSION_EVENT
      )
    );
  }
}

function ensureState(): CampaignState {
  if (session === null) {
    session =
      storage().load<CampaignState>(
        STORAGE_KEY
      ) ?? DEFAULT_STATE;
  }

  return session;
}

export function getCampaignState(): CampaignState {
  return ensureState();
}

export function getCampaigns(): Campaign[] {
  return ensureState().campaigns;
}

export function saveCampaigns(
  campaigns: Campaign[]
): void {
  session = {
    campaigns,
  };

  storage().save(STORAGE_KEY, session);

  notify();
}

export function resetCampaigns(): void {
  session = {
    ...DEFAULT_STATE,
  };

  storage().remove(STORAGE_KEY);

  notify();
}