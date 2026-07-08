"use client";

import { useEffect, useState } from "react";

import {
  ACTIVITY_SESSION_EVENT,
  clearActivities,
  getActivities,
} from "@/app/services/activitySession";

export function useActivity() {
  const [activities, setActivities] =
    useState(getActivities());

  useEffect(() => {
    const sync = () => {
      setActivities(getActivities());
    };

    sync();

    window.addEventListener(
      ACTIVITY_SESSION_EVENT,
      sync
    );

    return () => {
      window.removeEventListener(
        ACTIVITY_SESSION_EVENT,
        sync
      );
    };
  }, []);

  return {
    activities,
    clear: clearActivities,
  };
}