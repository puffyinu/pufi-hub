import { useMemo } from "react";
import {
  getSession,
  hasSession,
} from "@/app/services/session";

export function useSession() {
  return useMemo(() => {
    return {
      session: getSession(),
      authenticated: hasSession(),
    };
  }, []);
}
