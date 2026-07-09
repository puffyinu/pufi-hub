"use client";

import { useEffect, useState } from "react";

import {
  CAMPAIGN_SESSION_EVENT,
} from "@/app/services/campaignSession";

import {
  getCampaignList,
  completeCampaign,
  resetCampaigns,
} from "@/app/services/campaignEngine";

export function useCampaign() {
  const [campaigns, setCampaigns] =
    useState(getCampaignList());

  useEffect(() => {
    const sync = () => {
      setCampaigns(
        getCampaignList()
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
    completeCampaign,
    resetCampaigns,
  };
}