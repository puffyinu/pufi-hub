"use client";

import { useEffect, useState } from "react";

import {
  CAMPAIGN_SESSION_EVENT,
} from "@/app/services/campaignSession";

import {
  getCampaigns,
  recordClaim,
  resetCampaigns,
  createCampaign,
} from "@/app/services/campaignEngine";

export function useCampaign() {
  const [campaigns, setCampaigns] =
    useState(getCampaigns());

  useEffect(() => {
    const sync = () => {
      setCampaigns(
        getCampaigns()
      );
    };

    sync();

    window.addEventListener(
      CAMPAIGN_SESSION_EVENT,
      sync
    );

    return () => {
      window.removeEventListener(
        CAMPAIGN_SESSION_EVENT,
        sync
      );
    };
  }, []);

  return {
    campaigns,
    recordClaim,
    resetCampaigns,
    createCampaign,
  };
}