import { load, save, remove } from "@/app/services/storage";

import type {
  Campaign,
  CampaignState,
} from "@/app/types/campaign";

const STORAGE_KEY =
  "pufi-campaign-session";

export const CAMPAIGN_SESSION_EVENT =
  "pufi-campaign-session-changed";

const DEFAULT_STATE: CampaignState = {
  campaigns: [
    {
      id: "visit-website",
      title: "Visit PUFI Website",
      description:
        "Visit the official PUFI website.",
      reward: 10,
      completed: false,
    },
    {
      id: "join-community",
      title: "Join Community",
      description:
        "Join the official PUFI community.",
      reward: 20,
      completed: false,
    },
  ],
};

let session: CampaignState | null = null;

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
      load<CampaignState>(
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

  save(STORAGE_KEY, session);

  notify();
}

export function resetCampaigns(): void {
  session = {
    ...DEFAULT_STATE,
  };

  remove(STORAGE_KEY);

  notify();
}