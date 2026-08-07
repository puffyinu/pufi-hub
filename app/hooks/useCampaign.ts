"use client";

import { useEffect, useState, useCallback } from "react";

import {
  CAMPAIGN_SESSION_EVENT,
} from "@/app/services/campaignSession";

import {
  getCampaigns,
  recordClaim,
  resetCampaigns,
  createCampaign,
  fetchActiveCampaigns,
} from "@/app/services/campaignEngine";

export function useCampaign() {
  const [campaigns, setCampaigns] =
    useState(getCampaigns());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchActiveCampaigns();
      setCampaigns(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch campaigns");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const sync = () => {
      setCampaigns(
        getCampaigns()
      );
    };

    // Initial fetch from Supabase if empty or just to be fresh
    // Wrapped in setTimeout to avoid cascading renders warning
    const timer = setTimeout(() => {
      refresh();
    }, 0);

    window.addEventListener(
      CAMPAIGN_SESSION_EVENT,
      sync
    );

    return () => {
      clearTimeout(timer);
      window.removeEventListener(
        CAMPAIGN_SESSION_EVENT,
        sync
      );
    };
  }, [refresh]);

  return {
    campaigns,
    loading,
    error,
    refresh,
    recordClaim,
    resetCampaigns,
    createCampaign,
  };
}