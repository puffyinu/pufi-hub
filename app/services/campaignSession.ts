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
      logo: "",
      rewardToken: "PUFI",
      rewardAmount: 1,
      miniAppUrl: "https://worldcoin.org",
      budget: 1000,
      totalClicks: 1000,
      remainingClicks: 1000,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      createdBy: "system",
    },
    {
      id: "first-reward",
      title: "First Reward",
      description: "Claim your first reward.",
      logo: "",
      rewardToken: "PUFI",
      rewardAmount: 20,
      miniAppUrl: "https://worldcoin.org",
      budget: 2000,
      totalClicks: 100,
      remainingClicks: 100,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
      createdBy: "system",
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

    // Lightweight migration for legacy campaigns
    let migrated = false;
    session.campaigns = (session.campaigns as unknown[]).map((item) => {
      let updated = false;
      const campaign = { ...(item as Record<string, unknown>) };

      if (campaign.remainingClicks === undefined) {
        campaign.remainingClicks = campaign.totalClicks ?? 0;
        updated = true;
      }

      if (campaign.logo === undefined) {
        campaign.logo = "";
        updated = true;
      }

      if (updated) {
        migrated = true;
        return campaign as unknown as Campaign;
      }
      return item as Campaign;
    });

    if (migrated) {
      storage().save(STORAGE_KEY, session);
    }
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

export function addCampaign(campaign: Campaign): void {
  const state = ensureState();
  const updated = [...state.campaigns, campaign];
  saveCampaigns(updated);
}

export function resetCampaigns(): void {
  session = {
    ...DEFAULT_STATE,
  };

  storage().remove(STORAGE_KEY);

  notify();
}