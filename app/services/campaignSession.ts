import { provider } from "@/app/providers/providerAccess";

import type {
  Campaign,
  CampaignState,
} from "@/app/types/campaign";

const STORAGE_KEY = "pufi-campaign-session";

export const CAMPAIGN_SESSION_EVENT =
  "pufi-campaign-session-changed";

const DEFAULT_STATE: CampaignState = {
  campaigns: [],
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

    // Migration logic
    let migrated = false;
    session.campaigns = (session.campaigns as unknown as Record<string, unknown>[]).map((item) => {
      let updated = false;
      const campaign = { ...item };

      // Migrate totalClicks/remainingClicks to maxClaims/claimedCount
      if (campaign.maxClaims === undefined) {
        campaign.maxClaims = campaign.totalClicks ?? 0;
        updated = true;
      }
      if (campaign.claimedCount === undefined) {
        const remaining = (campaign.remainingClicks as number) ?? (campaign.totalClicks as number) ?? 0;
        campaign.claimedCount = ((campaign.totalClicks as number) ?? 0) - remaining;
        updated = true;
      }

      // Cleanup old fields
      if (campaign.totalClicks !== undefined) {
        delete campaign.totalClicks;
        updated = true;
      }
      if (campaign.remainingClicks !== undefined) {
        delete campaign.remainingClicks;
        updated = true;
      }

      // Update Status to LIVE/COMPLETED
      if ((campaign.claimedCount as number) >= (campaign.maxClaims as number)) {
        if (campaign.status !== "COMPLETED") {
          campaign.status = "COMPLETED";
          updated = true;
        }
      } else {
        if (campaign.status !== "LIVE" && campaign.status !== "PAUSED" && campaign.status !== "ENDED") {
          campaign.status = "LIVE";
          updated = true;
        }
      }

      // Normalize reward model
      const legacyItem = campaign as Record<string, unknown>;
      if (campaign.rewardAmount === undefined) {
        campaign.rewardAmount = (legacyItem.reward as number) ?? 0;
        updated = true;
      }
      if (campaign.rewardToken === undefined) {
        campaign.rewardToken = (legacyItem.token as string) ?? "PUFI";
        updated = true;
      }

      // Cleanup legacy reward fields
      if (legacyItem.reward !== undefined) {
        delete legacyItem.reward;
        updated = true;
      }
      if (legacyItem.token !== undefined) {
        delete legacyItem.token;
        updated = true;
      }

      if (updated) {
        migrated = true;
        return campaign as unknown as Campaign;
      }
      return item as unknown as Campaign;
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

export function updateCampaign(campaign: Campaign): boolean {
  const state = ensureState();
  const exists = state.campaigns.some((c) => c.id === campaign.id);
  if (!exists) return false;

  const updated = state.campaigns.map((c) =>
    c.id === campaign.id ? campaign : c
  );
  saveCampaigns(updated);
  return true;
}

export function deleteCampaign(id: string): boolean {
  const state = ensureState();
  const exists = state.campaigns.some((c) => c.id === id);
  if (!exists) return false;

  const updated = state.campaigns.filter((c) => c.id !== id);
  saveCampaigns(updated);
  return true;
}

export function resetCampaigns(): void {
  session = {
    ...DEFAULT_STATE,
  };

  storage().remove(STORAGE_KEY);

  notify();
}
