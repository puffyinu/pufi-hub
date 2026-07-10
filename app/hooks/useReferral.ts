"use client";

import { useEffect, useState } from "react";
import {
  REFERRAL_EVENT,
  claimReferral,
  getReferrals,
  resetReferrals,
  type Referral,
} from "@/app/services/referral";

export function useReferral() {
  const [referrals, setReferrals] = useState<Referral[]>([]);

  useEffect(() => {
    function syncReferrals() {
      setReferrals(getReferrals());
    }

    syncReferrals();
    window.addEventListener(REFERRAL_EVENT, syncReferrals);

    return () => {
      window.removeEventListener(REFERRAL_EVENT, syncReferrals);
    };
  }, []);

  return {
    referrals,
    claimReferral,
    resetReferrals,
  };
}
