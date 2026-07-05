"use client";

import { useEffect, useState } from "react";
import {
  CAMPAIGN_EVENT,
  completeCampaign,
  getCampaigns,
  resetCampaigns,
} from "@/app/services/campaign";

export function useCampaign() {
  const [campaigns, setCampaigns] = useState(getCampaigns());

  useEffect(() => {
    function syncCampaigns() {
      setCampaigns(getCampaigns());
    }

    window.addEventListener(CAMPAIGN_EVENT, syncCampaigns);

    return () => {
      window.removeEventListener(CAMPAIGN_EVENT, syncCampaigns);
    };
  }, []);

  return {
    campaigns,
    completeCampaign,
    resetCampaigns,
  };
}
